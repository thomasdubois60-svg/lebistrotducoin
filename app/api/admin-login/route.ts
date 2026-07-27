import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
  const configured = process.env.ADMIN_PASSWORD
  if (!configured) return NextResponse.json({ error: 'Administration non configurée.' }, { status: 503 })
  const { password } = await request.json().catch(() => ({ password: '' }))
  if (password !== configured) return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  return NextResponse.json({ ok: true })
}
