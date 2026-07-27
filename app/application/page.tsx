import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { PushSubscriptionManager } from '@/components/push-subscription'

export const metadata: Metadata = { title: 'Application mobile' }

export default function ApplicationPage() {
  return <>
    <PageHero eyebrow="Application gratuite" title="Le Bistrot dans votre poche" text="Installez le site sur votre téléphone et recevez les menus, événements et actualités."/>
    <section className="section"><div className="container app-install-grid">
      <div className="install-guide">
        <h2>Installer l’application</h2>
        <h3>Sur iPhone</h3><p>Ouvrez cette page dans Safari, touchez le bouton <strong>Partager</strong>, puis <strong>Sur l’écran d’accueil</strong>.</p>
        <h3>Sur Android</h3><p>Touchez <strong>Installer</strong> lorsque la proposition apparaît, ou ouvrez le menu du navigateur puis choisissez <strong>Installer l’application</strong>.</p>
        <p>Aucun compte n’est nécessaire et l’installation est gratuite.</p>
      </div>
      <figure className="qr-card"><img src="/qr-code-application.png" alt="QR code vers l’application Le Bistrot Du Coin"/><figcaption>Scannez ce QR code avec l’appareil photo de votre téléphone.</figcaption></figure>
    </div></section>
    <section className="section app-notification-section"><div className="container narrow"><PushSubscriptionManager/></div></section>
  </>
}
