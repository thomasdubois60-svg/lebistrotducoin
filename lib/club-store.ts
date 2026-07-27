export type ClubMember = {
  id: string
  first_name: string
  email: string
  birthday: string | null
  email_marketing: boolean
  notification_interest: boolean
  loyalty_points: number
  reward_available: boolean
  personal_code: string
  created_at: string
}

const settings = () => ({
  url: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  key: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
})

const headers = () => {
  const { key } = settings()
  return {
    apikey: key || '',
    Authorization: `Bearer ${key || ''}`,
    'Content-Type': 'application/json',
  }
}

export function clubStorageConfigured() {
  const { url, key } = settings()
  return Boolean(url && key)
}

export async function joinClub(input: {
  firstName: string
  email: string
  birthday?: string
  emailMarketing: boolean
  notificationInterest: boolean
}) {
  const { url } = settings()
  if (!url || !clubStorageConfigured()) throw new Error('Le Club LBDC n’est pas encore configuré.')

  const email = input.email.trim().toLowerCase()
  const response = await fetch(`${url}/rest/v1/club_members?on_conflict=email`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      first_name: input.firstName.trim(),
      email,
      birthday: input.birthday || null,
      email_marketing: input.emailMarketing,
      notification_interest: input.notificationInterest,
      consent_updated_at: new Date().toISOString(),
    }),
    cache: 'no-store',
  })

  if (!response.ok) throw new Error(`Inscription impossible (${response.status}).`)
  const rows = await response.json() as ClubMember[]
  return rows[0]
}

export async function listClubMembers(): Promise<ClubMember[]> {
  const { url } = settings()
  if (!url || !clubStorageConfigured()) throw new Error('Le Club LBDC n’est pas encore configuré.')
  const response = await fetch(`${url}/rest/v1/club_members?select=id,first_name,email,birthday,email_marketing,notification_interest,loyalty_points,reward_available,personal_code,created_at&order=created_at.desc`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Lecture impossible (${response.status}).`)
  return response.json()
}


export async function getClubMember(emailInput: string, personalCodeInput: string): Promise<ClubMember | null> {
  const { url } = settings()
  if (!url || !clubStorageConfigured()) throw new Error('Le Club LBDC n’est pas encore configuré.')
  const email = emailInput.trim().toLowerCase()
  const personalCode = personalCodeInput.trim()
  const query = new URLSearchParams({
    select: 'id,first_name,email,birthday,email_marketing,notification_interest,loyalty_points,reward_available,personal_code,created_at',
    email: `eq.${email}`,
    personal_code: `eq.${personalCode}`,
    limit: '1',
  })
  const response = await fetch(`${url}/rest/v1/club_members?${query.toString()}`, {
    headers: headers(),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Connexion impossible (${response.status}).`)
  const rows = await response.json() as ClubMember[]
  return rows[0] || null
}
