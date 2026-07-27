'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Member = {
  firstName: string
  email: string
  birthday: string | null
  personalCode: string
  loyaltyPoints: number
  rewardAvailable: boolean
  emailMarketing: boolean
  notificationInterest: boolean
  createdAt: string
}

const STORAGE_KEY = 'club-lbdc-member'

export function ClubMemberSpace() {
  const [email, setEmail] = useState('')
  const [personalCode, setPersonalCode] = useState('')
  const [member, setMember] = useState<Member | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved) as Partial<Member>
      if (parsed.email && parsed.personalCode) {
        setEmail(parsed.email)
        setPersonalCode(parsed.personalCode)
        login(parsed.email, parsed.personalCode)
      }
    } catch {}
  }, [])

  async function login(emailValue = email, codeValue = personalCode) {
    setBusy(true)
    setMessage('Connexion en cours…')
    const response = await fetch('/api/club/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailValue, personalCode: codeValue }),
    })
    const data = await response.json()
    if (response.ok) {
      setMember(data.member)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.member))
      setMessage('')
    } else {
      setMember(null)
      setMessage(data.error || 'Connexion impossible.')
    }
    setBusy(false)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setMember(null)
    setPersonalCode('')
    setMessage('Vous êtes déconnecté.')
  }

  if (!member) return <section className="member-login-card">
    <span className="club-badge">Espace membre</span>
    <h2>Accéder à mon espace</h2>
    <p>Utilisez votre adresse e-mail et le code membre reçu lors de votre inscription.</p>
    <label>Adresse e-mail<input type="email" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" /></label>
    <label>Code membre<input value={personalCode} onChange={event => setPersonalCode(event.target.value)} autoComplete="one-time-code" /></label>
    <button className="button" disabled={busy} onClick={() => login()}>{busy ? 'Connexion…' : 'Se connecter'}</button>
    {message && <p className="admin-login-message" aria-live="polite">{message}</p>}
    <p className="member-help">Pas encore membre ? <Link className="text-link" href="/club">Rejoindre le Club LBDC</Link></p>
  </section>

  return <section className="member-dashboard">
    <div className="member-dashboard-head">
      <div><span className="club-badge">Membre du Club</span><h2>Bonjour {member.firstName} 👋</h2><p>{member.email}</p></div>
      <button className="button secondary" onClick={logout}>Se déconnecter</button>
    </div>
    <div className="member-cards">
      <article><span>⭐</span><strong>{member.loyaltyPoints}/10</strong><p>Repas enregistrés</p></article>
      <article><span>🎁</span><strong>{member.rewardAvailable ? 'Disponible' : 'À venir'}</strong><p>Prochaine récompense</p></article>
      <article><span>🔔</span><strong>{member.notificationInterest ? 'Activées' : 'Non demandées'}</strong><p>Notifications souhaitées</p></article>
    </div>
    <div className="member-code-card"><h3>Mon code membre</h3><code>{member.personalCode}</code><p>Conservez ce code. Il permet de retrouver votre espace sur un autre téléphone.</p></div>
    <div className="actions"><Link className="button" href="/aujourdhui">Menu du jour</Link><Link className="button secondary" href="/evenements">Événements</Link><Link className="button secondary" href="/application">Installer l’application</Link></div>
  </section>
}
