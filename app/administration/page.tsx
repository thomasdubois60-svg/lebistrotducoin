'use client'
import { useEffect, useState } from 'react'
import { defaultContent, EventItem, FormulaItem, GalleryItem, MenuItem, normalizeContent, SiteContent, SocialLink } from '@/lib/default-content'
import { PageHero } from '@/components/page-hero'
import { AdminClubPanel } from '@/components/admin-club-panel'
import { AdminPromotionsPanel } from '@/components/admin-promotions-panel'
import { AdminCommunicationPanel } from '@/components/admin-communication-panel'
import { ServiceModePanel } from '@/components/service-mode-panel'
import { AdminInstallButton } from '@/components/admin-install-button'
import { ProductPhotoPicker } from '@/components/product-photo-picker'

const blankItem: MenuItem = { name:'', description:'', price:'', image:'', imageAlt:'' }
const blankFormula: FormulaItem = { name:'Nouvelle formule', price:'', takeawayPrice:'' }
const blankEvent: EventItem = { title:'Nouvel événement', date:'', description:'', price:'', image:'', imageAlt:'' }
const blankPhoto: GalleryItem = { src:'', alt:'Photo du Bistrot', label:'Le Bistrot' }
const blankSocial: SocialLink = { label:'Nouveau réseau', url:'' }

