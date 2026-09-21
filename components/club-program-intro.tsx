'use client'
import {useLanguage} from '@/components/language-provider'
import LoyaltyProgramCard from './LoyaltyProgramCard'
import { useSiteContent } from '@/components/content-provider'

export function ClubProgramIntro(){
 const {t,locale}=useLanguage();
const{club,loyaltyProgram}=useSiteContent();return <aside className="club-benefits"><span className="club-badge light">Club LBDC</span><h2>{t("Vos avantages")}</h2><p>{club.presentation}</p><div className="club-benefit"><b>⭐</b><div><strong>{t("Comment ça marche ?")}</strong><LoyaltyProgramCard value={loyaltyProgram}/></div></div>{club.rewards.slice(1).map((reward,index)=><div className="club-benefit" key={index}><b>🎁</b><div><strong>{reward}</strong></div></div>)}<small>{club.conditions}</small></aside>}
