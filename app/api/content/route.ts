import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { normalizeContent, SiteContent } from '@/lib/default-content'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

const settings = () => ({
  token: process.env.GITHUB_TOKEN,
  repo: process.env.GITHUB_REPO || 'thomasdubois60-svg/lebistrotducoin',
  branch: process.env.GITHUB_BRANCH || 'main',
  password: process.env.ADMIN_PASSWORD
})

async function githubFile() {
  const { token, repo, branch } = settings()
  if (!token) return null
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/data/site-content.json?ref=${encodeURIComponent(branch)}&publication=${Date.now()}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Cache-Control': 'no-cache' },
    cache: 'no-store'
  })
  if (!response.ok) return null
  return response.json()
}

// Reject incomplete/error payloads before normalization can fill in old defaults.
function parsePublishedContent(text: string) {
  const value = JSON.parse(text)
  const isItem = (item: unknown) => Boolean(item && typeof item === 'object' && typeof (item as { name?: unknown }).name === 'string')
  const isItems = (items: unknown) => Array.isArray(items) && items.every(isItem)
  if (!value || typeof value !== 'object' || !Array.isArray(value.menu) ||
      !value.menu.every((section: { category?: unknown; items?: unknown } | null) => section && typeof section.category === 'string' && isItems(section.items)) ||
      !value.daily || !isItems(value.daily.starters) || !isItems(value.daily.mains) || !isItems(value.daily.desserts) || !isItem(value.daily.suggestion)) {
    throw new Error('Invalid published content')
  }
  return normalizeContent(value)
}

const blobSha = (text: string) => createHash('sha1').update(Buffer.from('blob ' + Buffer.byteLength(text, 'utf8') + '\0')).update(text, 'utf8').digest('hex')

export async function GET() {
  const { token, repo, branch } = settings()
  const path = repo.split('/').map(encodeURIComponent).join('/')
  const refresh = Date.now()
  const headers = {
    'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
    'CDN-Cache-Control': 'no-store',
    'Vercel-CDN-Cache-Control': 'no-store',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Content-Repo': encodeURI(repo),
    'X-Content-Branch': encodeURIComponent(branch)
  }
  // Resolve the branch once, then read both sources at that immutable commit.
  // A fallback must never read a different publication from the primary source.
  let commit = ''
  for (const credential of token ? [token, undefined] : [undefined]) {
    try {
      const response = await fetch('https://api.github.com/repos/' + path + '/git/ref/heads/' + encodeURIComponent(branch) + '?publication=' + refresh, {
        headers: { Accept: 'application/vnd.github+json', 'Cache-Control': 'no-cache', 'User-Agent': 'LeBistrotDuCoin/1.0', ...(credential ? { Authorization: 'Bearer ' + credential } : {}) },
        cache: 'no-store', signal: AbortSignal.timeout(5000)
      })
      if (!response.ok) continue
      const ref = await response.json()
      if (ref?.object?.type === 'commit' && /^[a-f0-9]{40}$/.test(ref.object.sha)) { commit = ref.object.sha; break }
    } catch { /* Retry anonymously if configured credentials failed. */ }
  }
  if (!commit) return NextResponse.json({ error: 'La dernière publication est temporairement indisponible.' }, { status: 503, headers: { ...headers, 'X-Content-Source': 'unavailable', 'Retry-After': '5' } })
  const apiUrl = 'https://api.github.com/repos/' + path + '/contents/data/site-content.json?ref=' + commit + '&publication=' + refresh
  // Read the public branch first, independently of the token used by Administration.
  const sources = [
    { name: 'github-raw', url: 'https://raw.githubusercontent.com/' + path + '/' + commit + '/data/site-content.json?publication=' + refresh, token: undefined },
    { name: 'github-api', url: apiUrl, token },
    ...(token ? [{ name: 'github-api-public', url: apiUrl + '&anonymous=1', token: undefined }] : [])
  ]
  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'LeBistrotDuCoin/1.0 content-reader',
          'X-GitHub-Api-Version': '2022-11-28',
          'Cache-Control': 'no-cache',
          ...(source.token ? { Authorization: 'Bearer ' + source.token } : {})
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000)
      })
      if (!response.ok) continue
      let text: string
      let expectedSha: string | undefined
      if (source.name === 'github-raw') {
        text = await response.text()
      } else {
        const file = await response.json()
        if (file?.encoding !== 'base64' || typeof file.content !== 'string' || typeof file.sha !== 'string') continue
        text = Buffer.from(file.content, 'base64').toString('utf8')
        expectedSha = file.sha
      }
      const sha = blobSha(text)
      if (expectedSha && expectedSha !== sha) continue
      const content = parsePublishedContent(text)
      return NextResponse.json(content, { headers: { ...headers, 'X-Content-Source': source.name, 'X-Content-Sha': sha, 'X-Content-Commit': commit } })
    } catch {
      // A failed, timed-out or malformed source must not prevent the next source.
    }
  }
  // A 503 preserves the last good client state; a 200/defaultContent would erase it.
  console.warn('Public content unavailable', { repo, branch, tokenConfigured: Boolean(token) })
  return NextResponse.json({ error: 'Le contenu est temporairement indisponible.' }, {
    status: 503,
    headers: { ...headers, 'X-Content-Source': 'unavailable', 'Retry-After': '5' }
  })
}

export async function POST(request: NextRequest) {
  const { token, repo, branch, password } = settings()
  if (!token || !password) return NextResponse.json({ error: 'Administration non configurée sur Vercel.' }, { status: 503 })
  if (request.headers.get('x-admin-password') !== password) return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  const content = normalizeContent(await request.json() as SiteContent)
  const current = await githubFile()
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/data/site-content.json`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: JSON.stringify({ message: 'Mise à jour du contenu du Bistrot', content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'), branch, ...(current?.sha ? { sha: current.sha } : {}) })
  })
  if (!response.ok) return NextResponse.json({ error: 'La sauvegarde GitHub a échoué.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
