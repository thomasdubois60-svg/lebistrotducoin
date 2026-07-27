import { notFound } from 'next/navigation'
import { getClubMemberByCode } from '@/lib/club-store'
import { getFullFormulaPrice } from '@/lib/site-pricing'
import { LoyaltyValidator } from '@/components/loyalty-validator'

export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const member = await getClubMemberByCode(code)
  if (!member) notFound()
  const formula = await getFullFormulaPrice()
  return <section className="section"><div className="container narrow"><LoyaltyValidator code={code} initial={member} formula={{ name: formula.name, formatted: formula.formatted }} /></div></section>
}
