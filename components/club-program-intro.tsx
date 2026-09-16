'use client'
import LoyaltyProgramCard from './LoyaltyProgramCard'
import { useSiteContent } from '@/components/content-provider'

export function ClubProgramIntro(){const{club,loyaltyProgram}=useSiteContent();return <aside className="club-benefits"><span className="club-badge light">Club LBDC</span><h2>Vos avantages</h2><p>{club.presentation}</p><div className="club-benefit"><b>⭐</b><div><strong>Comment ça marche ?</strong><LoyaltyProgramCard value={loyaltyProgram}/></div></div>{club.rewards.slice(1).map((reward,index)=><div className="club-benefit" key={index}><b>🎁</b><div><strong>{reward}</strong></div></div>)}<small>{club.conditions}</small></aside>}
