import {localizedMetadata} from '@/lib/language-server'
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { ClubMemberSpace } from '@/components/club-member-space'

export const generateMetadata=()=>localizedMetadata("Mon espace Club LBDC","Accédez à votre espace membre du Club LBDC.",'/club/espace')

export default function ClubMemberPage() {
  return <>
    <PageHero eyebrow="Club LBDC" title="Mon espace membre" text="Retrouvez votre fidélité, vos avantages et vos préférences." />
    <section className="section"><div className="container narrow"><ClubMemberSpace /></div></section>
  </>
}
