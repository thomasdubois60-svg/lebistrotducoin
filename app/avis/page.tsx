'use client'
import {useLanguage} from '@/components/language-provider'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
export default function ReviewsPage(){
 const {t,locale}=useLanguage();
 const {reviews,socials,pageTexts}=useSiteContent(); const active=socials.filter(link=>link.url.trim()); return <><PageHero eyebrow={t("Votre expérience")} title={reviews.title} text={pageTexts.reviewsIntro || reviews.intro}/><section className="section"><div className="container narrow centered"><p className="lead">{reviews.intro}</p><div className="review-actions">{reviews.googleReviewsUrl&&<a className="button" href={reviews.googleReviewsUrl} target="_blank" rel="noreferrer">{t("Voir les avis Google")}</a>}{reviews.googleReviewWriteUrl&&<a className="button secondary" href={reviews.googleReviewWriteUrl} target="_blank" rel="noreferrer">{t("Laisser un avis")}</a>}</div>{active.length>0&&<><h2>{t("Suivez-nous")}</h2><div className="social-grid">{active.map((link,i)=><a className="social-card" key={i} href={link.url} target="_blank" rel="noreferrer"><strong>{link.label}</strong><span>{t("Ouvrir le compte →")}</span></a>)}</div></>}</div></section></> }
