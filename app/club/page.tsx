import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PageHero } from '@/components/page-hero'
import { ClubSignup } from '@/components/club-signup'
import { PushSubscriptionManager } from '@/components/push-subscription'
import { memberSessionCookie, readMemberSession } from '@/lib/member-session'

export const metadata: Metadata = { title: 'Club LBDC', description: 'Rejoignez gratuitement le Club du Bistrot Du Coin.' }
export const dynamic = 'force-dynamic'

export default async function ClubPage(){
  const cookieStore = await cookies()
  const session = readMemberSession(cookieStore.get(memberSessionCookie.name)?.value)
  if (session) redirect('/club/espace')

  return <>
    <PageHero eyebrow="Avantages & actualités" title="Club LBDC" text="Le Bistrot dans votre poche, avec les menus, événements et futurs avantages fidélité."/>
    <section className="section club-page"><div className="container club-layout">
      <div><ClubSignup/><p className="club-login-link">Déjà membre ? <a className="button secondary" href="/club/espace">Accéder à mon espace</a></p></div>
      <aside className="club-benefits"><span className="club-badge light">Bientôt dans votre espace</span><h2>Vos avantages</h2><div className="club-benefit"><b>🍽️</b><div><strong>Menu du jour</strong><p>Recevez les nouveautés du Bistrot.</p></div></div><div className="club-benefit"><b>🎤</b><div><strong>Événements</strong><p>Concerts, karaokés et soirées.</p></div></div><div className="club-benefit"><b>⭐</b><div><strong>Fidélité numérique</strong><p>Votre future carte de fidélité dans l’application.</p></div></div><div className="club-benefit"><b>🎁</b><div><strong>Avantages membres</strong><p>Offres et attentions réservées au Club.</p></div></div></aside>
    </div></section>
    <section className="section club-push-section"><div className="container narrow"><PushSubscriptionManager/></div></section>
  </>
}
