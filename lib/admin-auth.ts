import { createHash, timingSafeEqual } from 'node:crypto'
import type { NextRequest } from 'next/server'

export const ADMIN_COOKIE = 'lbdc-admin-session'

export function adminSessionToken() {
  const password = process.env.ADMIN_PASSWORD || ''
  return createHash('sha256').update(`lbdc-admin:${password}`).digest('hex')
}

export function isAdminRequest(request: NextRequest) {
  const configured = process.env.ADMIN_PASSWORD
  if (!configured) return false
  const header = request.headers.get('x-admin-password') || ''
  if (header && safeEqual(header, configured)) return true
  const cookie = request.cookies.get(ADMIN_COOKIE)?.value || ''
  const expected = adminSessionToken()
  return Boolean(cookie && safeEqual(cookie, expected))
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a)
  const bb = Buffer.from(b)
  return aa.length === bb.length && timingSafeEqual(aa, bb)
}
