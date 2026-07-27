import { NextResponse } from 'next/server'
import { pushStorageConfigured } from '@/lib/push-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
  return NextResponse.json({ configured: Boolean(publicKey && pushStorageConfigured()), publicKey })
}
