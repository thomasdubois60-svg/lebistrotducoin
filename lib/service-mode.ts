import { getClubMemberByCode, listLoyaltyEvents } from '@/lib/club-store'
import { getWelcomeOfferByMemberId, getWelcomeOfferByToken } from '@/lib/welcome-offer-store'
import { getPromotionCouponByToken, listMemberPromotionCoupons } from '@/lib/promotion-coupon-store'

export async function getServiceMember(input:string){
  const value=input.trim(); let code=value
  try{ const u=new URL(value, 'https://lebistrotducoin.vercel.app'); const parts=u.pathname.split('/').filter(Boolean)
    if(parts[0]==='fidelite'&&parts[1]) code=decodeURIComponent(parts[1])
    else if(parts[0]==='offre-bienvenue'&&parts[1]){ const o=await getWelcomeOfferByToken(decodeURIComponent(parts[1])); code=o?.club_members?.personal_code||'' }
    else if(parts[0]==='coupon'&&parts[1]){ const c=await getPromotionCouponByToken(decodeURIComponent(parts[1])); code=c?.club_members?.personal_code||'' }
  }catch{}
  if(!code) return null
  const member=await getClubMemberByCode(code); if(!member) return null
  const [welcome,coupons,events]=await Promise.all([getWelcomeOfferByMemberId(member.id),listMemberPromotionCoupons(member.id),listLoyaltyEvents()])
  const memberEvents=events.filter(e=>e.member_id===member.id)
  return {member,welcome,coupons,events:memberEvents.slice(0,30),lastVisit:memberEvents.find(e=>e.event_type==='passage')?.created_at||null,totalVisits:memberEvents.filter(e=>e.event_type==='passage').length,totalRewards:memberEvents.filter(e=>e.event_type==='reward').length}
}