export default function AdminPage(){
 const [content,setContent]=useState<SiteContent>(defaultContent)
 const [password,setPassword]=useState(''); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false); const [authenticated,setAuthenticated]=useState(false); const [loginMessage,setLoginMessage]=useState('')
 const [notificationTitle,setNotificationTitle]=useState('Nouveau au Bistrot'); const [notificationBody,setNotificationBody]=useState('Découvrez le nouveau menu du jour ou notre prochain événement.'); const [notificationUrl,setNotificationUrl]=useState('/aujourdhui'); const [subscriberCount,setSubscriberCount]=useState<number|null>(null); const [notificationMessage,setNotificationMessage]=useState('')
 useEffect(()=>{const savedPassword=localStorage.getItem('bistrot-admin-password')||'';setPassword(savedPassword);setAuthenticated(localStorage.getItem('bistrot-admin')==='connected'&&!!savedPassword);fetch('/api/content',{cache:'no-store'}).then(r=>r.json()).then(d=>setContent(normalizeContent(d))).catch(()=>{})},[])
 const uploadFile=async(source:File|string)=>{ if(!password) throw new Error('Saisis d’abord le mot de passe administrateur.'); const form=new FormData(); if(source instanceof File)form.append('file',source);else form.append('url',source); const r=await fetch('/api/upload',{method:'POST',headers:{'x-admin-password':password},body:form}); const data=await r.json(); if(!r.ok) throw new Error(data.error||'Erreur lors de l’envoi.'); return data.src as string }
 const runUpload=async(source:File|string,apply:(src:string)=>void,label:string)=>{setBusy(true);setMessage('Envoi de la photo…');try{const src=await uploadFile(source);apply(src);setMessage(`${label} Appuie maintenant sur « Publier les modifications ».`)}catch(e){setMessage(e instanceof Error?e.message:'Erreur lors de l’envoi.')}setBusy(false)}
 const save=async()=>{setBusy(true);setMessage('Publication en cours…');const r=await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify(content)});const data=await r.json();setMessage(r.ok?'Modifications enregistrées. Vercel les publiera automatiquement dans quelques instants.':(data.error||'Publication impossible.'));if(r.ok)window.dispatchEvent(new Event('bistrot-content-updated'));setBusy(false)}
 const refreshSubscriberCount=async()=>{setNotificationMessage('Lecture…');const r=await fetch('/api/push/count',{headers:{'x-admin-password':password},cache:'no-store'});const d=await r.json();if(r.ok){setSubscriberCount(d.count);setNotificationMessage('')}else setNotificationMessage(d.error||'Lecture impossible.')}
 const sendNotification=async()=>{setBusy(true);setNotificationMessage('Envoi de la notification…');const r=await fetch('/api/push/send',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify({title:notificationTitle,body:notificationBody,url:notificationUrl})});const d=await r.json();setNotificationMessage(r.ok?`Notification envoyée à ${d.sent} abonné${d.sent>1?'s':''}.${d.failed?` ${d.failed} échec(s).`:''}`:(d.error||'Envoi impossible.'));if(r.ok)setSubscriberCount(Math.max(0,(d.total||0)-(d.removed||0)));setBusy(false)}
 const publishAndNotify=async()=>{setBusy(true);setMessage('Publication en cours…');const publish=await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify(content)});const published=await publish.json();if(!publish.ok){setMessage(published.error||'Publication impossible.');setBusy(false);return}window.dispatchEvent(new Event('bistrot-content-updated'));setNotificationMessage('Envoi de la notification…');const push=await fetch('/api/push/send',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify({title:notificationTitle,body:notificationBody,url:notificationUrl})});const pushed=await push.json();setMessage(push.ok?`Modifications publiées et notification envoyée à ${pushed.sent} abonné${pushed.sent>1?'s':''}.`:`Modifications publiées, mais notification non envoyée : ${pushed.error||'erreur inconnue'}`);setNotificationMessage('');setBusy(false)}
 const updateDaily=(group:'starters'|'mains'|'desserts',i:number,v:string)=>setContent(c=>({...c,daily:{...c.daily,[group]:c.daily[group].map((x,n)=>n===i?{...x,name:v}:x)}}))
 const moveInArray=<T,>(items:T[],from:number,to:number)=>{if(to<0||to>=items.length)return items;const copy=[...items];const [moved]=copy.splice(from,1);copy.splice(to,0,moved);return copy}
 const moveCategory=(index:number,direction:-1|1)=>setContent(c=>({...c,menu:moveInArray(c.menu,index,index+direction)}))
 const moveProduct=(sectionIndex:number,itemIndex:number,direction:-1|1)=>setContent(c=>({...c,menu:c.menu.map((section,index)=>index===sectionIndex?{...section,items:moveInArray(section.items,itemIndex,itemIndex+direction)}:section)}))
 const textArea=(value:string,onChange:(v:string)=>void)=><textarea value={value} onChange={e=>onChange(e.target.value)}/>
 const login=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setLoginMessage('Vérification…');const r=await fetch('/api/admin-login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});const d=await r.json();if(r.ok){localStorage.setItem('bistrot-admin','connected');localStorage.setItem('bistrot-admin-password',password);setAuthenticated(true);setLoginMessage('')}else setLoginMessage(d.error||'Connexion impossible.');setBusy(false)}
 const logout=()=>{localStorage.removeItem('bistrot-admin');localStorage.removeItem('bistrot-admin-password');setAuthenticated(false);setPassword('');setMessage('')}
 const goToSection=(id:string)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'})}
 if(!authenticated) return <><PageHero eyebrow="Espace privé" title="Connexion" text="Accédez à l’administration du Bistrot."/><section className="section"><form className="container admin-login-card" onSubmit={login}><h2>Administration</h2><p>Saisissez votre mot de passe pour afficher le tableau de bord.</p><label>Mot de passe<input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="button" disabled={busy||!password}>{busy?'Vérification…':'Se connecter'}</button>{loginMessage&&<p className="admin-login-message">{loginMessage}</p>}</form></section></>
 return <><PageHero eyebrow="Espace privé" title="Administration" text="Modifiez le contenu du site depuis votre téléphone."/><section className="section"><div className="container admin-panel">
  <div className="admin-topbar"><strong>Session administrateur ouverte</strong><button type="button" className="button secondary" onClick={logout}>Se déconnecter</button></div>
  <label>Mot de passe de publication<input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>

  <nav className="admin-section-nav" aria-label="Navigation dans l’administration">
   <button type="button" onClick={()=>goToSection('admin-service')}>Mode Service</button>
   <button type="button" onClick={()=>goToSection('admin-club')}>Fidélité / Club</button>
   <button type="button" onClick={()=>goToSection('admin-communication')}>Communication</button>
   <button type="button" onClick={()=>goToSection('admin-promotions')}>Promotions</button>
   <button type="button" onClick={()=>goToSection('admin-general')}>Informations</button>
   <button type="button" onClick={()=>goToSection('admin-notifications')}>Notifications</button>
   <button type="button" onClick={()=>goToSection('admin-pages')}>Textes</button>
   <button type="button" onClick={()=>goToSection('admin-home-photo')}>Accueil</button>
   <button type="button" onClick={()=>goToSection('admin-daily')}>Menu du jour</button>
   <button type="button" onClick={()=>goToSection('admin-story')}>Histoire</button>
   <button type="button" onClick={()=>goToSection('admin-privatization')}>Privatisation</button>
   <button type="button" onClick={()=>goToSection('admin-events')}>Événements</button>
   <button type="button" onClick={()=>goToSection('admin-menu')}>Carte</button>
   <button type="button" onClick={()=>goToSection('admin-reviews')}>Avis / Réseaux</button>
   <button type="button" onClick={()=>goToSection('admin-gallery')}>Galerie</button>
  </nav>

  <AdminInstallButton/><div id="admin-service" className="admin-anchor-section"><ServiceModePanel password={password}/></div>
  <div id="admin-club" className="admin-anchor-section"><section className="club-content-admin"><span className="club-badge">EXPÉRIENCE CLIENT</span><h2>Textes du Club LBDC</h2><p className="admin-help">Ces textes sont publiés avec le reste du site lorsque vous utilisez le bouton « Publier les modifications ».</p><label>Texte de présentation{ textArea(content.club.presentation,v=>setContent(c=>({...c,club:{...c.club,presentation:v}}))) }</label><label>Explications du programme{ textArea(content.club.programExplanation,v=>setContent(c=>({...c,club:{...c.club,programExplanation:v}}))) }</label><label>Conditions{ textArea(content.club.conditions,v=>setContent(c=>({...c,club:{...c.club,conditions:v}}))) }</label><fieldset><legend>Récompenses affichées</legend>{content.club.rewards.map((reward,index)=><div className="admin-item" key={index}><label>Récompense {index+1}<input value={reward} onChange={e=>setContent(c=>({...c,club:{...c.club,rewards:c.club.rewards.map((item,i)=>i===index?e.target.value:item)}}))}/></label><button type="button" className="danger-link" onClick={()=>setContent(c=>({...c,club:{...c.club,rewards:c.club.rewards.filter((_,i)=>i!==index)}}))}>Supprimer</button></div>)}<button type="button" className="button secondary" onClick={()=>setContent(c=>({...c,club:{...c.club,rewards:[...c.club.rewards,'Nouvelle récompense']}}))}>Ajouter une récompense</button></fieldset><fieldset><legend>Textes visibles dans l’espace membre</legend><label>Titre des avantages disponibles<input value={content.club.availableTitle} onChange={e=>setContent(c=>({...c,club:{...c.club,availableTitle:e.target.value}}))}/></label><label>Titre de l’historique<input value={content.club.historyTitle} onChange={e=>setContent(c=>({...c,club:{...c.club,historyTitle:e.target.value}}))}/></label><label>Titre du bilan<input value={content.club.summaryTitle} onChange={e=>setContent(c=>({...c,club:{...c.club,summaryTitle:e.target.value}}))}/></label><label>Message d’économies <small>Utilisez {'{amount}'} pour afficher le montant.</small><input value={content.club.savingsMessage} onChange={e=>setContent(c=>({...c,club:{...c.club,savingsMessage:e.target.value}}))}/></label></fieldset></section><AdminClubPanel password={password}/></div>
  <div id="admin-communication" className="admin-anchor-section"><AdminCommunicationPanel password={password}/></div>
  <div id="admin-promotions" className="admin-anchor-section"><AdminPromotionsPanel password={password}/></div>

  <h2 id="admin-general" className="admin-anchor-section">Informations générales</h2>
  <label>Téléphone affiché<input value={content.general.phone} onChange={e=>setContent(c=>({...c,general:{...c.general,phone:e.target.value}}))}/></label>
  <label>Téléphone pour le bouton d’appel<input value={content.general.phoneHref} onChange={e=>setContent(c=>({...c,general:{...c.general,phoneHref:e.target.value}}))}/></label>
  <label>Email<input value={content.general.email} onChange={e=>setContent(c=>({...c,general:{...c.general,email:e.target.value}}))}/></label>
  <label>Adresse{ textArea(content.general.address,v=>setContent(c=>({...c,general:{...c.general,address:v}}))) }</label>
  <label>Horaires{ textArea(content.general.hours,v=>setContent(c=>({...c,general:{...c.general,hours:v}}))) }</label>
  <label className="checkbox-label"><input type="checkbox" checked={content.general.closureEnabled} onChange={e=>setContent(c=>({...c,general:{...c.general,closureEnabled:e.target.checked}}))}/> Afficher un bandeau fermeture / vacances</label>
  <label>Message fermeture ou vacances<input value={content.general.closureMessage} onChange={e=>setContent(c=>({...c,general:{...c.general,closureMessage:e.target.value}}))}/></label>
  <h2>Statistiques de visite</h2><p className="admin-help">Les statistiques s’ouvrent dans ton tableau de bord privé Vercel.</p><label>Lien Vercel Analytics<input value={content.general.analyticsUrl} onChange={e=>setContent(c=>({...c,general:{...c.general,analyticsUrl:e.target.value}}))}/></label><a className="button" href={content.general.analyticsUrl||'https://vercel.com/dashboard'} target="_blank" rel="noreferrer">Voir les statistiques</a>

  <h2 id="admin-notifications" className="admin-anchor-section">Application mobile et notifications</h2>
  <p className="admin-help">Les clients peuvent installer le site depuis la page Application et s’abonner sans créer de compte.</p>
  <div className="notification-admin-card">
    <div className="notification-count"><strong>{subscriberCount===null?'Abonnés non comptés':`${subscriberCount} abonné${subscriberCount>1?'s':''}`}</strong><button type="button" className="button secondary compact" onClick={refreshSubscriberCount}>Actualiser</button></div>
    <label>Titre de la notification<input value={notificationTitle} onChange={e=>setNotificationTitle(e.target.value)}/></label>
    <label>Message<textarea value={notificationBody} onChange={e=>setNotificationBody(e.target.value)}/></label>
    <label>Page à ouvrir<select value={notificationUrl} onChange={e=>setNotificationUrl(e.target.value)}><option value="/aujourdhui">Menu du jour</option><option value="/evenements">Événements</option><option value="/carte">La carte</option><option value="/">Accueil</option></select></label>
    <div className="actions"><button type="button" className="button secondary" onClick={sendNotification} disabled={busy||!notificationTitle||!notificationBody}>Envoyer seulement la notification</button><a className="text-link" href="/application" target="_blank">Voir la page Application</a></div>
    {notificationMessage&&<p className="admin-login-message">{notificationMessage}</p>}
  </div>

  <h2 id="admin-pages" className="admin-anchor-section">Textes des pages</h2>
  <label>Slogan de l’accueil{ textArea(content.pageTexts.homeSlogan,v=>setContent(c=>({...c,pageTexts:{...c.pageTexts,homeSlogan:v}}))) }</label>
  <label>Introduction Aujourd’hui<input value={content.pageTexts.todayIntro} onChange={e=>setContent(c=>({...c,pageTexts:{...c.pageTexts,todayIntro:e.target.value}}))}/></label>
  <label>Introduction Carte<input value={content.pageTexts.menuIntro} onChange={e=>setContent(c=>({...c,pageTexts:{...c.pageTexts,menuIntro:e.target.value}}))}/></label>
  <label>Introduction Galerie<input value={content.pageTexts.galleryIntro} onChange={e=>setContent(c=>({...c,pageTexts:{...c.pageTexts,galleryIntro:e.target.value}}))}/></label>
  <label>Introduction Contact<input value={content.pageTexts.contactIntro} onChange={e=>setContent(c=>({...c,pageTexts:{...c.pageTexts,contactIntro:e.target.value}}))}/></label>
  <label>Introduction Événements<input value={content.pageTexts.eventsIntro} onChange={e=>setContent(c=>({...c,pageTexts:{...c.pageTexts,eventsIntro:e.target.value}}))}/></label>
  <label>Introduction Avis & réseaux<input value={content.pageTexts.reviewsIntro} onChange={e=>setContent(c=>({...c,pageTexts:{...c.pageTexts,reviewsIntro:e.target.value}}))}/></label>

  <h2 id="admin-home-photo" className="admin-anchor-section">Photo principale de l’accueil</h2><div className="hero-photo-admin"><img src={content.heroImage} alt="Photo principale actuelle"/><label className="upload-box compact-upload">Remplacer la photo principale<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)runUpload(f,src=>setContent(c=>({...c,heroImage:src})),'Photo d’accueil remplacée.')}}/></label></div>

  <h2 id="admin-daily" className="admin-anchor-section">Menu du jour</h2>
  <label>Libellé de date<input value={content.daily.dateLabel} onChange={e=>setContent(c=>({...c,daily:{...c.daily,dateLabel:e.target.value}}))}/></label>
  <fieldset><legend>Prix des formules</legend>{content.daily.formulas.map((f,i)=><div className="admin-item" key={i}><label>Nom<input value={f.name} onChange={e=>setContent(c=>({...c,daily:{...c.daily,formulas:c.daily.formulas.map((x,n)=>n===i?{...x,name:e.target.value}:x)}}))}/></label><label>Description<input value={f.description||''} onChange={e=>setContent(c=>({...c,daily:{...c.daily,formulas:c.daily.formulas.map((x,n)=>n===i?{...x,description:e.target.value}:x)}}))}/></label><label>Prix sur place<input value={f.price} onChange={e=>setContent(c=>({...c,daily:{...c.daily,formulas:c.daily.formulas.map((x,n)=>n===i?{...x,price:e.target.value}:x)}}))}/></label><label>Prix à emporter<input value={f.takeawayPrice||''} onChange={e=>setContent(c=>({...c,daily:{...c.daily,formulas:c.daily.formulas.map((x,n)=>n===i?{...x,takeawayPrice:e.target.value}:x)}}))}/></label><button className="danger-link" onClick={()=>setContent(c=>({...c,daily:{...c.daily,formulas:c.daily.formulas.filter((_,n)=>n!==i)}}))}>Supprimer cette formule</button></div>)}<button className="button secondary" onClick={()=>setContent(c=>({...c,daily:{...c.daily,formulas:[...c.daily.formulas,{...blankFormula}]}}))}>Ajouter une formule</button></fieldset>
  <fieldset><legend>Titres des blocs du menu</legend><label>Titre des entrées<input value={content.daily.startersTitle} onChange={e=>setContent(c=>({...c,daily:{...c.daily,startersTitle:e.target.value}}))}/></label><label>Titre des plats<input value={content.daily.mainsTitle} onChange={e=>setContent(c=>({...c,daily:{...c.daily,mainsTitle:e.target.value}}))}/></label><label>Titre des desserts<input value={content.daily.dessertsTitle} onChange={e=>setContent(c=>({...c,daily:{...c.daily,dessertsTitle:e.target.value}}))}/></label></fieldset>
  {(['starters','mains','desserts'] as const).map(group=><fieldset key={group}><legend>{group==='starters'?'Entrées':group==='mains'?'Plats':'Desserts'}</legend>{content.daily[group].map((item,i)=><div className="daily-admin-row" key={i}><label>Choix {i+1}<input value={item.name} onChange={e=>updateDaily(group,i,e.target.value)}/></label><button className="danger-link" onClick={()=>setContent(c=>({...c,daily:{...c.daily,[group]:c.daily[group].filter((_,n)=>n!==i)}}))}>Supprimer ce choix</button></div>)}<button className="button secondary" onClick={()=>setContent(c=>({...c,daily:{...c.daily,[group]:[...c.daily[group],{...blankItem}]}}))}>Ajouter un choix</button></fieldset>)}
  <fieldset><legend>Suggestion du chef</legend><label>Texte du supplément<input value={content.daily.suggestionSupplementText} onChange={e=>setContent(c=>({...c,daily:{...c.daily,suggestionSupplementText:e.target.value}}))}/></label><label>Nom<input value={content.daily.suggestion.name} onChange={e=>setContent(c=>({...c,daily:{...c.daily,suggestion:{...c.daily.suggestion,name:e.target.value}}}))}/></label><label>Description<input value={content.daily.suggestion.description||''} onChange={e=>setContent(c=>({...c,daily:{...c.daily,suggestion:{...c.daily.suggestion,description:e.target.value}}}))}/></label><label>Supplément<input value={content.daily.suggestion.price||''} onChange={e=>setContent(c=>({...c,daily:{...c.daily,suggestion:{...c.daily.suggestion,price:e.target.value}}}))}/></label></fieldset>

  <h2 id="admin-story" className="admin-anchor-section">Notre histoire</h2>
  <label>Petit titre<input value={content.story.eyebrow} onChange={e=>setContent(c=>({...c,story:{...c.story,eyebrow:e.target.value}}))}/></label><label>Titre<input value={content.story.title} onChange={e=>setContent(c=>({...c,story:{...c.story,title:e.target.value}}))}/></label><label>Introduction{ textArea(content.story.intro,v=>setContent(c=>({...c,story:{...c.story,intro:v}}))) }</label>
  {content.story.paragraphs.map((p,i)=><div className="admin-item" key={i}><label>Paragraphe {i+1}{textArea(p,v=>setContent(c=>({...c,story:{...c.story,paragraphs:c.story.paragraphs.map((x,n)=>n===i?v:x)}})))}</label><button className="danger-link" onClick={()=>setContent(c=>({...c,story:{...c.story,paragraphs:c.story.paragraphs.filter((_,n)=>n!==i)}}))}>Supprimer ce paragraphe</button></div>)}<button className="button secondary" onClick={()=>setContent(c=>({...c,story:{...c.story,paragraphs:[...c.story.paragraphs,'Nouveau paragraphe']}}))}>Ajouter un paragraphe</button>
  <label>Citation{ textArea(content.story.quote,v=>setContent(c=>({...c,story:{...c.story,quote:v}}))) }</label><div className="hero-photo-admin"><img src={content.story.image} alt={content.story.imageAlt}/><label className="upload-box compact-upload">Remplacer la photo de l’histoire<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)runUpload(f,src=>setContent(c=>({...c,story:{...c.story,image:src}})),'Photo de l’histoire remplacée.')}}/></label><label>Texte alternatif<input value={content.story.imageAlt} onChange={e=>setContent(c=>({...c,story:{...c.story,imageAlt:e.target.value}}))}/></label></div>

  <h2 id="admin-privatization" className="admin-anchor-section">Privatisation</h2>
  <label>Titre<input value={content.privatization.title} onChange={e=>setContent(c=>({...c,privatization:{...c.privatization,title:e.target.value}}))}/></label><label>Introduction<input value={content.privatization.intro} onChange={e=>setContent(c=>({...c,privatization:{...c.privatization,intro:e.target.value}}))}/></label><label>Texte{ textArea(content.privatization.text,v=>setContent(c=>({...c,privatization:{...c.privatization,text:v}}))) }</label>
  <label className="upload-box">Ajouter une photo de privatisation<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)runUpload(f,src=>setContent(c=>({...c,privatization:{...c.privatization,photos:[...c.privatization.photos,{...blankPhoto,src}]}})),'Photo ajoutée.')}}/></label>
  <div className="admin-gallery">{content.privatization.photos.map((p,i)=><div className="admin-photo" key={i}><img src={p.src} alt={p.alt}/><label>Légende<input value={p.label} onChange={e=>setContent(c=>({...c,privatization:{...c.privatization,photos:c.privatization.photos.map((x,n)=>n===i?{...x,label:e.target.value}:x)}}))}/></label><button className="danger-link" onClick={()=>setContent(c=>({...c,privatization:{...c.privatization,photos:c.privatization.photos.filter((_,n)=>n!==i)}}))}>Supprimer</button></div>)}</div>

  <h2 id="admin-events" className="admin-anchor-section">Événements</h2>
  {content.events.map((ev,i)=><fieldset key={i}><legend>Événement {i+1}</legend><label>Titre<input value={ev.title} onChange={e=>setContent(c=>({...c,events:c.events.map((x,n)=>n===i?{...x,title:e.target.value}:x)}))}/></label><label>Date / horaire<input value={ev.date} onChange={e=>setContent(c=>({...c,events:c.events.map((x,n)=>n===i?{...x,date:e.target.value}:x)}))}/></label><label>Description{ textArea(ev.description,v=>setContent(c=>({...c,events:c.events.map((x,n)=>n===i?{...x,description:v}:x)}))) }</label><label>Prix<input value={ev.price||''} onChange={e=>setContent(c=>({...c,events:c.events.map((x,n)=>n===i?{...x,price:e.target.value}:x)}))}/></label>{ev.image&&<img className="admin-event-image" src={ev.image} alt={ev.imageAlt||ev.title}/>}<label className="upload-box compact-upload">{ev.image?'Remplacer la photo':'Ajouter une photo'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)runUpload(f,src=>setContent(c=>({...c,events:c.events.map((x,n)=>n===i?{...x,image:src,imageAlt:x.imageAlt||x.title}:x)})),'Photo de l’événement ajoutée.')}}/></label><button className="danger-link" onClick={()=>setContent(c=>({...c,events:c.events.filter((_,n)=>n!==i)}))}>Supprimer cet événement</button></fieldset>)}<button className="button secondary" onClick={()=>setContent(c=>({...c,events:[...c.events,{...blankEvent}]}))}>Ajouter un événement</button>

  <h2 id="admin-menu" className="admin-anchor-section">La carte</h2>
  <p className="admin-help">L’ordre affiché ici est aussi celui du bandeau de la page Carte. Utilise les boutons Monter et Descendre, puis publie les modifications.</p>
  {content.menu.map((section,si)=><fieldset key={si} className="reorder-fieldset">
    <legend>Catégorie {si+1}</legend>
    <div className="reorder-toolbar" aria-label={`Organisation de la catégorie ${section.category}`}>
      <strong>{section.category || `Catégorie ${si+1}`}</strong>
      <div className="reorder-actions">
        <button type="button" className="order-button" disabled={si===0} onClick={()=>moveCategory(si,-1)}>▲ Monter</button>
        <button type="button" className="order-button" disabled={si===content.menu.length-1} onClick={()=>moveCategory(si,1)}>▼ Descendre</button>
      </div>
    </div>
    <label>Nom de la catégorie<input value={section.category} onChange={e=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,category:e.target.value}:s)}))}/></label>
    {section.items.map((item,ii)=><div className="admin-item product-reorder-item" key={ii}>
      <div className="reorder-toolbar compact">
        <strong>{item.name || `Produit ${ii+1}`}</strong>
        <div className="reorder-actions">
          <button type="button" className="order-button" disabled={ii===0} onClick={()=>moveProduct(si,ii,-1)}>▲ Monter</button>
          <button type="button" className="order-button" disabled={ii===section.items.length-1} onClick={()=>moveProduct(si,ii,1)}>▼ Descendre</button>
        </div>
      </div>
      <label>Produit<input value={item.name} onChange={e=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,items:s.items.map((x,m)=>m===ii?{...x,name:e.target.value}:x)}:s)}))}/></label>
      <label>Description<input value={item.description||''} onChange={e=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,items:s.items.map((x,m)=>m===ii?{...x,description:e.target.value}:x)}:s)}))}/></label>
      <label>Prix<input value={item.price||''} onChange={e=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,items:s.items.map((x,m)=>m===ii?{...x,price:e.target.value}:x)}:s)}))}/></label>
      <ProductPhotoPicker password={password} image={item.image} productName={item.name} busy={busy} onSelect={source=>runUpload(source,src=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,items:s.items.map((x,m)=>m===ii?{...x,image:src,imageAlt:x.imageAlt||x.name}:x)}:s)})),'Photo du produit ajoutée.')} onRemove={()=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,items:s.items.map((x,m)=>m===ii?{...x,image:'',imageAlt:''}:x)}:s)}))}/>
      <button type="button" className="danger-link" onClick={()=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,items:s.items.filter((_,m)=>m!==ii)}:s)}))}>Supprimer ce produit</button>
    </div>)}
    <div className="category-actions">
      <button type="button" className="button secondary" onClick={()=>setContent(c=>({...c,menu:c.menu.map((s,n)=>n===si?{...s,items:[...s.items,{...blankItem}]}:s)}))}>Ajouter un produit</button>
      <button type="button" className="danger-link" onClick={()=>setContent(c=>({...c,menu:c.menu.filter((_,n)=>n!==si)}))}>Supprimer la catégorie</button>
    </div>
  </fieldset>)}
  <button type="button" className="button secondary" onClick={()=>setContent(c=>({...c,menu:[...c.menu,{category:'Nouvelle catégorie',items:[{...blankItem}]}]}))}>Ajouter une catégorie</button>

  <h2 id="admin-reviews" className="admin-anchor-section">Avis Google et réseaux sociaux</h2>
  <label>Titre de la page<input value={content.reviews.title} onChange={e=>setContent(c=>({...c,reviews:{...c.reviews,title:e.target.value}}))}/></label>
  <label>Texte de présentation{ textArea(content.reviews.intro,v=>setContent(c=>({...c,reviews:{...c.reviews,intro:v}}))) }</label>
  <label>Lien pour consulter les avis Google<input value={content.reviews.googleReviewsUrl} onChange={e=>setContent(c=>({...c,reviews:{...c.reviews,googleReviewsUrl:e.target.value}}))} placeholder="https://..."/></label>
  <label>Lien pour laisser un avis Google<input value={content.reviews.googleReviewWriteUrl} onChange={e=>setContent(c=>({...c,reviews:{...c.reviews,googleReviewWriteUrl:e.target.value}}))} placeholder="https://..."/></label>
  <p className="admin-help">Ajoute ici Facebook, TikTok, Instagram ou tout autre compte. Les liens vides ne seront pas affichés aux visiteurs.</p>
  {content.socials.map((link,i)=><div className="admin-item" key={i}><label>Nom du réseau<input value={link.label} onChange={e=>setContent(c=>({...c,socials:c.socials.map((x,n)=>n===i?{...x,label:e.target.value}:x)}))}/></label><label>Lien du compte<input value={link.url} onChange={e=>setContent(c=>({...c,socials:c.socials.map((x,n)=>n===i?{...x,url:e.target.value}:x)}))} placeholder="https://..."/></label><button className="danger-link" onClick={()=>setContent(c=>({...c,socials:c.socials.filter((_,n)=>n!==i)}))}>Supprimer ce lien</button></div>)}
  <button className="button secondary" onClick={()=>setContent(c=>({...c,socials:[...c.socials,{...blankSocial}]}))}>Ajouter un réseau social</button>

  <h2 id="admin-gallery" className="admin-anchor-section">Galerie</h2><label className="upload-box">Ajouter une photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{const f=e.target.files?.[0];if(f)runUpload(f,src=>setContent(c=>({...c,gallery:[...c.gallery,{...blankPhoto,src}]})),'Photo ajoutée à la galerie.')}}/></label><div className="admin-gallery">{content.gallery.map((p,i)=><div className="admin-photo" key={i}><img src={p.src} alt={p.alt}/><label>Légende<input value={p.label} onChange={e=>setContent(c=>({...c,gallery:c.gallery.map((x,n)=>n===i?{...x,label:e.target.value}:x)}))}/></label><button className="danger-link" onClick={()=>setContent(c=>({...c,gallery:c.gallery.filter((_,n)=>n!==i)}))}>Supprimer</button></div>)}</div>

  <div className="actions sticky-actions"><button className="button" onClick={save} disabled={busy||!password}>{busy?'Veuillez patienter…':'Publier sans notification'}</button><button className="button secondary" onClick={publishAndNotify} disabled={busy||!password||!notificationTitle||!notificationBody}>Publier et notifier les clients</button></div>{message&&<p className="success" aria-live="polite">{message}</p>}
 </div></section></>
}
