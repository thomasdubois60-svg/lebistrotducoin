'use client'
import { useEffect, useState } from 'react'
import { defaultContent, MenuItem, SiteContent } from '@/lib/default-content'
import { PageHero } from '@/components/page-hero'

const blankItem: MenuItem = { name: '', description: '', price: '', image: '', imageAlt: '' }

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { fetch('/api/content', { cache: 'no-store' }).then(r => r.json()).then(setContent).catch(()=>{}) }, [])

  const updateDaily = (group:'starters'|'mains'|'desserts', index:number, value:string) => setContent(c => ({...c, daily:{...c.daily,[group]:c.daily[group].map((x,i)=>i===index?{...x,name:value}:x)}}))
  const updateMenu = (section:number, item:number, field:keyof MenuItem, value:string) => setContent(c => ({...c, menu:c.menu.map((s,si)=>si===section?{...s,items:s.items.map((x,ii)=>ii===item?{...x,[field]:value}:x)}:s)}))
  const updateCategory = (section:number, value:string) => setContent(c => ({...c, menu:c.menu.map((s,i)=>i===section?{...s,category:value}:s)}))
  const addItem = (section:number) => setContent(c => ({...c, menu:c.menu.map((s,i)=>i===section?{...s,items:[...s.items,{...blankItem}]}:s)}))
  const removeItem = (section:number,item:number) => setContent(c => ({...c, menu:c.menu.map((s,i)=>i===section?{...s,items:s.items.filter((_,ii)=>ii!==item)}:s)}))
  const addSection = () => setContent(c => ({...c,menu:[...c.menu,{category:'Nouvelle catégorie',items:[{...blankItem}]}]}))
  const removeSection = (section:number) => setContent(c => ({...c,menu:c.menu.filter((_,i)=>i!==section)}))
  const removePhoto = (index:number) => setContent(c => ({...c,gallery:c.gallery.filter((_,i)=>i!==index)}))

  const uploadFile = async (file:File) => {
    if (!password) throw new Error('Saisis d’abord le mot de passe administrateur.')
    const form = new FormData(); form.append('file', file)
    const response = await fetch('/api/upload',{method:'POST',headers:{'x-admin-password':password},body:form})
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Erreur lors de l’envoi.')
    return result.src as string
  }

  const uploadGalleryPhoto = async (file:File) => {
    setBusy(true); setMessage('Envoi de la photo…')
    try {
      const src = await uploadFile(file)
      setContent(c=>({...c,gallery:[...c.gallery,{src,alt:'Photo du Bistrot Du Coin',label:'Le Bistrot'}]}))
      setMessage('Photo ajoutée. Appuie maintenant sur « Publier les modifications ».')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Erreur lors de l’envoi.') }
    setBusy(false)
  }

  const uploadProductPhoto = async (section:number, item:number, file:File) => {
    setBusy(true); setMessage('Envoi de la photo du produit…')
    try {
      const src = await uploadFile(file)
      setContent(c=>({...c,menu:c.menu.map((s,si)=>si===section?{...s,items:s.items.map((x,ii)=>ii===item?{...x,image:src,imageAlt:x.imageAlt||x.name}:x)}:s)}))
      setMessage('Photo du produit ajoutée. Appuie maintenant sur « Publier les modifications ».')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Erreur lors de l’envoi.') }
    setBusy(false)
  }

  const save = async () => {
    setBusy(true); setMessage('Publication en cours…')
    const response = await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':password},body:JSON.stringify(content)})
    const result = await response.json()
    setMessage(response.ok ? 'Modifications enregistrées. Vercel les publiera automatiquement dans quelques instants.' : (result.error || 'Publication impossible.'))
    if(response.ok) window.dispatchEvent(new Event('bistrot-content-updated'))
    setBusy(false)
  }

  return <>
    <PageHero eyebrow="Espace privé" title="Administration" text="Modifiez le menu du jour, la carte et les photos depuis votre téléphone."/>
    <section className="section"><div className="container admin-panel">
      <div className="admin-warning"><strong>Accès privé.</strong> Saisissez le mot de passe configuré dans Vercel avant de publier.</div>
      <label>Mot de passe administrateur<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" /></label>

      <h2>Menu du jour</h2>
      <label>Libellé de date<input value={content.daily.dateLabel} onChange={e=>setContent(c=>({...c,daily:{...c.daily,dateLabel:e.target.value}}))}/></label>
      {(['starters','mains','desserts'] as const).map(group=><fieldset key={group}><legend>{group==='starters'?'Entrées':group==='mains'?'Plats':'Desserts'}</legend>{content.daily[group].map((item,i)=><label key={i}>Choix {i+1}<input value={item.name} onChange={e=>updateDaily(group,i,e.target.value)}/></label>)}</fieldset>)}
      <fieldset><legend>Suggestion (+4 €)</legend><label>Nom<input value={content.daily.suggestion.name} onChange={e=>setContent(c=>({...c,daily:{...c.daily,suggestion:{...c.daily.suggestion,name:e.target.value}}}))}/></label><label>Description<input value={content.daily.suggestion.description||''} onChange={e=>setContent(c=>({...c,daily:{...c.daily,suggestion:{...c.daily.suggestion,description:e.target.value}}}))}/></label><label>Supplément<input value={content.daily.suggestion.price||''} onChange={e=>setContent(c=>({...c,daily:{...c.daily,suggestion:{...c.daily.suggestion,price:e.target.value}}}))}/></label></fieldset>

      <h2>La carte</h2>
      {content.menu.map((section,si)=><fieldset key={si} className="admin-section"><legend>Catégorie {si+1}</legend><label>Nom de la catégorie<input value={section.category} onChange={e=>updateCategory(si,e.target.value)}/></label>{section.items.map((item,ii)=><div className="admin-item" key={ii}><label>Produit<input value={item.name} onChange={e=>updateMenu(si,ii,'name',e.target.value)}/></label><label>Description<input value={item.description||''} onChange={e=>updateMenu(si,ii,'description',e.target.value)}/></label><label>Prix<input value={item.price||''} onChange={e=>updateMenu(si,ii,'price',e.target.value)}/></label><div className="product-photo-admin">{item.image&&<img src={item.image} alt={item.imageAlt||item.name}/>}<label className="upload-box compact-upload">{item.image?'Remplacer la photo':'Ajouter une photo au produit'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)uploadProductPhoto(si,ii,f);e.currentTarget.value=''}}/></label>{item.image&&<><label>Texte alternatif de la photo<input value={item.imageAlt||''} onChange={e=>updateMenu(si,ii,'imageAlt',e.target.value)}/></label><button className="danger-link" type="button" onClick={()=>updateMenu(si,ii,'image','')}>Retirer la photo du produit</button></>}</div><button className="danger-link" type="button" onClick={()=>removeItem(si,ii)}>Supprimer ce produit</button></div>)}<div className="actions"><button className="button secondary" type="button" onClick={()=>addItem(si)}>Ajouter un produit</button><button className="danger-link" type="button" onClick={()=>removeSection(si)}>Supprimer la catégorie</button></div></fieldset>)}
      <button className="button secondary" type="button" onClick={addSection}>Ajouter une catégorie</button>

      <h2>Galerie photos</h2>
      <label className="upload-box">Ajouter une photo<input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)uploadGalleryPhoto(f);e.currentTarget.value=''}}/></label>
      <div className="admin-gallery">{content.gallery.map((photo,i)=><div className="admin-photo" key={`${photo.src}-${i}`}><img src={photo.src} alt={photo.alt}/><label>Légende<input value={photo.label} onChange={e=>setContent(c=>({...c,gallery:c.gallery.map((p,pi)=>pi===i?{...p,label:e.target.value}:p)}))}/></label><button className="danger-link" type="button" onClick={()=>removePhoto(i)}>Supprimer</button></div>)}</div>

      <div className="actions sticky-actions"><button className="button" onClick={save} disabled={busy||!password}>{busy?'Veuillez patienter…':'Publier les modifications'}</button></div>
      {message&&<p className="success" aria-live="polite">{message}</p>}
    </div></section>
  </>
}
