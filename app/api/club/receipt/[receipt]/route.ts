import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { getLoyaltyEventByReceipt } from '@/lib/club-store'

export async function GET(request: NextRequest, { params }: { params: Promise<{ receipt: string }> }) {
  if (!isAdminRequest(request)) return new NextResponse('Accès refusé.', { status: 401 })
  const { receipt } = await params
  const event = await getLoyaltyEventByReceipt(receipt)
  if (!event) return new NextResponse('Justificatif introuvable.', { status: 404 })
  const member = event.club_members
  const amount = Number(event.reward_value_ttc || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
  const advantage = event.note || 'Formule fidélité offerte'
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${receipt}</title><style>body{font-family:Arial;margin:40px;color:#181414}main{max-width:760px;margin:auto;border:2px solid #6f0d22;padding:34px}h1{font-family:Georgia;color:#6f0d22}.row{display:flex;justify-content:space-between;gap:30px;border-top:1px solid #ddd;padding:12px 0}.row strong{text-align:right}.amount{font-size:1.5rem;color:#6f0d22}.actions{margin-top:30px}@media print{.actions{display:none}body{margin:0}}</style></head><body><main><h1>Justificatif fidélité LBDC</h1><p><strong>Le Bistrot du Coin</strong><br>15 Place de la Halle<br>41220 Saint-Laurent-Nouan</p><div class="row"><span>N° justificatif</span><strong>${event.receipt_number}</strong></div><div class="row"><span>Date et heure</span><strong>${new Date(event.created_at).toLocaleString('fr-FR')}</strong></div><div class="row"><span>Client</span><strong>${member?.first_name || ''} ${member?.last_name || ''}</strong></div><div class="row"><span>E-mail</span><strong>${member?.email || ''}</strong></div><div class="row"><span>Avantage</span><strong>${advantage}</strong></div><div class="row"><span>Valeur TTC comptabilisée</span><strong class="amount">${amount}</strong></div><p>Le montant indiqué correspond au prix de la formule complète affiché sur le site au moment où l’avantage a été utilisé.</p><p>Pour l’achat de 10 formules, la 11ᵉ est offerte. Une seule validation fidélité par jour et par personne. Offre personnelle et non cessible.</p><div class="actions"><button onclick="window.print()">Imprimer / Enregistrer en PDF</button></div></main></body></html>`
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
