'use client'
import {useLanguage} from '@/components/language-provider'
import {SectionBanner} from '@/components/section-banner'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
export default function PrivatizationPage(){
 const {t,locale}=useLanguage();

 const {privatization,general}=useSiteContent()
 const photos=privatization.photos.filter(photo=>typeof photo?.src==='string'&&photo.src.trim())
 return <div className="private-editorial"><PageHero eyebrow={t('Sur devis')} title={privatization.title} text={privatization.intro}/><section className="section"><div className="container private-introduction"><div><span className="eyebrow">{t('Votre occasion, notre maison')}</span><h2>{t('Les beaux moments se partagent')}</h2></div><p className="lead">{privatization.text}</p></div><div className="container private-occasions">{['Repas de famille','Anniversaire','Réception professionnelle','Soirée privée'].map((label,index)=><div key={label}><span aria-hidden="true">{['♡','✦','◇','☾'][index]}</span><h3>{t(label)}</h3></div>)}</div>{photos.length>0&&<div className="container private-photo-story privatization-gallery">{photos.map((photo,index)=><figure key={index}><img src={photo.src} alt={photo.alt} loading="lazy"/>{photo.label&&<figcaption><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span>{photo.label}</figcaption>}</figure>)}</div>}</section><SectionBanner section="catering"/><section className="container private-contact"><div><span className="eyebrow">{t('Imaginons votre événement')}</span><h2>{t('Parlons de vos envies')}</h2></div><div className="actions"><a className="button" href={`tel:${general.phoneHref}`}>{t('Nous appeler')}</a><a className="button secondary" href={`mailto:${general.email}`}>{t('Demander un devis')}</a></div></section></div>
}
