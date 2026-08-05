import { NextRequest, NextResponse } from 'next/server'
import { getClubMemberByCode, listMemberLoyaltyEvents } from '@/lib/club-store'
import { ensureWelcomeOffer } from '@/lib/welcome-offer-store'
import { ensureMemberPromotionCoupons } from '@/lib/promotion-coupon-store'
import { memberSessionCookie, readMemberSession } from '@/lib/member-session'
import { clubMemberView } from '@/lib/club-member-view'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = readMemberSession(request.cookies.get(memberSessionCookie.name)?.value)
    if (!session) return NextResponse.json({ authenticated: false }, { status: 401 })
    const member = await getClubMemberByCode(session.code)
    if (!member) return NextResponse.json({ authenticated: false }, { status: 401 })
    const [offer, coupons, events] = await Promise.all([ensureWelcomeOffer(member.id), ensureMemberPromotionCoupons(member.id), listMemberLoyaltyEvents(member.id)])
    return NextResponse.json({ authenticated: true, member: clubMemberView(member,offer,coupons,events) })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Session impossible.' }, { status: 503 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(memberSessionCookie.name, '', { ...memberSessionCookie.options, maxAge: 0 })
  return response
}
