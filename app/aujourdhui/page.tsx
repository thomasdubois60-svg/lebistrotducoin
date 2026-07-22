'use client'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'

export default function TodayPage() {
  const { daily } = useSiteContent()
  const Block = ({ title, items }: { title: string; items: {name:string; description?:string; price?:string}[] }) => <div className="menu-block"><h2>{title}</h2>{items.map((item,i)=><div className="menu-row" key={i}><div><strong>{item.name}</strong>{item.description&&<small>{item.description}</small>}</div>{item.price&&<span>{item.price}</span>}</div>)}</div>
  return <><PageHero eyebrow={daily.dateLabel} title="Aujourd’hui au Bistrot" text="Une formule qui change au fil des envies du chef et des produits disponibles."/><section className="section"><div className="container daily-grid"><Block title="3 entrées au choix" items={daily.starters}/><Block title="3 plats au choix" items={daily.mains}/><div className="suggestion"><span>Suggestion</span><h2>{daily.suggestion.name}</h2><p>{daily.suggestion.description}</p><b>{daily.suggestion.price}</b></div><Block title="3 desserts au choix" items={daily.desserts}/></div><p className="note">Menu communiqué à titre indicatif. Pour connaître le menu exact du jour, appelez le 02 54 44 36 70.</p></section></>
}
