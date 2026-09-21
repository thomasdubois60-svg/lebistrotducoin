'use client'
import {useLanguage} from '@/components/language-provider'
import Link from 'next/link'
import styles from './home.module.css'
import SectionPhoto from '@/components/SectionPhoto'
import { useSiteContent } from '@/components/content-provider'
import { EventBanner } from '@/components/event-banner'

export default function Home(){
 const {t,locale}=useLanguage();

 const {heroImage,heroImageAlt,general,pageTexts}=useSiteContent()
 return <><EventBanner/><section className="hero hero-photo"><SectionPhoto home photo={{image:heroImage,alt:heroImageAlt}}/><div className="hero-overlay" style={{background:"linear-gradient(90deg,rgba(13,10,9,.9),rgba(30,15,12,.25))"}}/><div className="container hero-content"><span className="eyebrow light">{t("Bienvenue à Saint-Laurent-Nouan")}</span><h1>Le Bistrot<br/><em>Du Coin</em></h1><p>« {pageTexts.homeSlogan} »</p><div className="actions"><Link className={`button ${styles.button}`} href="/aujourdhui">{t("Voir le menu du jour")}</Link><Link className={`button ghost ${styles.button}`} href="/carte">{t("La carte")}</Link><a className={`button ghost ${styles.button}`} href={`tel:${general.phoneHref}`}>{general.phone}</a></div></div></section><section className="section"><div className="container intro-grid"><div><span className="eyebrow">{t("L’esprit bistrot")}</span><h2>{t("Simple, généreux et convivial")}</h2><p className="lead">{t("Une cuisine de saison, des produits choisis avec soin et une équipe heureuse de vous accueillir.")}</p><div className="home-links"><Link href="/carte" className="text-link">{t("Découvrir la carte →")}</Link><Link href="/histoire" className="text-link">{t("Lire notre histoire →")}</Link><Link href="/privatisation" className="text-link">{t("Privatiser le restaurant →")}</Link></div></div><div className="wood-card"><strong>{t("Horaires")}</strong><span className="preline">{general.hours}</span><hr/><strong>{t("Adresse")}</strong><a className="preline text-link" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(general.address)}`} target="_blank" rel="noopener noreferrer" aria-label={`${t("Itinéraire vers")} ${general.address}`}>{general.address} ↗</a></div></div></section><section className="section centered"><div className="container narrow"><span className="eyebrow">{t("Une table pour aujourd’hui ?")}</span><h2>{t("Appelez-nous, on s’occupe du reste.")}</h2><a className={`button ${styles.button}`} href={`tel:${general.phoneHref}`}>{t("Réserver par téléphone")}</a></div></section></>
}
