import { NextRequest, NextResponse } from 'next/server'
import { getClubMember } from '@/lib/club-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; personalCode?: string }
    const email = body.email?.trim().toLowerCase() || ''
    const personalCode = body.personalCode?.trim() || ''
    if (!/^\S+@\S+\.\S+$/.test(email) || !personalCode) {
      return NextResponse.json({ error: 'Adresse e-mail ou code membre invalide.' }, { status: 400 })
    }
    const member = await getClubMember(email, personalCode)
    if (!member) return NextResponse.json({ error: 'Aucun membre ne correspond à ces informations.' }, { status: 401 })
    return NextResponse.json({
      ok: true,
      member: {
        firstName: member.first_name,
        email: member.email,
        birthday: member.birthday,
        personalCode: member.personal_code,
        loyaltyPoints: member.loyalty_points,
        rewardAvailable: member.reward_available,
        emailMarketing: member.email_marketing,
        notificationInterest: member.notification_interest,
        createdAt: member.created_at,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Connexion impossible.' }, { status: 503 })
  }
}
