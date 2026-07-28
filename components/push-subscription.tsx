'use client'

import { useEffect, useState } from 'react'

type Status = 'loading' | 'unsupported' | 'needs-install' | 'ready' | 'subscribed' | 'denied' | 'unconfigured' | 'error'

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

export function PushSubscriptionManager({ memberCode }: { memberCode?: string } = {}) {
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('Vérification de votre appareil…')
  const [busy, setBusy] = useState(false)

  const refresh = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
      setStatus('unsupported'); setMessage('Les notifications ne sont pas prises en charge sur ce navigateur.'); return
    }
    if (isIOS() && !isStandalone()) {
      setStatus('needs-install'); setMessage('Sur iPhone, ajoutez d’abord le site à l’écran d’accueil pour activer les notifications.'); return
    }
    const config = await fetch('/api/push/config', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ configured: false }))
    if (!config.configured) {
      setStatus('unconfigured'); setMessage('Les notifications seront disponibles après la configuration finale du site.'); return
    }
    if (Notification.permission === 'denied') {
      setStatus('denied'); setMessage('Les notifications sont bloquées dans les réglages de votre navigateur.'); return
    }
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      setStatus('subscribed'); setMessage('Vous recevrez les nouveaux menus, événements et actualités du Bistrot.'); return
    }
    setStatus('ready'); setMessage('Activez les notifications pour ne rien manquer.');
  }

  useEffect(() => { refresh().catch(() => { setStatus('error'); setMessage('Vérification impossible.') }) }, [])

  const subscribe = async () => {
    setBusy(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setStatus('denied'); setMessage('Autorisation refusée. Vous pourrez la modifier dans les réglages du navigateur.'); return }
      const config = await fetch('/api/push/config', { cache: 'no-store' }).then(r => r.json())
      if (!config.configured || !config.publicKey) throw new Error('Notifications non configurées.')
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(config.publicKey) })
      const response = await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: subscription.toJSON(), memberCode }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Abonnement impossible.')
      setStatus('subscribed'); setMessage('Notifications activées. Merci !')
    } catch (error) {
      setStatus('error'); setMessage(error instanceof Error ? error.message : 'Abonnement impossible.')
    } finally { setBusy(false) }
  }

  const unsubscribe = async () => {
    setBusy(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await fetch('/api/push/subscribe', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: subscription.endpoint }) })
        await subscription.unsubscribe()
      }
      setStatus('ready'); setMessage('Notifications désactivées.')
    } catch { setStatus('error'); setMessage('Désabonnement impossible.') }
    finally { setBusy(false) }
  }

  return <div className="push-card">
    <h2>Notifications du Bistrot</h2>
    <p>{message}</p>
    {status === 'needs-install' && <div className="ios-install-help"><strong>Sur iPhone :</strong> touchez Partager, puis « Sur l’écran d’accueil ». Ouvrez ensuite l’icône LBDC et revenez sur cette page.</div>}
    {status === 'ready' && <button className="button" onClick={subscribe} disabled={busy}>{busy ? 'Activation…' : 'Activer les notifications'}</button>}
    {status === 'subscribed' && <button className="button secondary" onClick={unsubscribe} disabled={busy}>{busy ? 'Veuillez patienter…' : 'Désactiver les notifications'}</button>}
  </div>
}
