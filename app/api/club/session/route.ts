import { NextRequest, NextResponse } from 'next/server'
import { getClubMemberByCode } from '@/lib/club-store'
import { ensureWelcomeOffer } from '@/lib/welcome-offer-store'
import { ensureMemberPromotionCoupons } from '@/lib/promotion-coupon-store'
import { memberSessionCookie, readMemberSession } from '@/lib/member-session'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = readMemberSession(request.cookies.get(memberSessionCookie.name)?.value)
    if (!session) return NextResponse.json({ authenticated: false }, { status: 401 })
    const member = await getClubMemberByCode(session.code)
    if (!member) return NextResponse.json({ authenticated: false }, { status: 401 })
    const [offer, coupons] = await Promise.all([ensureWelcomeOffer(member.id), ensureMemberPromotionCoupons(member.id)])
    return NextResponse.json({ authenticated: true, member: {
      firstName: member.first_name, lastName: member.last_name, email: member.email, birthday: member.birthday,
      personalCode: member.personal_code, loyaltyPoints: member.loyalty_points, rewardAvailable: member.reward_available,
      emailMarketing: member.email_marketing, notificationInterest: member.notification_interest, createdAt: member.created_at,
      welcomeOffer: { token: offer.token, createdAt: offer.created_at, expiresAt: offer.expires_at, usedAt: offer.used_at, discountRate: Number(offer.discount_rate) },
      promotionCoupons: coupons.map(c => ({ token: c.token, expiresAt: c.expires_at, usedAt: c.used_at, discountRate: Number(c.discount_rate), title: c.club_promotions?.title || '', description: c.club_promotions?.description || '', productLabel: c.product_label || c.club_promotions?.product_label || '' })),
    } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Session impossible.' }, { status: 503 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(memberSessionCookie.name, '', { ...memberSessionCookie.options, maxAge: 0 })
  return response
}
