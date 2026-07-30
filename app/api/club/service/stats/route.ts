import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { listLoyaltyEvents } from '@/lib/club-store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Connexion administrateur requise.' }, { status: 401 })
  }

  try {
    const today = new Date().toISOString().slice(0, 10)
    const events = await listLoyaltyEvents()
    const todayEvents = events.filter((event) => event.event_day === today)
    const passages = todayEvents.filter((event) => event.event_type === 'passage')
    const rewards = todayEvents.filter((event) => event.event_type === 'reward')

    return NextResponse.json({
      date: today,
      customers: new Set(passages.map((event) => event.member_id)).size,
      formulas: passages.length,
      rewards: rewards.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Statistiques indisponibles.' },
      { status: 400 },
    )
  }
}
