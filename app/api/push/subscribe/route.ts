import { NextRequest, NextResponse } from 'next/server'
import { deletePushSubscription, savePushSubscription } from '@/lib/push-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json() as PushSubscriptionJSON
    if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      return NextResponse.json({ error: 'Abonnement invalide.' }, { status: 400 })
    }
    await savePushSubscription(subscription, request.headers.get('user-agent') || '')
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Abonnement impossible.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json() as { endpoint?: string }
    if (endpoint) await deletePushSubscription(endpoint)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Désabonnement impossible.' }, { status: 500 })
  }
}
