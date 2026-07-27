import { defaultContent, normalizeContent, type SiteContent } from '@/lib/default-content'

function githubSettings() {
  return {
    token: process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO || 'thomasdubois60-svg/lebistrotducoin',
    branch: process.env.GITHUB_BRANCH || 'main',
  }
}

export async function getCurrentSiteContent(): Promise<SiteContent> {
  const { token, repo, branch } = githubSettings()
  if (!token) return defaultContent

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/data/site-content.json?ref=${encodeURIComponent(branch)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      cache: 'no-store',
    },
  )

  if (!response.ok) return defaultContent
  const file = (await response.json()) as { content?: string }
  if (!file.content) return defaultContent

  try {
    const text = Buffer.from(file.content, 'base64').toString('utf8')
    return normalizeContent(JSON.parse(text) as Partial<SiteContent>)
  } catch {
    return defaultContent
  }
}

export function parseEuroPrice(value: string | undefined): number | null {
  if (!value) return null
  const match = value.replace(/\s/g, '').match(/(\d+(?:[.,]\d{1,2})?)/)
  if (!match) return null
  const amount = Number(match[1].replace(',', '.'))
  return Number.isFinite(amount) && amount >= 0 ? amount : null
}

function normalizeLabel(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export async function getFullFormulaPrice() {
  const content = await getCurrentSiteContent()
  const formulas = content.daily.formulas || []
  const exact = formulas.find((formula) => {
    const label = normalizeLabel(formula.name)
    return label.includes('entree') && label.includes('plat') && label.includes('dessert') && !label.includes(' ou ')
  })
  const fallback = formulas.find((formula) => normalizeLabel(formula.name).includes('complete')) || formulas.at(-1)
  const formula = exact || fallback
  const value = parseEuroPrice(formula?.price)

  if (!formula || value === null) {
    throw new Error('Le prix de la formule complète doit être renseigné dans « Aujourd’hui → Nos formules ».')
  }

  return {
    name: formula.name,
    rawPrice: formula.price,
    valueTtc: value,
    formatted: value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
  }
}
