import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { redeemPromotionCoupon } from '@/lib/promotion-coupon-store'
export const dynamic='force-dynamic'
export async function POST(request:NextRequest){if(!isAdminRequest(request))return NextResponse.json({error:'Connexion administrateur requise.'},{status:401});try{const b=await request.json() as {token?:string;originalAmountTtc?:number};const coupon=await redeemPromotionCoupon(b.token||'',Number(b.originalAmountTtc));return NextResponse.json({ok:true,coupon})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Validation impossible.'},{status:400})}}
