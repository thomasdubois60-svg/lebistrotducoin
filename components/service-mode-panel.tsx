'use client'
import { useEffect,useRef,useState } from 'react'

type Data=any
export function ServiceModePanel({password}:{password:string}){
 const [value,setValue]=useState(''); const [data,setData]=useState<Data|null>(null); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false); const scanner=useRef<any>(null)
 async function lookup(v=value){if(!v.trim())return;setBusy(true);setMessage('Recherche…');const r=await fetch('/api/club/service/lookup',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify({value:v})});const d=await r.json();if(r.ok){setData(d);setMessage('')}else{setData(null);setMessage(d.error||'Membre introuvable.')}setBusy(false)}
 async function startScan(){setMessage('Ouverture de la caméra…');try{const {Html5Qrcode}=await import('html5-qrcode'); if(scanner.current)await scanner.current.stop().catch(()=>{}); const q=new Html5Qrcode('service-qr-reader'); scanner.current=q; await q.start({facingMode:'environment'},{fps:10,qrbox:{width:250,height:250}},async(text:string)=>{await q.stop();setValue(text);lookup(text)},()=>{});setMessage('Présente le QR code devant la caméra.')}catch(e){setMessage('Caméra indisponible. Utilise la saisie manuelle ci-dessous.') }}
 useEffect(()=>()=>{scanner.current?.stop?.().catch(()=>{})},[])
 async function loyalty(action:'add'|'redeem'){if(!data)return;setBusy(true);const r=await fetch('/api/club/loyalty',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify({code:data.member.personal_code,action})});const d=await r.json();setMessage(r.ok?(action==='add'?'Formule ajoutée.':'Formule offerte enregistrée.'):(d.error||'Opération impossible.'));if(r.ok)lookup(data.member.personal_code);setBusy(false)}
 const activeCoupons=(data?.coupons||[]).filter((c:any)=>!c.used_at&&new Date(c.expires_at).getTime()>Date.now())
 return <section className="service-panel">
  <span className="club-badge">Mode Service</span><h2>Scanner un client</h2>
  <button type="button" className="button" onClick={startScan}>📷 Ouvrir le scanner</button>
  <div id="service-qr-reader" className="service-qr-reader" />
  <div className="service-manual"><input placeholder="Colle un lien QR ou un code membre" value={value} onChange={e=>setValue(e.target.value)}/><button className="button secondary" disabled={busy} onClick={()=>lookup()}>Rechercher</button></div>
  {message&&<p className="admin-login-message">{message}</p>}
  {data&&<div className="service-card">
   <h3>{data.member.first_name} {data.member.last_name}</h3><p>{data.member.email}</p>
   <div className="member-cards"><article><strong>{data.member.loyalty_points}/10</strong><p>Fidélité</p></article><article><strong>{data.totalVisits}</strong><p>Passages</p></article><article><strong>{data.totalRewards}</strong><p>Formules offertes</p></article></div>
   <p><strong>Dernier passage :</strong> {data.lastVisit?new Date(data.lastVisit).toLocaleString('fr-FR'):'Aucun'}</p>
   {data.member.birthday&&<p><strong>Anniversaire :</strong> {new Date(data.member.birthday+'T12:00:00').toLocaleDateString('fr-FR')}</p>}
   <p><strong>Offre de bienvenue :</strong> {!data.welcome?'Non créée':data.welcome.used_at?'Utilisée':new Date(data.welcome.expires_at).getTime()<Date.now()?'Expirée':'Disponible'}</p>
   <p><strong>Coupons actifs :</strong> {activeCoupons.length}</p>
   <div className="actions"><button className="button" disabled={busy||data.member.reward_available} onClick={()=>loyalty('add')}>+1 formule</button>{data.member.reward_available&&<button className="button secondary" disabled={busy} onClick={()=>loyalty('redeem')}>Utiliser la formule offerte</button>}</div>
   {data.welcome&&!data.welcome.used_at&&new Date(data.welcome.expires_at).getTime()>Date.now()&&<p><a className="button secondary" href={`/offre-bienvenue/${data.welcome.token}`}>Utiliser le -10 % de bienvenue</a></p>}
   {activeCoupons.map((c:any)=><p key={c.id}><a className="button secondary" href={`/coupon/${c.token}`}>Utiliser : {c.club_promotions?.title||'Coupon promotionnel'}</a></p>)}
   <details><summary>Voir l’historique</summary><div className="service-history">{data.events.map((e:any)=><p key={e.id}>{new Date(e.created_at).toLocaleString('fr-FR')} — {e.event_type==='passage'?'Passage':'Formule offerte'}</p>)}</div></details>
  </div>}
 </section>
}
