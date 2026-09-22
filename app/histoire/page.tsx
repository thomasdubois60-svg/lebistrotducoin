'use client'
import {useLanguage} from '@/components/language-provider'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
export default function HistoirePage(){
 const {t,locale}=useLanguage();
 const {story,sectionPhotos}=useSiteContent();const portrait=sectionPhotos?.story?.image||story.image
 return <div className="story-editorial"><header className="container story-opening"><div><span className="eyebrow">{story.eyebrow}</span><h1>{story.title}</h1><p className="lead">{story.intro}</p><span className="editorial-signature">Ismaël & Thomas</span></div>{portrait&&<figure><img src={portrait} alt={sectionPhotos?.story?.alt||story.imageAlt}/></figure>}</header><section className="container story-chapters" aria-label={t("Notre histoire")}>{story.paragraphs.map((paragraph,index)=><article className="story-chapter" key={index}><span className="chapter-number" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><p>{paragraph}</p>{index===1&&story.image&&<figure><img src={story.image} alt={story.imageAlt} loading="lazy"/></figure>}</article>)}</section><section className="story-quote"><div className="container"><span aria-hidden="true">“</span><blockquote>{story.quote}</blockquote><p>Le Bistrot Du Coin</p></div></section></div>
}
