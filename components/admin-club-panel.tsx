'use client'
import { useMemo, useState } from 'react'

type Member = {
  id:string; first_name:string; last_name:string; email:string; birthday:string|null; email_marketing:boolean; notification_interest:boolean;
  loyalty_points:number; reward_available:boolean; personal_code:string; created_at:string
}
type Stats = { total:number; emailSubscribers:number; notificationInterested:number; rewards:number }

export function AdminClubPanel({ password }: { password: string }) {
  const [members,setMembers]=useState<Member[]>([])
  const [stats,setStats]=useState<Stats|null>(null)
  const [query,setQuery]=useState('')
  const [message,setMessage]=useState('Clique sur « Charger les membres ».')
  const [busy,setBusy]=useState(false)

  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?members.filter(member=>`${member.first_name} ${member.last_name} ${member.email}`.toLowerCase().includes(q)):members},[members,query])
  async function load(){setBusy(true);setMessage('Chargement…');const response=await fetch('/api/club/members',{headers:{'x-admin-password':password},cache:'no-store'});const data=await response.json();if(response.ok){setMembers(data.members);setStats(data.stats);setMessage(`${data.stats.total} membre${data.stats.total>1?'s':''}.`)}else setMessage(data.error||'Chargement impossible.');setBusy(false)}

  return <section className="club-admin-section">
    <div className="club-admin-heading"><div><span className="club-badge">CLUB LBDC</span><h2>Membres</h2></div><button type="button" className="button secondary" onClick={load} disabled={busy}>{busy?'Chargement…':'Charger les membres'}</button></div>
    {stats&&<div className="club-stat-grid"><div><strong>{stats.total}</strong><span>Membres</span></div><div><strong>{stats.emailSubscribers}</strong><span>E-mails acceptés</span></div><div><strong>{stats.notificationInterested}</strong><span>Notifications souhaitées</span></div><div><strong>{stats.rewards}</strong><span>Récompenses prêtes</span></div></div>}
    <label>Rechercher un membre<input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Prénom, nom ou e-mail"/></label>
    <p className="admin-help">{message}</p>
    {filtered.length>0&&<div className="club-member-list">{filtered.map(member=><article key={member.id} className="club-member-card"><div><strong>{member.first_name} {member.last_name}</strong><a href={`mailto:${member.email}`}>{member.email}</a></div><div className="club-member-meta"><span>{member.email_marketing?'E-mail accepté':'Pas d’e-mail promo'}</span><span>{member.notification_interest?'Notifications souhaitées':'Notifications non demandées'}</span><span>{member.loyalty_points} passage{member.loyalty_points>1?'s':''}</span></div></article>)}</div>}
  </section>
}
