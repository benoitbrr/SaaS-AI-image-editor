import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const projectId = params.id

    // 1. Récupérer le projet pour vérifier qu'il appartient à l'utilisateur
    const { data: project, error: fetchError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      )
    }

    // 2. Supprimer les images des buckets
    try {
      // Extraire les noms de fichiers depuis les URLs
      const inputImagePath = project.input_image_url.split('/input-images/').pop()
      const outputImagePath = project.output_image_url.split('/output-images/').pop()

      if (inputImagePath) {
        await supabaseAdmin.storage
          .from('input-images')
          .remove([inputImagePath])
      }

      if (outputImagePath) {
        await supabaseAdmin.storage
          .from('output-images')
          .remove([outputImagePath])
      }
    } catch (storageError) {
      console.error('Erreur suppression images:', storageError)
      // On continue même si la suppression des images échoue
    }

    // 3. Supprimer le projet de la base de données
    const { error: deleteError } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Erreur suppression projet:', deleteError)
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression', details: String(error) },
      { status: 500 }
    )
  }
}
