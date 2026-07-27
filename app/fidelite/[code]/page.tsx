import { notFound } from 'next/navigation'
import { getClubMemberByCode } from '@/lib/club-store'
import { LoyaltyValidator } from '@/components/loyalty-validator'
export const dynamic='force-dynamic'
export default async function Page({params}:{params:Promise<{code:string}>}){const {code}=await params;const m=await getClubMemberByCode(code);if(!m)notFound();return <section className="section"><div className="container narrow"><LoyaltyValidator code={code} initial={m}/></div></section>}
