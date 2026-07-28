import { notFound } from 'next/navigation'
import { getWelcomeOfferByToken } from '@/lib/welcome-offer-store'
import { WelcomeOfferValidator } from '@/components/welcome-offer-validator'
export const dynamic='force-dynamic'
export default async function Page({params}:{params:Promise<{token:string}>}){const {token}=await params;const offer=await getWelcomeOfferByToken(token);if(!offer)notFound();return <section className="section"><div className="container narrow"><WelcomeOfferValidator initial={offer}/></div></section>}
