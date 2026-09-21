'use client'
import {useLanguage} from '@/components/language-provider'
import Link from 'next/link'
import { useSiteContent } from './content-provider'
export function Footer(){
 const {t,locale}=useLanguage();
 const {general,socials,reviews}=useSiteContent(); const activeSocials=socials.filter(link=>link.url.trim()); return <footer className="footer"><div className="container footer-grid"><div><h3>Le Bistrot Du Coin</h3><p className="preline"><a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(general.address)}`} target="_blank" rel="noopener noreferrer" aria-label={`${t("Itinéraire vers")} ${general.address}`}>{general.address} ↗</a></p></div><div><h3>{t("Contact")}</h3><p><a href={`tel:${general.phoneHref}`}>{general.phone}</a><br/><a href={`mailto:${general.email}`}>{general.email}</a></p></div><div><h3>{t("Horaires")}</h3><p className="preline">{general.hours}</p></div><div><h3>{t("Avis & réseaux")}</h3><p><Link href="/avis">{t("Avis Google")}</Link>{activeSocials.map((link,i)=><span key={i}><br/><a href={link.url} target="_blank" rel="noreferrer">{link.label}</a></span>)}</p><p><Link href="/club">Club LBDC</Link><br/><Link href="/application">{t("Installer l’application")}</Link></p></div></div><div className="container footer-bottom">© {new Date().getFullYear()} Le Bistrot Du Coin</div></footer> }
