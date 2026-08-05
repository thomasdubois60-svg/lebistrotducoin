import { NextRequest, NextResponse } from 'next/server'
import { getPromotionCouponByToken } from '@/lib/promotion-coupon-store'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){try{const token=request.nextUrl.searchParams.get('token')||'';if(!token)return NextResponse.json({error:'Jeton manquant.'},{status:400});const coupon=await getPromotionCouponByToken(token);if(!coupon)return NextResponse.json({error:'Coupon introuvable.'},{status:404});return NextResponse.json({usedAt:coupon.used_at,expiresAt:coupon.expires_at,discountAmount:Number(coupon.discount_amount_ttc||0)})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Lecture impossible.'},{status:500})}}
