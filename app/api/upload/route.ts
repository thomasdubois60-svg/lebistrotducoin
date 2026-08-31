import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'thomasdubois60-svg/lebistrotducoin'
  const branch = process.env.GITHUB_BRANCH || 'main'
  if (!password || !token) return NextResponse.json({ error: 'Administration non configurée.' }, { status: 503 })
  if (request.headers.get('x-admin-password') !== password) return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  const form = await request.formData()
  const submittedFile = form.get('file')
  const submittedUrl = form.get('url')
  let file: File
  if (submittedFile instanceof File) file = submittedFile
  else if (typeof submittedUrl === 'string' && /^https:\/\//i.test(submittedUrl)) {
    const remoteUrl = new URL(submittedUrl)
    if (remoteUrl.hostname !== 'upload.wikimedia.org') return NextResponse.json({ error: 'Source d’image non autorisée.' }, { status: 400 })
    const downloaded = await fetch(remoteUrl, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
    const type = downloaded.headers.get('content-type')?.split(';')[0] || ''
    const announcedSize = Number(downloaded.headers.get('content-length') || 0)
    if (!downloaded.ok || announcedSize > 8_000_000 || !['image/jpeg','image/png','image/webp'].includes(type)) return NextResponse.json({ error: 'Cette image ne peut pas être importée.' }, { status: 400 })
    const bytes = await downloaded.arrayBuffer()
    if (bytes.byteLength > 8_000_000) return NextResponse.json({ error: 'Photo trop lourde (8 Mo maximum).' }, { status: 400 })
    file = new File([bytes], `image.${type.split('/')[1]}`, { type })
  } else return NextResponse.json({ error: 'Photo manquante.' }, { status: 400 })
  if (file.size > 8_000_000) return NextResponse.json({ error: 'Photo trop lourde (8 Mo maximum).' }, { status: 400 })
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
  const path = `public/photos/uploads/${name}`
  const bytes = Buffer.from(await file.arrayBuffer())
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
    body: JSON.stringify({ message: `Ajout photo ${name}`, content: bytes.toString('base64'), branch })
  })
  if (!response.ok) return NextResponse.json({ error: 'Envoi de la photo impossible.' }, { status: 500 })
  const rawUrl = `https://raw.githubusercontent.com/${repo}/${encodeURIComponent(branch)}/${path}`
  return NextResponse.json({ src: rawUrl, legacySrc: `/photos/uploads/${name}` })
}
