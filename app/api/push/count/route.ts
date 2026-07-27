import { NextRequest, NextResponse } from 'next/server'
import { listPushSubscriptions } from '@/lib/push-store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password || request.headers.get('x-admin-password') !== password) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 })
  }
  try {
    const subscriptions = await listPushSubscriptions()
    return NextResponse.json({ count: subscriptions.length })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lecture impossible.' }, { status: 503 })
  }
}
