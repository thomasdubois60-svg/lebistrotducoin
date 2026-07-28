import { notFound } from 'next/navigation'
import { getPromotionCouponByToken } from '@/lib/promotion-coupon-store'
import { PromotionCouponValidator } from '@/components/promotion-coupon-validator'
export const dynamic='force-dynamic'
export default async function Page({params}:{params:Promise<{token:string}>}){const{token}=await params;const coupon=await getPromotionCouponByToken(token);if(!coupon)notFound();return <section className="section"><div className="container narrow"><PromotionCouponValidator initial={coupon}/></div></section>}
