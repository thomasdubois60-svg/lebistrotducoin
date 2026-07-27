import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminSessionToken } from '@/lib/admin-auth'
export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
  const configured = process.env.ADMIN_PASSWORD
  if (!configured) return NextResponse.json({ error: 'Administration non configurée.' }, { status: 503 })
  const { password } = await request.json().catch(() => ({ password: '' }))
  if (password !== configured) return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, adminSessionToken(), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
  return response
}
