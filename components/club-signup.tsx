'use client'
import { useState } from 'react'
import Link from 'next/link'

export function ClubSignup() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const [emailMarketing, setEmailMarketing] = useState(false)
  const [notificationInterest, setNotificationInterest] = useState(true)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [personalCode, setPersonalCode] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('Inscription en cours…')
    const response = await fetch('/api/club/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, birthday, emailMarketing, notificationInterest, privacyAccepted }),
    })
    const data = await response.json()
    if (response.ok) {
      setSuccess(true)
      setPersonalCode(data.member.personalCode)
      setMessage(`Bienvenue au Club LBDC, ${data.member.firstName} !`)
      localStorage.setItem('club-lbdc-member', JSON.stringify({ firstName, email, personalCode: data.member.personalCode }))
    } else {
      setMessage(data.error || 'Inscription impossible.')
    }
    setBusy(false)
  }

  if (success) return <div className="club-success"><span className="club-badge">CLUB LBDC</span><h2>{message}</h2><p>Votre inscription est enregistrée. Conservez votre code membre :</p><div className="member-code-card"><code>{personalCode}</code></div><div className="actions"><Link className="button" href="/club/espace">Ouvrir mon espace</Link><Link className="button secondary" href="/application">Installer l’application</Link></div></div>

  return <form className="club-form" onSubmit={submit}>
    <span className="club-badge">Inscription gratuite</span>
    <h2>Rejoindre le Club LBDC</h2>
    <p>Recevez les menus, les événements et les avantages réservés aux membres.</p>
    <div className="club-form-grid">
      <label>Prénom<input required minLength={2} value={firstName} onChange={event=>setFirstName(event.target.value)} autoComplete="given-name"/></label>
      <label>Adresse e-mail<input required type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email"/></label>
      <label>Date d’anniversaire <small>(facultative)</small><input type="date" value={birthday} onChange={event=>setBirthday(event.target.value)}/></label>
    </div>
    <label className="checkbox-label club-check"><input type="checkbox" checked={notificationInterest} onChange={event=>setNotificationInterest(event.target.checked)}/> Je souhaite recevoir les notifications du menu et des événements.</label>
    <label className="checkbox-label club-check"><input type="checkbox" checked={emailMarketing} onChange={event=>setEmailMarketing(event.target.checked)}/> J’accepte de recevoir occasionnellement des offres du Bistrot par e-mail.</label>
    <label className="checkbox-label club-check"><input required type="checkbox" checked={privacyAccepted} onChange={event=>setPrivacyAccepted(event.target.checked)}/> J’accepte l’enregistrement de ces informations pour gérer mon inscription au Club. Je pourrai demander leur suppression à tout moment.</label>
    <button className="button club-submit" disabled={busy}>{busy?'Veuillez patienter…':'Rejoindre le Club'}</button>
    {message&&<p className={success?'success':'admin-login-message'} aria-live="polite">{message}</p>}
  </form>
}
