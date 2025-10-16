import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    // Récupérer le body brut (nécessaire pour vérifier la signature)
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ Signature manquante')
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      )
    }

    // Vérifier la signature du webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Erreur vérification signature webhook:', err)
      return NextResponse.json(
        { error: `Webhook Error: ${err instanceof Error ? err.message : 'Signature invalide'}` },
        { status: 400 }
      )
    }

    console.log('✅ Webhook reçu:', event.type)

    // Gérer l'événement checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      console.log('💳 Paiement complété pour session:', session.id)
      console.log('📦 Metadata:', session.metadata)

      const projectId = session.metadata?.project_id
      const userId = session.metadata?.user_id

      if (!projectId) {
        console.error('❌ project_id manquant dans metadata')
        return NextResponse.json(
          { error: 'project_id manquant dans metadata' },
          { status: 400 }
        )
      }

      // Récupérer le payment_intent pour obtenir le payment_intent_id
      const paymentIntentId = typeof session.payment_intent === 'string' 
        ? session.payment_intent 
        : session.payment_intent?.id

      // Mettre à jour le projet dans Supabase
      const supabaseAdmin = getSupabaseAdmin()
      const { data, error } = await supabaseAdmin
        .from('projects')
        .update({
          payment_status: 'paid',
          stripe_payment_intent_id: paymentIntentId,
          stripe_checkout_session_id: session.id,
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur mise à jour projet:', error)
        return NextResponse.json(
          { error: 'Erreur mise à jour projet' },
          { status: 500 }
        )
      }

      console.log('✅ Projet mis à jour:', data)
    }

    // Retourner une réponse 200 pour confirmer la réception du webhook
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Erreur webhook Stripe:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook', details: String(error) },
      { status: 500 }
    )
  }
}
