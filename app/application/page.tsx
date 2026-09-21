import {localizedMetadata} from '@/lib/language-server'
import {Text} from '@/components/language-provider'
import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { PushSubscriptionManager } from '@/components/push-subscription'
import Link from 'next/link'

export const generateMetadata=()=>localizedMetadata("Application mobile",undefined,'/application')

export default function ApplicationPage() {
  return <>
    <PageHero eyebrow="Application gratuite" title="Le Bistrot dans votre poche" text="Installez le site sur votre téléphone et recevez les menus, événements et actualités."/>
    <section className="section"><div className="container app-install-grid">
      <div className="install-guide">
        <h2><Text>{" Installer l’application "}</Text></h2>
        <h3><Text>{" Sur iPhone "}</Text></h3><p><Text>{" Ouvrez cette page dans Safari, touchez le bouton "}</Text><strong><Text>{" Partager "}</Text></strong><Text>{" , puis "}</Text><strong><Text>{" Sur l’écran d’accueil "}</Text></strong>.</p>
        <h3><Text>{" Sur Android "}</Text></h3><p><Text>{" Touchez "}</Text><strong><Text>{" Installer "}</Text></strong> <Text>{" lorsque la proposition apparaît, ou ouvrez le menu du navigateur puis choisissez "}</Text><strong><Text>{" Installer l’application "}</Text></strong>.</p>
        <p><Text>{" L’installation est gratuite. "}</Text></p><div className="actions"><Link className="button" href="/club"><Text>{" Rejoindre le Club LBDC "}</Text></Link></div>
      </div>
      <figure className="qr-card"><img src="/qr-code-application.png" alt="QR code vers l’application Le Bistrot Du Coin"/><figcaption><Text>{" Scannez ce QR code avec l’appareil photo de votre téléphone. "}</Text></figcaption></figure>
    </div></section>
    <section className="section app-notification-section"><div className="container narrow"><PushSubscriptionManager/></div></section>
  </>
}
