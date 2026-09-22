import {localizedMetadata} from '@/lib/language-server'
import type { Metadata } from 'next'
import {Text} from '@/components/language-provider'
import { ClubMemberSpace } from '@/components/club-member-space'

export const generateMetadata=()=>localizedMetadata("Mon espace Club LBDC","Accédez à votre espace membre du Club LBDC.",'/club/espace')

export default function ClubMemberPage() {
  return <>
    <h1 className="sr-only"><Text>Mon espace membre</Text></h1>
    <section className="section club-space-section"><div className="container club-space-container"><ClubMemberSpace /></div></section>
  </>
}
