import { NextRequest, NextResponse } from 'next/server'
import { listClubMembers } from '@/lib/club-store'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password || request.headers.get('x-admin-password') !== password) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 })
  }
  try {
    const members = await listClubMembers()
    return NextResponse.json({
      members,
      stats: {
        total: members.length,
        emailSubscribers: members.filter(member => member.email_marketing).length,
        notificationInterested: members.filter(member => member.notification_interest).length,
        rewards: members.filter(member => member.reward_available).length,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Lecture impossible.' }, { status: 503 })
  }
}
