export type StoredPushSubscription = {
  endpoint: string
  subscription: PushSubscriptionJSON
}

const settings = () => ({
  url: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  key: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

const headers = () => {
  const { key } = settings()
  return {
    apikey: key || '',
    Authorization: `Bearer ${key || ''}`,
    'Content-Type': 'application/json',
  }
}

export function pushStorageConfigured() {
  const { url, key } = settings()
  return Boolean(url && key)
}

export async function savePushSubscription(subscription: PushSubscriptionJSON, userAgent = '') {
  const { url } = settings()
  if (!url || !pushStorageConfigured() || !subscription.endpoint) throw new Error('Stockage des notifications non configuré.')
  const response = await fetch(`${url}/rest/v1/push_subscriptions?on_conflict=endpoint`, {
    method: 'POST',
    headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ endpoint: subscription.endpoint, subscription, user_agent: userAgent }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Enregistrement impossible (${response.status}).`)
}

export async function deletePushSubscription(endpoint: string) {
  const { url } = settings()
  if (!url || !pushStorageConfigured()) return
  await fetch(`${url}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`, {
    method: 'DELETE', headers: headers(), cache: 'no-store',
  })
}

export async function listPushSubscriptions(): Promise<StoredPushSubscription[]> {
  const { url } = settings()
  if (!url || !pushStorageConfigured()) throw new Error('Stockage des notifications non configuré.')
  const response = await fetch(`${url}/rest/v1/push_subscriptions?select=endpoint,subscription&order=created_at.desc`, {
    headers: headers(), cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Lecture impossible (${response.status}).`)
  return response.json()
}
