'use client'
import { useEffect } from 'react'
import styles from './daily.module.css'
import { MenuItem } from '@/lib/default-content'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
export default function TodayPage(){
 const {daily,pageTexts,general}=useSiteContent()
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') window.dispatchEvent(new Event('bistrot-content-updated'))
    }
    refresh()
    window.addEventListener('focus', refresh)
    window.addEventListener('pageshow', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('pageshow', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

 const Block=({title,items}:{title:string;items:MenuItem[]})=><div className="menu-block"><h2>{title}</h2>{items.map((item,i)=><div className={`menu-row ${item.image?styles.withImage:''}`} key={i}>{item.image&&<img className={styles.image} src={item.image} alt={item.imageAlt||''} loading="lazy"/>}<div className={item.image?styles.text:undefined}><strong>{item.name}</strong>{item.description&&<small>{item.description}</small>}</div>{item.price&&<span>{item.price}</span>}</div>)}</div>
 return <><PageHero eyebrow={daily.dateLabel} title="Aujourd’hui au Bistrot" text={pageTexts.todayIntro}/><section className="section"><div className="container"><div className="formula-panel"><h2>Nos formules</h2>{daily.formulas.map((f,i)=><div className="formula-row" key={i}><div className="menu-row"><div><strong>{f.name}</strong>{f.description&&<small>{f.description}</small>}{f.takeawayPrice&&<small className="takeaway-price">À emporter : {f.takeawayPrice}</small>}</div><span>{f.price}</span></div></div>)}</div><div className="daily-grid"><Block title={daily.startersTitle} items={daily.starters}/><Block title={daily.mainsTitle} items={daily.mains}/><div className="suggestion"><span>Suggestion du chef</span><h2>{daily.suggestion.name}</h2><p>{daily.suggestion.description}</p>{daily.suggestion.price&&<p>{daily.suggestion.price}</p>}<b>{daily.suggestionSupplementText}</b></div><Block title={daily.dessertsTitle} items={daily.desserts}/></div><p className="note">Pour connaître le menu exact du jour, appelez le {general.phone}.</p></div></section></>
}
