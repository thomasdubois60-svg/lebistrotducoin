import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { listLoyaltyEvents } from '@/lib/club-store'
import { getFullFormulaPrice } from '@/lib/site-pricing'

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
const money = (value: number) => value.toFixed(2).replace('.', ',')

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 })

  const [allEvents, formula] = await Promise.all([listLoyaltyEvents(), getFullFormulaPrice()])
  const rewards = allEvents.filter((event) => event.event_type === 'reward')
  const total = rewards.reduce((sum, event) => sum + Number(event.reward_value_ttc || 0), 0)
  const header = ['N° justificatif', 'Date et heure', 'Prénom', 'Nom', 'E-mail', 'Avantage', 'Valeur TTC (€)']
  const rows = rewards.map((event) => [
    event.receipt_number,
    new Date(event.created_at).toLocaleString('fr-FR'),
    event.club_members?.first_name,
    event.club_members?.last_name,
    event.club_members?.email,
    event.note || 'Formule fidélité offerte',
    money(Number(event.reward_value_ttc || 0)),
  ])

  const report = [
    ['RAPPORT FIDÉLITÉ LBDC'],
    ['Date d’export', new Date().toLocaleString('fr-FR')],
    ['Formule de référence actuelle', formula.name],
    ['Prix actuel de la formule complète TTC', money(formula.valueTtc)],
    ['Nombre total de formules offertes', rewards.length],
    ['Valeur totale TTC des avantages accordés', money(total)],
    [],
    header,
    ...rows,
  ]
  const csv = '\uFEFF' + report.map((row) => row.map(csvCell).join(';')).join('\r\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fidelite-lbdc-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
