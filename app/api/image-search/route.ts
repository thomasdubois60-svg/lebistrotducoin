import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type CommonsPage = { title?: string; imageinfo?: Array<{ thumburl?: string; descriptionurl?: string }> }

async function commonsPages(query: string) {
  const params = new URLSearchParams({ action:'query', format:'json', generator:'search', gsrsearch:`filetype:bitmap ${query}`, gsrnamespace:'6', gsrlimit:'12', prop:'imageinfo', iiprop:'url', iiurlwidth:'360', origin:'*' })
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent':'LeBistrotDuCoin/1.0 image-search' }, cache:'no-store' })
  if (!response.ok) throw new Error('commons-unavailable')
  const data = await response.json() as { query?: { pages?: Record<string, CommonsPage> } }
  return Object.values(data.query?.pages || {})
}

export async function GET(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password || request.headers.get('x-admin-password') !== password) return NextResponse.json({ error: 'Accès refusé.' }, { status: 401 })
  const query = request.nextUrl.searchParams.get('q')?.trim() || ''
  if (query.length < 2 || query.length > 100) return NextResponse.json({ error: 'Recherche invalide.' }, { status: 400 })
  let pages: CommonsPage[]
  try {
    pages = await commonsPages(query)
    const withoutGenericTerms = query.replace(/\b(logo|photo|image)\b/gi, '').trim()
    if (!pages.length && withoutGenericTerms.length >= 2 && withoutGenericTerms !== query) pages = await commonsPages(withoutGenericTerms)
  } catch { return NextResponse.json({ error: 'Le service de recherche est momentanément indisponible.' }, { status: 502 }) }
  const results = pages.flatMap(page => {
    const info = page.imageinfo?.[0]
    if (!info?.thumburl || !info.descriptionurl) return []
    return [{ title:(page.title || 'Image').replace(/^File:/i,''), thumbnail:info.thumburl, sourceUrl:info.descriptionurl, domain:new URL(info.descriptionurl).hostname }]
  })
  return NextResponse.json({ results })
}
