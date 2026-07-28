import { randomBytes } from 'node:crypto'
import type { ClubMember } from '@/lib/club-store'

export type WelcomeOffer = {
  id: string
  member_id: string
  token: string
  created_at: string
  expires_at: string
  used_at: string | null
  original_amount_ttc: number | null
  discount_rate: number
  discount_amount_ttc: number | null
  final_amount_ttc: number | null
  receipt_number: string | null
  reminder_sent_at: string | null
  club_members?: Pick<ClubMember, 'first_name' | 'last_name' | 'email' | 'personal_code'>
}

const settings = () => ({
  url: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  key: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
})
const headers = () => {
  const { key } = settings()
  return { apikey: key || '', Authorization: `Bearer ${key || ''}`, 'Content-Type': 'application/json' }
}
function requireSettings() {
  const { url, key } = settings()
  if (!url || !key) throw new Error('Supabase n’est pas configuré.')
  return { url, key }
}
async function parseError(response: Response, fallback: string) {
  let detail = ''
  try { const body = await response.json() as { message?: string; details?: string }; detail = body.message || body.details || '' } catch {}
  return new Error(detail ? `${fallback} ${detail}` : fallback)
}

export async function ensureWelcomeOffer(memberId: string) {
  const { url } = requireSettings()
  const existing = await getWelcomeOfferByMemberId(memberId)
  if (existing) return existing
  const token = randomBytes(24).toString('hex')
  const response = await fetch(`${url}/rest/v1/club_welcome_offers`, {
    method: 'POST', headers: { ...headers(), Prefer: 'return=representation' },
    body: JSON.stringify({ member_id: memberId, token }), cache: 'no-store',
  })
  if (!response.ok) throw await parseError(response, `Création de l’offre impossible (${response.status}).`)
  const rows = await response.json() as WelcomeOffer[]
  return rows[0]
}

export async function getWelcomeOfferByMemberId(memberId: string): Promise<WelcomeOffer | null> {
  const { url } = requireSettings()
  const q = new URLSearchParams({ select: '*', member_id: `eq.${memberId}`, limit: '1' })
  const response = await fetch(`${url}/rest/v1/club_welcome_offers?${q}`, { headers: headers(), cache: 'no-store' })
  if (!response.ok) throw await parseError(response, `Lecture de l’offre impossible (${response.status}).`)
  const rows = await response.json() as WelcomeOffer[]
  return rows[0] || null
}

export async function getWelcomeOfferByToken(token: string): Promise<WelcomeOffer | null> {
  const { url } = requireSettings()
  const select = '*,club_members(first_name,last_name,email,personal_code)'
  const q = new URLSearchParams({ select, token: `eq.${token}`, limit: '1' })
  const response = await fetch(`${url}/rest/v1/club_welcome_offers?${q}`, { headers: headers(), cache: 'no-store' })
  if (!response.ok) throw await parseError(response, `Lecture de l’offre impossible (${response.status}).`)
  const rows = await response.json() as WelcomeOffer[]
  return rows[0] || null
}

export async function redeemWelcomeOffer(token: string, originalAmountTtc: number) {
  const offer = await getWelcomeOfferByToken(token)
  if (!offer) throw new Error('Offre introuvable.')
  if (offer.used_at) throw new Error('Cette offre a déjà été utilisée.')
  if (new Date(offer.expires_at).getTime() < Date.now()) throw new Error('Cette offre est expirée.')
  if (!Number.isFinite(originalAmountTtc) || originalAmountTtc <= 0) throw new Error('Montant de l’addition invalide.')
  const original = Math.round(originalAmountTtc * 100) / 100
  const discount = Math.round(original * Number(offer.discount_rate) ) / 100
  const finalAmount = Math.round((original - discount) * 100) / 100
  const receipt = `BIENV-${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}-${offer.token.slice(0, 6).toUpperCase()}`
  const { url } = requireSettings()
  const response = await fetch(`${url}/rest/v1/club_welcome_offers?id=eq.${offer.id}&used_at=is.null`, {
    method: 'PATCH', headers: { ...headers(), Prefer: 'return=representation' },
    body: JSON.stringify({ used_at: new Date().toISOString(), original_amount_ttc: original, discount_amount_ttc: discount, final_amount_ttc: finalAmount, receipt_number: receipt }),
    cache: 'no-store',
  })
  if (!response.ok) throw await parseError(response, `Validation impossible (${response.status}).`)
  const rows = await response.json() as WelcomeOffer[]
  if (!rows[0]) throw new Error('Cette offre vient déjà d’être utilisée.')
  return rows[0]
}

export async function listWelcomeOffers(): Promise<WelcomeOffer[]> {
  const { url } = requireSettings()
  const select = '*,club_members(first_name,last_name,email,personal_code)'
  const response = await fetch(`${url}/rest/v1/club_welcome_offers?select=${encodeURIComponent(select)}&order=created_at.desc&limit=3000`, { headers: headers(), cache: 'no-store' })
  if (!response.ok) throw await parseError(response, `Lecture des offres impossible (${response.status}).`)
  return response.json()
}

export async function listOffersNeedingReminder(): Promise<WelcomeOffer[]> {
  const { url } = requireSettings()
  const now = new Date()
  const limit = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString()
  const query = `select=${encodeURIComponent('*,club_members(first_name,last_name,email,personal_code)')}&used_at=is.null&reminder_sent_at=is.null&expires_at=gt.${encodeURIComponent(now.toISOString())}&expires_at=lte.${encodeURIComponent(limit)}`
  const response = await fetch(`${url}/rest/v1/club_welcome_offers?${query}`, { headers: headers(), cache: 'no-store' })
  if (!response.ok) throw await parseError(response, `Lecture des rappels impossible (${response.status}).`)
  return response.json()
}

export async function markReminderSent(id: string) {
  const { url } = requireSettings()
  await fetch(`${url}/rest/v1/club_welcome_offers?id=eq.${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ reminder_sent_at: new Date().toISOString() }), cache: 'no-store' })
}
