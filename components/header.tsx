'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSiteContent } from './content-provider'

const links = [['/','Accueil'],['/aujourdhui','Aujourd’hui'],['/carte','Carte'],['/histoire','Notre histoire'],['/privatisation','Privatisation'],['/evenements','Événements'],['/avis','Avis & réseaux'],['/club','Club LBDC'],['/galerie','Galerie'],['/contact','Contact']]
export function Header(){
 const pathname=usePathname(); const [open,setOpen]=useState(false); const [now,setNow]=useState(()=>Date.now()); const {general}=useSiteContent()
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(timer)},[])
 const start=general.closureStart?new Date(general.closureStart).getTime():null
 const end=general.closureEnd?new Date(general.closureEnd).getTime():null
 const showClosure=general.closureEnabled&&Boolean(general.closureMessage)&&(start===null||Number.isNaN(start)||now>=start)&&(end===null||Number.isNaN(end)||now<=end)
 const reopeningStart=general.reopeningBannerStart?new Date(general.reopeningBannerStart).getTime():null
 const reopeningEnd=general.reopeningBannerEnd?new Date(general.reopeningBannerEnd).getTime():null
 const showReopening=!showClosure&&general.reopeningBannerEnabled&&Boolean(general.reopeningBannerMessage)&&reopeningStart!==null&&!Number.isNaN(reopeningStart)&&reopeningEnd!==null&&!Number.isNaN(reopeningEnd)&&now>=reopeningStart&&now<=reopeningEnd
 return <><header className="site-header"><div className="container nav-wrap"><Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark">LBDC</span><span><strong>Le Bistrot</strong><small>Du Coin</small></span></Link><button className="menu-button" aria-label="Ouvrir le menu" onClick={()=>setOpen(!open)}>☰</button><nav className={open?'nav open':'nav'}>{links.map(([href,label])=><Link key={href} href={href} className={pathname===href?'active':''} onClick={()=>setOpen(false)}>{label}</Link>)}<a className="button compact" href={`tel:${general.phoneHref}`}>Réserver</a></nav></div></header>{showClosure?<div className="closure-banner">{general.closureMessage}</div>:showReopening?<div className="reopening-banner">{general.reopeningBannerMessage}</div>:null}</>
}
