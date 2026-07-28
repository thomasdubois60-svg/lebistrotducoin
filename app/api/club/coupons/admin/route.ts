import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { listPromotionCoupons } from '@/lib/promotion-coupon-store'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){if(!isAdminRequest(request))return NextResponse.json({error:'Accès refusé.'},{status:401});try{const coupons=await listPromotionCoupons();return NextResponse.json({coupons})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Lecture impossible.'},{status:500})}}
