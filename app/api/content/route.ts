import { NextRequest, NextResponse } from 'next/server'
import { defaultContent, normalizeContent, SiteContent } from '@/lib/default-content'

export const dynamic = 'force-dynamic'

const settings = () => ({
  token: process.env.GITHUB_TOKEN,
  repo: process.env.GITHUB_REPO || 'thomasdubois60-svg/lebistrotducoin',
  branch: process.env.GITHUB_BRANCH || 'main',
  password: process.env.ADMIN_PASSWORD
})

async function githubFile() {
  const { token, repo, branch } = settings()
  if (!token) return null
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/data/site-content.json?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    cache: 'no-store'
  })
  if (!response.ok) return null
  return response.json()
}

async function rawGithubContent() {
  const { repo, branch } = settings()
  const path = repo.split('/').map(encodeURIComponent).join('/')
  const response = await fetch(`https://raw.githubusercontent.com/${path}/${encodeURIComponent(branch)}/data/site-content.json`, {
    headers: { Accept: 'application/json', 'User-Agent': 'LeBistrotDuCoin/1.0 content-reader' },
    cache: 'no-store'
  })
  if (!response.ok) return null
  return response.text()
}

export async function GET() {
  const file = await githubFile()
  try {
    const text = file?.content ? Buffer.from(file.content, 'base64').toString('utf8') : await rawGithubContent()
    if (!text) return NextResponse.json(defaultContent)
    return NextResponse.json(normalizeContent(JSON.parse(text)))
  } catch { return NextResponse.json(defaultContent) }
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
