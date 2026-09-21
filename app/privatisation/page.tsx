'use client'
import {useLanguage} from '@/components/language-provider'
import {SectionBanner} from '@/components/section-banner'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
export default function PrivatizationPage(){
 const {t,locale}=useLanguage();

 const {privatization,general}=useSiteContent()
 const photos=privatization.photos.filter(photo=>typeof photo?.src==='string'&&photo.src.trim())
 return <><PageHero eyebrow={t("Sur devis")} title={privatization.title} text={privatization.intro}/><SectionBanner section="catering"/><section className="section"><div className="container narrow centered"><p className="lead">{privatization.text}</p><div className="actions" style={{justifyContent:'center'}}><a className="button" href={`tel:${general.phoneHref}`}>{t("Nous appeler")}</a><a className="button secondary" href={`mailto:${general.email}`}>{t("Nous écrire")}</a></div></div>{photos.length>0&&<div className="container gallery-grid privatization-gallery">{photos.map((photo,index)=><figure className="gallery-item" key={index}><img src={photo.src} alt={photo.alt}/>{photo.label&&<figcaption>{photo.label}</figcaption>}</figure>)}</div>}</section></>
}
