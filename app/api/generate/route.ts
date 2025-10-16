import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import Replicate from 'replicate'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification via le header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseAdmin = getSupabaseAdmin()
    
    // Vérifier le token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Vérifier les variables d'environnement
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Configuration manquante: REPLICATE_API_TOKEN' },
        { status: 500 }
      )
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Récupérer les données du formulaire
    const formData = await request.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image et prompt sont requis' },
        { status: 400 }
      )
    }

    // Convertir l'image en buffer
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 1. Upload l'image d'entrée dans Supabase Storage
    const inputFileName = `${Date.now()}-${image.name}`
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('input-images')
      .upload(inputFileName, buffer, {
        contentType: image.type,
        cacheControl: '3600',
      })

    if (uploadError) {
      console.error('Erreur upload Supabase:', uploadError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload de l\'image' },
        { status: 500 }
      )
    }

    // 2. Récupérer l'URL publique de l'image uploadée
    const { data: publicUrlData } = supabaseAdmin
      .storage
      .from('input-images')
      .getPublicUrl(inputFileName)

    const inputImageUrl = publicUrlData.publicUrl

    // 3. Appeler Replicate avec l'URL de l'image et le prompt
    console.log('Génération avec Replicate (Google Nano-Banana)...')
    let output: any

    try {
      output = await replicate.run("google/nano-banana", {
        input: {
          prompt,
          image_input: [inputImageUrl],
        },
      })
    } catch (generationError) {
      const message = generationError instanceof Error ? generationError.message : String(generationError)

      if (message.includes('flagged as sensitive') || message.includes('E005')) {
        // Nettoyer l'image uploadée puisqu'on ne l'utilisera pas
        await supabaseAdmin.storage.from('input-images').remove([inputFileName])

        return NextResponse.json(
          {
            error:
              'Le modèle a signalé ce contenu comme sensible. Merci de modifier votre prompt ou de choisir une autre image.',
            code: 'SENSITIVE_CONTENT',
          },
          { status: 400 }
        )
      }

      console.error('Erreur Replicate:', generationError)
      return NextResponse.json(
        { error: 'Erreur lors de la génération avec Replicate' },
        { status: 502 }
      )
    }

    // Nano-banana retourne un objet avec une méthode url()
    const generatedImageUrl = typeof output?.url === 'function' ? output.url() : 
                               (typeof output === 'string' ? output : 
                               (Array.isArray(output) ? output[0] : output?.url || output))

    if (!generatedImageUrl) {
      return NextResponse.json(
        { error: 'Aucune image générée par Replicate' },
        { status: 500 }
      )
    }

    // 4. Télécharger l'image générée depuis Replicate
    const imageResponse = await fetch(generatedImageUrl)
    const imageBlob = await imageResponse.blob()
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer())

    // 5. Upload l'image générée dans Supabase Storage
    const outputFileName = `${Date.now()}-generated.png`
    const { data: outputUploadData, error: outputUploadError } = await supabaseAdmin
      .storage
      .from('output-images')
      .upload(outputFileName, imageBuffer, {
        contentType: 'image/png',
        cacheControl: '3600',
      })

    if (outputUploadError) {
      console.error('Erreur upload image générée:', outputUploadError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'upload de l\'image générée' },
        { status: 500 }
      )
    }

    // 6. Récupérer l'URL publique de l'image générée
    const { data: outputPublicUrlData } = supabaseAdmin
      .storage
      .from('output-images')
      .getPublicUrl(outputFileName)

    const outputImageUrl = outputPublicUrlData.publicUrl

    // 7. Sauvegarder dans la table projects avec user_id
    const { data: projectData, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: user.id,
        input_image_url: inputImageUrl,
        output_image_url: outputImageUrl,
        prompt: prompt,
        status: 'completed',
      })
      .select()
      .single()

    if (projectError) {
      console.error('Erreur sauvegarde projet:', projectError)
      // On continue même si la sauvegarde échoue
    }

    // 8. Retourner l'URL de l'image générée
    return NextResponse.json({
      success: true,
      outputImageUrl: outputImageUrl,
      inputImageUrl: inputImageUrl,
      projectId: projectData?.id,
    })

  } catch (error) {
    console.error('Erreur génération:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image', details: String(error) },
      { status: 500 }
    )
  }
}
