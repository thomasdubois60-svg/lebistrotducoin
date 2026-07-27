'use client'

import { useMemo, useState } from 'react'

type Member = {
  id: string
  first_name: string
  last_name: string
  email: string
  birthday: string | null
  email_marketing: boolean
  notification_interest: boolean
  loyalty_points: number
  reward_available: boolean
  personal_code: string
  created_at: string
}

type LoyaltyEvent = {
  id: string
  member_id: string
  event_type: 'passage' | 'reward'
  event_day: string
  created_at: string
  receipt_number: string | null
  reward_value_ttc: number | null
  note: string | null
  club_members?: { first_name: string; last_name: string; email: string; personal_code: string }
}

type Formula = { name: string; formatted: string; valueTtc: number }

const formatDate = (value: string) => new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
const birthdayLabel = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })
const currency = (value: number) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })

export function AdminClubPanel({ password }: { password: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<LoyaltyEvent[]>([])
  const [formula, setFormula] = useState<Formula | null>(null)
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('Clique sur « Charger les données ».')
  const [busy, setBusy] = useState(false)
  const [view, setView] = useState<'members' | 'history' | 'birthdays' | 'rewards'>('members')

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return normalizedQuery
      ? members.filter((member) => `${member.first_name} ${member.last_name} ${member.email}`.toLowerCase().includes(normalizedQuery))
      : members
  }, [members, query])

  const rewards = useMemo(() => events.filter((event) => event.event_type === 'reward'), [events])
  const passages = useMemo(() => events.filter((event) => event.event_type === 'passage'), [events])
  const rewardCount = useMemo(() => {
    const map = new Map<string, number>()
    for (const event of rewards) map.set(event.member_id, (map.get(event.member_id) || 0) + 1)
    return map
  }, [rewards])
  const birthdays = useMemo(() => members.filter((member) => member.birthday).sort((a, b) => (a.birthday || '').slice(5).localeCompare((b.birthday || '').slice(5))), [members])

  const today = new Date().toISOString().slice(0, 10)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const passagesToday = passages.filter((event) => event.event_day === today).length
  const rewardsThisMonth = rewards.filter((event) => event.event_day.startsWith(currentMonth))
  const rewardValueThisMonth = rewardsThisMonth.reduce((total, event) => total + Number(event.reward_value_ttc || 0), 0)
  const totalRewardValue = rewards.reduce((total, event) => total + Number(event.reward_value_ttc || 0), 0)
  const birthdaysThisMonth = members.filter((member) => member.birthday?.slice(5, 7) === currentMonth.slice(5, 7)).length

  async function load() {
    setBusy(true)
    setMessage('Chargement…')
    const response = await fetch('/api/club/admin-data', { headers: { 'x-admin-password': password }, cache: 'no-store' })
    const data = await response.json()
    if (response.ok) {
      setMembers(data.members || [])
      setEvents(data.events || [])
      setFormula(data.formula || null)
      setMessage(`${data.members.length} membres, ${data.events.length} opérations.`)
    } else {
      setMessage(data.error || 'Chargement impossible.')
    }
    setBusy(false)
  }

  return <section className="club-admin-section">
    <div className="club-admin-heading">
      <div><span className="club-badge">CLUB LBDC</span><h2>Suivi fidélité et comptabilité</h2></div>
      <div className="actions">
        <button type="button" className="button secondary" onClick={load} disabled={busy}>{busy ? 'Chargement…' : 'Charger les données'}</button>
        <a className="button" href="/api/club/export">Exporter pour la comptabilité</a>
      </div>
    </div>

    {formula && <p className="loyalty-rule"><strong>Formule complète de référence : {formula.formatted} TTC</strong><br />Ce prix est récupéré automatiquement depuis « Aujourd’hui → Nos formules → {formula.name} ». Toute modification du prix sur le site s’appliquera aux prochaines formules offertes.</p>}

    <div className="club-stat-grid">
      <div><strong>{members.length}</strong><span>Membres</span></div>
      <div><strong>{passagesToday}</strong><span>Passages aujourd’hui</span></div>
      <div><strong>{rewardsThisMonth.length}</strong><span>Formules offertes ce mois</span></div>
      <div><strong>{currency(rewardValueThisMonth)}</strong><span>Valeur offerte ce mois</span></div>
      <div><strong>{rewards.length}</strong><span>Formules offertes au total</span></div>
      <div><strong>{currency(totalRewardValue)}</strong><span>Valeur totale offerte</span></div>
      <div><strong>{birthdaysThisMonth}</strong><span>Anniversaires ce mois</span></div>
      <div><strong>{members.filter((member) => member.reward_available).length}</strong><span>Récompenses disponibles</span></div>
    </div>

    <div className="club-admin-tabs">
      <button onClick={() => setView('members')}>Clients</button>
      <button onClick={() => setView('history')}>Historique</button>
      <button onClick={() => setView('birthdays')}>Anniversaires</button>
      <button onClick={() => setView('rewards')}>Formules offertes</button>
    </div>

    <label>Rechercher un client<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Prénom, nom ou e-mail" /></label>
    <p className="admin-help">{message}</p>

    {view === 'members' && <div className="club-member-list">{filtered.map((member) => <article key={member.id} className="club-member-card">
      <div><strong>{member.first_name} {member.last_name}</strong><a href={`mailto:${member.email}`}>{member.email}</a>{member.birthday && <small>Anniversaire : {birthdayLabel(member.birthday)}</small>}</div>
      <div className="club-member-meta"><span>{member.loyalty_points}/10</span><span>{rewardCount.get(member.id) || 0} formule{(rewardCount.get(member.id) || 0) > 1 ? 's' : ''} offerte{(rewardCount.get(member.id) || 0) > 1 ? 's' : ''}</span><span>{member.reward_available ? 'Avantage disponible' : 'En cours'}</span></div>
    </article>)}</div>}

    {view === 'history' && <div className="club-table-wrap"><table className="club-table"><thead><tr><th>Date</th><th>Client</th><th>Opération</th><th>Montant</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td>{formatDate(event.created_at)}</td><td>{event.club_members?.first_name} {event.club_members?.last_name}</td><td>{event.event_type === 'passage' ? 'Formule achetée' : event.note || 'Formule offerte'}</td><td>{event.event_type === 'reward' ? currency(Number(event.reward_value_ttc || 0)) : '—'}</td></tr>)}</tbody></table></div>}

    {view === 'birthdays' && <div className="club-member-list">{birthdays.map((member) => <article key={member.id} className="club-member-card"><div><strong>{birthdayLabel(member.birthday!)} — {member.first_name} {member.last_name}</strong><a href={`mailto:${member.email}`}>{member.email}</a></div></article>)}</div>}

    {view === 'rewards' && <div className="club-table-wrap"><table className="club-table"><thead><tr><th>Date</th><th>Client</th><th>Avantage</th><th>Valeur TTC</th><th>Justificatif</th></tr></thead><tbody>{rewards.map((event) => <tr key={event.id}><td>{formatDate(event.created_at)}</td><td>{event.club_members?.first_name} {event.club_members?.last_name}</td><td>{event.note || 'Formule fidélité offerte'}</td><td>{currency(Number(event.reward_value_ttc || 0))}</td><td>{event.receipt_number && <a target="_blank" href={`/api/club/receipt/${encodeURIComponent(event.receipt_number)}`}>Imprimer</a>}</td></tr>)}</tbody></table></div>}
  </section>
}
