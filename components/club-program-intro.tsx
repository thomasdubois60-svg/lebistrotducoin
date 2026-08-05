'use client'
import { useSiteContent } from '@/components/content-provider'

export function ClubProgramIntro(){const{club}=useSiteContent();return <aside className="club-benefits"><span className="club-badge light">Club LBDC</span><h2>Vos avantages</h2><p>{club.presentation}</p><div className="club-benefit"><b>⭐</b><div><strong>Comment ça marche ?</strong><p>{club.programExplanation}</p></div></div>{club.rewards.map((reward,index)=><div className="club-benefit" key={index}><b>🎁</b><div><strong>{reward}</strong></div></div>)}<small>{club.conditions}</small></aside>}
