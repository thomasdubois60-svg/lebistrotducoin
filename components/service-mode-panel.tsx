'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type ServiceData = any
type DailyStats = { customers: number; formulas: number; rewards: number }

export function ServiceModePanel({ password }: { password: string }) {
  const [value, setValue] = useState('')
  const [data, setData] = useState<ServiceData | null>(null)
  const [stats, setStats] = useState<DailyStats>({ customers: 0, formulas: 0, rewards: 0 })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [scanning, setScanning] = useState(false)
  const scanner = useRef<any>(null)
  const starting = useRef(false)
  const mounted = useRef(true)

  const stopScan = useCallback(async () => {
    const current = scanner.current
    scanner.current = null
    if (current) {
      await current.stop().catch(() => {})
      await current.clear?.().catch?.(() => {})
    }
    if (mounted.current) setScanning(false)
  }, [])

  const refreshStats = useCallback(async () => {
    if (!password) return
    try {
      const response = await fetch('/api/club/service/stats', {
        headers: { 'x-admin-password': password },
        cache: 'no-store',
      })
      const result = await response.json()
      if (response.ok && mounted.current) {
        setStats({ customers: result.customers || 0, formulas: result.formulas || 0, rewards: result.rewards || 0 })
      }
    } catch {}
  }, [password])

  const lookup = useCallback(async (rawValue: string) => {
    const cleanValue = rawValue.trim()
    if (!cleanValue || busy) return
    setBusy(true)
    setMessage('Recherche du client…')
    try {
      const response = await fetch('/api/club/service/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ value: cleanValue }),
      })
      const result = await response.json()
      if (response.ok) {
        setData(result)
        setMessage('Client identifié.')
      } else {
        setData(null)
        setMessage(result.error || 'Membre introuvable.')
      }
    } catch {
      setData(null)
      setMessage('Connexion impossible. Réessaie dans quelques secondes.')
    } finally {
      setBusy(false)
    }
  }, [busy, password])

  const startScan = useCallback(async () => {
    if (!password || starting.current || scanning || data) return
    starting.current = true
    setMessage('Ouverture de la caméra…')
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      await stopScan()
      const reader = new Html5Qrcode('service-qr-reader')
      scanner.current = reader
      await reader.start(
        { facingMode: 'environment' },
        { fps: 12, qrbox: { width: 260, height: 260 }, aspectRatio: 1 },
        async (text: string) => {
          if (starting.current) return
          starting.current = true
          await stopScan()
          setValue(text)
          starting.current = false
          await lookup(text)
        },
        () => {},
      )
      if (mounted.current) {
        setScanning(true)
        setMessage('Scanner actif — présente le QR code du client.')
      }
    } catch {
      setMessage('Caméra indisponible. Autorise son accès ou utilise la saisie manuelle.')
    } finally {
      starting.current = false
    }
  }, [data, lookup, password, scanning, stopScan])

  useEffect(() => {
    mounted.current = true
    refreshStats()
    const timer = window.setTimeout(() => startScan(), 500)
    return () => {
      mounted.current = false
      window.clearTimeout(timer)
      stopScan()
    }
  }, [password])

  const nextClient = useCallback(() => {
    setData(null)
    setValue('')
    setMessage('Scanner prêt pour le client suivant.')
    window.setTimeout(() => startScan(), 500)
  }, [startScan])

  async function loyalty(action: 'add' | 'redeem') {
    if (!data || busy) return
    setBusy(true)
    try {
      const response = await fetch('/api/club/loyalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ code: data.member.personal_code, action }),
      })
      const result = await response.json()
      if (!response.ok) {
        setMessage(result.error || 'Opération impossible.')
        return
      }
      setMessage(action === 'add' ? '✓ Formule ajoutée.' : '✓ Formule offerte enregistrée.')
      await refreshStats()
      setData(null)
      setValue('')
      window.setTimeout(() => startScan(), 800)
    } catch {
      setMessage('Connexion impossible. L’opération n’a pas été enregistrée.')
    } finally {
      setBusy(false)
    }
  }

  const activeCoupons = (data?.coupons || []).filter((coupon: any) => !coupon.used_at && new Date(coupon.expires_at).getTime() > Date.now())
  const visits = Number(data?.totalVisits || 0)
  const badges: string[] = []
  if (data) {
    if (visits < 3) badges.push('🟢 Nouveau client')
    if (visits >= 10) badges.push('⭐ Client fidèle')
    if (visits >= 30) badges.push('🥇 Client Premium')
    if (visits >= 50) badges.push('👑 Ambassadeur LBDC')
    const birthday = data.member.birthday && new Date(`${data.member.birthday}T12:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    if (birthday === today) badges.push('🎂 Anniversaire aujourd’hui')
    if (activeCoupons.length) badges.push('🎁 Coupon disponible')
  }

  return <section className="service-panel">
    <div className="service-heading">
      <div><span className="club-badge">Mode Service</span><h2>Scanner un client</h2></div>
      <button type="button" className="button" onClick={startScan} disabled={scanning || busy || !!data}>{scanning ? 'Scanner actif' : '📷 Ouvrir le scanner'}</button>
    </div>

    <div className="service-daily-stats" aria-label="Statistiques du jour">
      <article><strong>{stats.customers}</strong><span>Clients aujourd’hui</span></article>
      <article><strong>{stats.formulas}</strong><span>Formules ajoutées</span></article>
      <article><strong>{stats.rewards}</strong><span>Récompenses utilisées</span></article>
    </div>

    {!data && <div className={scanning ? 'service-scanner-shell is-active' : 'service-scanner-shell'}>
      <div id="service-qr-reader" className="service-qr-reader" />
      {scanning && <div className="service-scan-line" aria-hidden="true" />}
    </div>}

    <div className="service-manual">
      <input placeholder="Code membre ou lien du QR code" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') lookup(value) }} />
      <button className="button secondary" disabled={busy || !value.trim()} onClick={() => lookup(value)}>Rechercher</button>
    </div>

    {message && <p className="admin-login-message service-message" aria-live="polite">{message}</p>}

    {data && <div className="service-card">
      <div className="service-client-header"><div><span className="service-client-label">Client identifié</span><h3>{data.member.first_name} {data.member.last_name}</h3><p>{data.member.email}</p></div><div className="service-points-ring"><strong>{data.member.loyalty_points}</strong><span>/ 10</span></div></div>
      {badges.length > 0 && <div className="service-badges">{badges.map((badge) => <span key={badge}>{badge}</span>)}</div>}
      <div className="member-cards"><article><strong>{data.member.loyalty_points}/10</strong><p>Fidélité</p></article><article><strong>{data.totalVisits}</strong><p>Passages</p></article><article><strong>{data.totalRewards}</strong><p>Formules offertes</p></article></div>
      <div className="service-client-details">
        <p><strong>Dernier passage :</strong> {data.lastVisit ? new Date(data.lastVisit).toLocaleString('fr-FR') : 'Aucun'}</p>
        {data.member.birthday && <p><strong>Anniversaire :</strong> {new Date(`${data.member.birthday}T12:00:00`).toLocaleDateString('fr-FR')}</p>}
        <p><strong>Offre de bienvenue :</strong> {!data.welcome ? 'Non créée' : data.welcome.used_at ? 'Utilisée' : new Date(data.welcome.expires_at).getTime() < Date.now() ? 'Expirée' : 'Disponible'}</p>
        <p><strong>Coupons actifs :</strong> {activeCoupons.length}</p>
      </div>
      <div className="actions service-primary-actions">
        <button className="button service-add-button" disabled={busy || data.member.reward_available} onClick={() => loyalty('add')}>+1 formule</button>
        {data.member.reward_available && <button className="button" disabled={busy} onClick={() => loyalty('redeem')}>🎁 Utiliser la formule offerte</button>}
        <button className="button secondary" disabled={busy} onClick={nextClient}>Client suivant</button>
      </div>
      {data.welcome && !data.welcome.used_at && new Date(data.welcome.expires_at).getTime() > Date.now() && <p><a className="button secondary" href={`/offre-bienvenue/${data.welcome.token}`}>Utiliser le -10 % de bienvenue</a></p>}
      {activeCoupons.map((coupon: any) => <p key={coupon.id}><a className="button secondary" href={`/coupon/${coupon.token}`}>Utiliser : {coupon.club_promotions?.title || 'Coupon promotionnel'}</a></p>)}
      <details><summary>Voir l’historique</summary><div className="service-history">{data.events.map((event: any) => <p key={event.id}>{new Date(event.created_at).toLocaleString('fr-FR')} — {event.event_type === 'passage' ? 'Passage' : 'Formule offerte'}</p>)}</div></details>
    </div>}
  </section>
}
