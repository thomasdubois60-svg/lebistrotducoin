'use client'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
export default function HistoirePage(){ const {story}=useSiteContent(); return <><PageHero eyebrow={story.eyebrow} title={story.title} text={story.intro}/><section className="section story-section"><div className="container story-grid"><div className="story-copy"><span className="eyebrow">Deux parcours, une même envie</span><h2>Une belle aventure humaine</h2>{story.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<blockquote>« {story.quote} »</blockquote></div><figure className="story-photo"><img src={story.image} alt={story.imageAlt}/></figure></div></section></> }
