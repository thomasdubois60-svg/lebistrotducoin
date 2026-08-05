import type { ClubMember, LoyaltyEvent } from '@/lib/club-store'
import type { PromotionCoupon } from '@/lib/promotion-coupon-store'
import type { WelcomeOffer } from '@/lib/welcome-offer-store'

export function clubMemberView(member:ClubMember, offer:WelcomeOffer, coupons:PromotionCoupon[], events:LoyaltyEvent[]){
  return {
    firstName:member.first_name,lastName:member.last_name,email:member.email,birthday:member.birthday,
    personalCode:member.personal_code,loyaltyPoints:member.loyalty_points,rewardAvailable:member.reward_available,
    emailMarketing:member.email_marketing,notificationInterest:member.notification_interest,createdAt:member.created_at,
    welcomeOffer:{token:offer.token,createdAt:offer.created_at,expiresAt:offer.expires_at,usedAt:offer.used_at,discountRate:Number(offer.discount_rate),discountAmount:Number(offer.discount_amount_ttc||0)},
    promotionCoupons:coupons.map(c=>({token:c.token,promotionId:c.promotion_id,expiresAt:c.expires_at,usedAt:c.used_at,discountRate:Number(c.discount_rate),discountAmount:Number(c.discount_amount_ttc||0),title:c.club_promotions?.title||'',description:c.club_promotions?.description||'',productLabel:c.product_label||c.club_promotions?.product_label||''})),
    loyaltyEvents:events.map(e=>({id:e.id,type:e.event_type,date:e.created_at,value:Number(e.reward_value_ttc||0),note:e.note||''}))
  }
}
