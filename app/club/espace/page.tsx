import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ClubMemberSpace } from '@/components/club-member-space'

export const metadata: Metadata = { title: 'Mon espace Club LBDC', description: 'Accédez à votre espace membre du Club LBDC.' }

export default function ClubMemberPage() {
  return <>
    <PageHero eyebrow="Club LBDC" title="Mon espace membre" text="Retrouvez votre fidélité, vos avantages et vos préférences." />
    <section className="section"><div className="container narrow"><ClubMemberSpace /></div></section>
  </>
}
