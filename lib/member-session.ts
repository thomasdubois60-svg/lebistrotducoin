import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'lbdc_member_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180

type SessionPayload = { code: string; exp: number }

function secret() {
  const value = process.env.CLUB_SESSION_SECRET || process.env.SUPABASE_SECRET_KEY || process.env.ADMIN_PASSWORD
  if (!value) throw new Error('Secret de session non configuré.')
  return value
}

function encode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function decode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function signature(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createMemberSession(code: string) {
  const payload = encode(JSON.stringify({ code, exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS } satisfies SessionPayload))
  return `${payload}.${signature(payload)}`
}

export function readMemberSession(token?: string | null) {
  if (!token) return null
  const [payload, suppliedSignature] = token.split('.')
  if (!payload || !suppliedSignature) return null
  const expected = Buffer.from(signature(payload))
  const supplied = Buffer.from(suppliedSignature)
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null
  try {
    const parsed = JSON.parse(decode(payload)) as SessionPayload
    if (!parsed.code || parsed.exp <= Math.floor(Date.now() / 1000)) return null
    return parsed
  } catch {
    return null
  }
}

export const memberSessionCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  },
}
