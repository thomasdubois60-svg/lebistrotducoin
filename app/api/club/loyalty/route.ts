import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { addLoyaltyPoint, redeemReward } from '@/lib/club-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Connexion administrateur requise.' }, { status: 401 })
  try {
    const body = (await request.json()) as { code?: string; action?: string }
    if (!body.code) return NextResponse.json({ error: 'Code membre manquant.' }, { status: 400 })
    if (body.action === 'redeem') {
      const result = await redeemReward(body.code)
      return NextResponse.json({ ok: true, ...result })
    }
    const member = await addLoyaltyPoint(body.code)
    return NextResponse.json({ ok: true, member })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Opération impossible.' }, { status: 400 })
  }
}
