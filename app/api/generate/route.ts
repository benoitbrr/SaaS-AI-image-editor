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

    // Récupérer les données du formulaire
    const formData = await request.formData()
    const projectId = formData.get('projectId') as string

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId est requis' },
        { status: 400 }
      )
    }

    // Récupérer le projet et vérifier le payment_status
    const { data: project, error: fetchProjectError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (fetchProjectError || !project) {
      return NextResponse.json(
        { error: 'Projet introuvable' },
        { status: 404 }
      )
    }

    // IMPORTANT: Vérifier que le paiement a été effectué
    if (project.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Le paiement n\'a pas été effectué pour ce projet' },
        { status: 403 }
      )
    }

    // Vérifier les variables d'environnement
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Configuration manquante: REPLICATE_API_TOKEN' },
        { status: 500 }
      )
    }

    // Mettre à jour le status à 'processing'
    await supabaseAdmin
      .from('projects')
      .update({ status: 'processing' })
      .eq('id', projectId)

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    const inputImageUrl = project.input_image_url
    const prompt = project.prompt

    // Appeler Replicate avec l'URL de l'image et le prompt
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
        // Mettre à jour le status à 'failed'
        await supabaseAdmin
          .from('projects')
          .update({ status: 'failed' })
          .eq('id', projectId)

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
      
      // Mettre à jour le status à 'failed'
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId)

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
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId)

      return NextResponse.json(
        { error: 'Aucune image générée par Replicate' },
        { status: 500 }
      )
    }

    // Télécharger l'image générée depuis Replicate
    const imageResponse = await fetch(generatedImageUrl)
    const imageBlob = await imageResponse.blob()
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer())

    // Upload l'image générée dans Supabase Storage
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
      
      await supabaseAdmin
        .from('projects')
        .update({ status: 'failed' })
        .eq('id', projectId)

      return NextResponse.json(
        { error: 'Erreur lors de l\'upload de l\'image générée' },
        { status: 500 }
      )
    }

    // Récupérer l'URL publique de l'image générée
    const { data: outputPublicUrlData } = supabaseAdmin
      .storage
      .from('output-images')
      .getPublicUrl(outputFileName)

    const outputImageUrl = outputPublicUrlData.publicUrl

    // Mettre à jour le projet avec l'image générée et status='completed'
    const { data: updatedProject, error: updateProjectError } = await supabaseAdmin
      .from('projects')
      .update({
        output_image_url: outputImageUrl,
        status: 'completed',
      })
      .eq('id', projectId)
      .select()
      .single()

    if (updateProjectError) {
      console.error('Erreur mise à jour projet:', updateProjectError)
    }

    // Retourner l'URL de l'image générée
    return NextResponse.json({
      success: true,
      outputImageUrl: outputImageUrl,
      inputImageUrl: inputImageUrl,
      projectId: projectId,
    })

  } catch (error) {
    console.error('Erreur génération:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image', details: String(error) },
      { status: 500 }
    )
  }
}
