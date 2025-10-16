import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const PRICE_PER_GENERATION = 2.00 // Prix en EUR

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [Checkout] Début de la requête')
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseAdmin = getSupabaseAdmin()
    
    console.log('🔐 [Checkout] Vérification auth...')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    console.log('✅ [Checkout] Auth OK')

    // Récupérer les données JSON envoyées depuis le client
    console.log('📦 [Checkout] Lecture payload JSON...')
    const body = await request.json()
    const { inputImageUrl, prompt } = body as {
      inputImageUrl?: string
      prompt?: string
    }

    if (!inputImageUrl || typeof inputImageUrl !== 'string' || !prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'inputImageUrl et prompt sont requis' },
        { status: 400 }
      )
    }
    console.log('✅ [Checkout] Payload reçu - URL:', inputImageUrl)

    // Créer un projet avec status='pending' et payment_status='pending'
    console.log('💾 [Checkout] Création du projet...')
    const startInsert = Date.now()
    const { data: projectData, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: user.id,
        input_image_url: inputImageUrl,
        output_image_url: null,
        prompt: prompt,
        status: 'pending',
        payment_status: 'pending',
        payment_amount: PRICE_PER_GENERATION,
      })
      .select()
      .single()

    if (projectError) {
      console.error('❌ [Checkout] Erreur création projet:', projectError)
      return NextResponse.json(
        { error: 'Erreur lors de la création du projet' },
        { status: 500 }
      )
    }
    console.log(`✅ [Checkout] Projet créé en ${Date.now() - startInsert}ms - ID: ${projectData.id}`)

    // 4. Créer une session Stripe Checkout
    console.log('💳 [Checkout] Création session Stripe...')
    const startStripe = Date.now()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Génération d\'image IA',
              description: prompt.substring(0, 100), // Description courte
            },
            unit_amount: Math.round(PRICE_PER_GENERATION * 100), // Montant en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      metadata: {
        project_id: projectData.id,
        user_id: user.id,
      },
    })
    console.log(`✅ [Checkout] Session Stripe créée en ${Date.now() - startStripe}ms`)

    // 5. Mettre à jour le projet avec le checkout_session_id (en arrière-plan, pas bloquant)
    // Note: On ne bloque pas la réponse pour cette opération
    void supabaseAdmin
      .from('projects')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', projectData.id)

    console.log(`🎉 [Checkout] Terminé - Redirection vers: ${session.url}`)

    // 6. Retourner l'URL de checkout
    return NextResponse.json({
      checkoutUrl: session.url,
      projectId: projectData.id,
    })

  } catch (error) {
    console.error('❌ [Checkout] Erreur:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la session de paiement', details: String(error) },
      { status: 500 }
    )
  }
}
