import { NextRequest, NextResponse } from 'next/server'
import { joinClub } from '@/lib/club-store'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      firstName?: string
      email?: string
      birthday?: string
      emailMarketing?: boolean
      notificationInterest?: boolean
      privacyAccepted?: boolean
    }

    const firstName = body.firstName?.trim() || ''
    const email = body.email?.trim().toLowerCase() || ''
    if (firstName.length < 2) return NextResponse.json({ error: 'Prénom obligatoire.' }, { status: 400 })
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 })
    if (!body.privacyAccepted) return NextResponse.json({ error: 'Vous devez accepter l’utilisation de vos données pour rejoindre le Club.' }, { status: 400 })

    const member = await joinClub({
      firstName,
      email,
      birthday: body.birthday,
      emailMarketing: Boolean(body.emailMarketing),
      notificationInterest: Boolean(body.notificationInterest),
    })

    return NextResponse.json({
      ok: true,
      member: { firstName: member.first_name, personalCode: member.personal_code },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Inscription impossible.' }, { status: 503 })
  }
}
