'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

export function PwaInstallPrompt() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
    if (standalone || localStorage.getItem('lbdc-install-dismissed') === 'yes') return
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent))
    const handler = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); setVisible(true) }
    window.addEventListener('beforeinstallprompt', handler)
    const timer = window.setTimeout(() => setVisible(true), 1800)
    return () => { window.removeEventListener('beforeinstallprompt', handler); window.clearTimeout(timer) }
  }, [])

  if (!visible) return null
  const close = () => { localStorage.setItem('lbdc-install-dismissed', 'yes'); setVisible(false) }
  const install = async () => { if (!prompt) return; await prompt.prompt(); const choice = await prompt.userChoice; if (choice.outcome === 'accepted') setVisible(false) }

  return <aside className="install-prompt" aria-label="Installer l’application Le Bistrot Du Coin">
    <button className="install-close" onClick={close} aria-label="Fermer">×</button>
    <img src="/icons/icon-192.png" alt="LBDC"/>
    <div><strong>Le Bistrot dans votre poche</strong><p>{ios ? 'Ajoutez le site à votre écran d’accueil depuis le bouton Partager.' : 'Installez gratuitement le site comme une application.'}</p>
      <div className="install-actions">{prompt && <button className="button compact" onClick={install}>Installer</button>}<Link className="text-link" href="/application">Voir comment faire</Link></div>
    </div>
  </aside>
}
