'use client'
import { useCallback,useEffect,useRef,useState } from 'react'

type Data=any
export function ServiceModePanel({password}:{password:string}){
 const [value,setValue]=useState(''); const [data,setData]=useState<Data|null>(null); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false); const [scanning,setScanning]=useState(false); const scanner=useRef<any>(null); const starting=useRef(false)
 const stopScan=useCallback(async()=>{if(scanner.current){await scanner.current.stop().catch(()=>{});await scanner.current.clear?.().catch?.(()=>{});scanner.current=null}setScanning(false)},[])
 const lookup=useCallback(async(v:string)=>{if(!v.trim())return;setBusy(true);setMessage('Recherche…');const r=await fetch('/api/club/service/lookup',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify({value:v})});const d=await r.json();if(r.ok){setData(d);setMessage('')}else{setData(null);setMessage(d.error||'Membre introuvable.')}setBusy(false)},[password])
 const startScan=useCallback(async()=>{if(starting.current||scanning)return;starting.current=true;setData(null);setMessage('Ouverture de la caméra…');try{const {Html5Qrcode}=await import('html5-qrcode');await stopScan();const q=new Html5Qrcode('service-qr-reader');scanner.current=q;await q.start({facingMode:'environment'},{fps:12,qrbox:{width:260,height:260}},async(text:string)=>{await stopScan();setValue(text);await lookup(text)},()=>{});setScanning(true);setMessage('Présente le QR code devant la caméra.')}catch{setMessage('Caméra indisponible. Appuie sur « Ouvrir le scanner » ou utilise la saisie manuelle.')}finally{starting.current=false}},[lookup,scanning,stopScan])
 useEffect(()=>{const t=setTimeout(()=>startScan(),450);return()=>{clearTimeout(t);stopScan()}},[])
 async function loyalty(action:'add'|'redeem'){if(!data)return;setBusy(true);const r=await fetch('/api/club/loyalty',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify({code:data.member.personal_code,action})});const d=await r.json();if(r.ok){setMessage(action==='add'?'Formule ajoutée. Scanner prêt pour le client suivant.':'Formule offerte enregistrée. Scanner prêt pour le client suivant.');setData(null);setValue('');setTimeout(()=>startScan(),700)}else setMessage(d.error||'Opération impossible.');setBusy(false)}
 const activeCoupons=(data?.coupons||[]).filter((c:any)=>!c.used_at&&new Date(c.expires_at).getTime()>Date.now())
 const visits=Number(data?.totalVisits||0);const badges:string[]=[];if(data){if(visits<3)badges.push('🟢 Nouveau client');if(visits>=10)badges.push('⭐ Client fidèle');if(visits>=30)badges.push('🥇 Client Premium');if(visits>=50)badges.push('👑 Ambassadeur LBDC');if(data.member.birthday&&new Date(data.member.birthday+'T12:00:00').toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})===new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}))badges.push('🎂 Anniversaire aujourd’hui');if(activeCoupons.length)badges.push('🎁 Coupon disponible')}
 return <section className="service-panel">
  <div className="service-heading"><div><span className="club-badge">Mode Service</span><h2>Scanner un client</h2></div><button type="button" className="button" onClick={startScan} disabled={scanning||busy}>{scanning?'Scanner actif':'📷 Ouvrir le scanner'}</button></div>
  <div id="service-qr-reader" className="service-qr-reader" />
  <div className="service-manual"><input placeholder="Colle un lien QR ou un code membre" value={value} onChange={e=>setValue(e.target.value)}/><button className="button secondary" disabled={busy} onClick={()=>lookup(value)}>Rechercher</button></div>
  {message&&<p className="admin-login-message" aria-live="polite">{message}</p>}
  {data&&<div className="service-card">
   <h3>{data.member.first_name} {data.member.last_name}</h3><p>{data.member.email}</p>{badges.length>0&&<div className="service-badges">{badges.map(x=><span key={x}>{x}</span>)}</div>}
   <div className="member-cards"><article><strong>{data.member.loyalty_points}/10</strong><p>Fidélité</p></article><article><strong>{data.totalVisits}</strong><p>Passages</p></article><article><strong>{data.totalRewards}</strong><p>Formules offertes</p></article></div>
   <p><strong>Dernier passage :</strong> {data.lastVisit?new Date(data.lastVisit).toLocaleString('fr-FR'):'Aucun'}</p>
   {data.member.birthday&&<p><strong>Anniversaire :</strong> {new Date(data.member.birthday+'T12:00:00').toLocaleDateString('fr-FR')}</p>}
   <p><strong>Offre de bienvenue :</strong> {!data.welcome?'Non créée':data.welcome.used_at?'Utilisée':new Date(data.welcome.expires_at).getTime()<Date.now()?'Expirée':'Disponible'}</p>
   <p><strong>Coupons actifs :</strong> {activeCoupons.length}</p>
   <div className="actions"><button className="button" disabled={busy||data.member.reward_available} onClick={()=>loyalty('add')}>+1 formule</button>{data.member.reward_available&&<button className="button secondary" disabled={busy} onClick={()=>loyalty('redeem')}>Utiliser la formule offerte</button>}<button className="button secondary" onClick={()=>{setData(null);setValue('');startScan()}}>Client suivant</button></div>
   {data.welcome&&!data.welcome.used_at&&new Date(data.welcome.expires_at).getTime()>Date.now()&&<p><a className="button secondary" href={`/offre-bienvenue/${data.welcome.token}`}>Utiliser le -10 % de bienvenue</a></p>}
   {activeCoupons.map((c:any)=><p key={c.id}><a className="button secondary" href={`/coupon/${c.token}`}>Utiliser : {c.club_promotions?.title||'Coupon promotionnel'}</a></p>)}
   <details><summary>Voir l’historique</summary><div className="service-history">{data.events.map((e:any)=><p key={e.id}>{new Date(e.created_at).toLocaleString('fr-FR')} — {e.event_type==='passage'?'Passage':'Formule offerte'}</p>)}</div></details>
  </div>}
 </section>
}
