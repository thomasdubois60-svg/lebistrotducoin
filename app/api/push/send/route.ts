import { NextRequest, NextResponse } from 'next/server'
import webpush, { type PushSubscription } from 'web-push'
import { deletePushSubscription, listPushSubscriptions } from '@/lib/push-store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || request.headers.get('x-admin-password') !== adminPassword) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT || 'mailto:lebistrotducoin41220@gmail.com'
  if (!publicKey || !privateKey) {
    return NextResponse.json({ error: 'Clés de notification non configurées dans Vercel.' }, { status: 503 })
  }

  const { title, body, url } = await request.json() as { title?: string; body?: string; url?: string }
  if (!title?.trim() || !body?.trim()) return NextResponse.json({ error: 'Titre et message obligatoires.' }, { status: 400 })

  webpush.setVapidDetails(subject, publicKey, privateKey)
  const subscriptions = await listPushSubscriptions()
  let sent = 0
  let failed = 0
  let removed = 0
  const payload = JSON.stringify({ title: title.trim(), body: body.trim(), url: url || '/' })

  await Promise.all(subscriptions.map(async row => {
    try {
      await webpush.sendNotification(row.subscription as PushSubscription, payload)
      sent += 1
    } catch (error) {
      failed += 1
      const statusCode = typeof error === 'object' && error && 'statusCode' in error ? Number(error.statusCode) : 0
      if (statusCode === 404 || statusCode === 410) {
        await deletePushSubscription(row.endpoint)
        removed += 1
      }
    }
  }))

  return NextResponse.json({ ok: true, sent, failed, removed, total: subscriptions.length })
}
