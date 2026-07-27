'use client'

import { useState } from 'react'

type Member = {
  first_name: string
  last_name: string
  email: string
  loyalty_points: number
  reward_available: boolean
}

type FormulaPrice = { name: string; formatted: string }

export function LoyaltyValidator({ code, initial, formula }: { code: string; initial: Member; formula: FormulaPrice }) {
  const [member, setMember] = useState(initial)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [receipt, setReceipt] = useState<string | null>(null)

  async function ensureLogin() {
    if (!password) return true
    const response = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    return response.ok
  }

  async function act(action: 'add' | 'redeem') {
    setBusy(true)
    setMessage('Validation…')
    setReceipt(null)
    if (!(await ensureLogin())) {
      setMessage('Mot de passe administrateur incorrect.')
      setBusy(false)
      return
    }
    const response = await fetch('/api/club/loyalty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, action }),
    })
    const data = await response.json()
    if (response.ok) {
      setMember(data.member)
      setMessage(action === 'add' ? 'Passage ajouté.' : `${formula.name} offerte enregistrée pour ${formula.formatted} TTC.`)
      if (data.event?.receipt_number) setReceipt(data.event.receipt_number)
    } else {
      setMessage(data.error || 'Opération impossible.')
    }
    setBusy(false)
  }

  return <section className="loyalty-validator">
    <span className="club-badge">Fidélité LBDC</span>
    <h2>{member.first_name} {member.last_name}</h2>
    <p>{member.email}</p>
    <p className="loyalty-rule"><strong>Pour l’achat de 10 formules, la 11ᵉ est offerte.</strong><br />Une seule validation fidélité par jour et par personne. Offre personnelle et non cessible.</p>
    <div className="member-cards">
      <article><span>⭐</span><strong>{member.loyalty_points}/10</strong><p>Formules achetées</p></article>
      <article><span>🎁</span><strong>{member.reward_available ? 'Disponible' : 'À venir'}</strong><p>11ᵉ formule offerte</p></article>
    </div>
    <label>Mot de passe administrateur <small>(uniquement si votre session n’est pas déjà ouverte)</small><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
    {member.reward_available && <p className="loyalty-rule"><strong>Valeur comptable automatique : {formula.formatted} TTC</strong><br />Prix actuel de « {formula.name} », récupéré directement depuis le menu du jour.</p>}
    <div className="actions">
      <button className="button" disabled={busy || member.reward_available} onClick={() => act('add')}>Ajouter 1 formule</button>
      {member.reward_available && <button className="button secondary" disabled={busy} onClick={() => act('redeem')}>Utiliser la formule offerte</button>}
    </div>
    {message && <p className="success">{message}</p>}
    {receipt && <p><a className="button secondary" target="_blank" href={`/api/club/receipt/${encodeURIComponent(receipt)}`}>Imprimer le justificatif</a></p>}
  </section>
}
