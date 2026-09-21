'use client'
import {useLanguage} from '@/components/language-provider'
import Link from 'next/link'
import {LanguageSelector} from './language-selector'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSiteContent } from './content-provider'

const links = [['/','Accueil'],['/aujourdhui','Aujourd’hui'],['/carte','Carte'],['/histoire','Notre histoire'],['/privatisation','Privatisation'],['/evenements','Événements'],['/avis','Avis & réseaux'],['/club','Club LBDC'],['/galerie','Galerie'],['/contact','Contact']]
export function Header(){
 const {t,locale}=useLanguage();

 const pathname=usePathname(); const [open,setOpen]=useState(false); const [now,setNow]=useState(()=>Date.now()); const {general}=useSiteContent()
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[])
 const start=general.closureStart?new Date(general.closureStart).getTime():null
 const end=general.closureEnd?new Date(general.closureEnd).getTime():null
 const showClosure=general.closureEnabled&&Boolean(general.closureMessage)&&(start===null||Number.isNaN(start)||now>=start)&&(end===null||Number.isNaN(end)||now<=end)
 return <><header className="site-header"><div className="container nav-wrap"><Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark">LBDC</span><span><strong>Le Bistrot</strong><small>Du Coin</small></span></Link><LanguageSelector/><button className="menu-button" aria-label={t(open?"Fermer le menu":"Ouvrir le menu")} aria-expanded={open} aria-controls="public-navigation" onClick={()=>setOpen(!open)}>☰</button><nav id="public-navigation" className={open?'nav open':'nav'}>{links.map(([href,label])=><Link key={href} href={href} className={pathname===href?'active':''} onClick={()=>setOpen(false)}>{t(label)}</Link>)}<a className="button compact" href={`tel:${general.phoneHref}`}>{t("Réserver")}</a></nav></div></header>{showClosure&&<div className="closure-banner">{general.closureMessage}</div>}</>
}
