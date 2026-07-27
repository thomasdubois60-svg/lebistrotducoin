import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { addLoyaltyPoint, redeemReward } from '@/lib/club-store'
export const dynamic='force-dynamic'
export async function POST(request:NextRequest){if(!isAdminRequest(request))return NextResponse.json({error:'Connexion administrateur requise.'},{status:401});try{const b=await request.json() as {code?:string;action?:string;rewardValueTtc?:number};if(!b.code)return NextResponse.json({error:'Code membre manquant.'},{status:400});if(b.action==='redeem'){const result=await redeemReward(b.code,Number(b.rewardValueTtc||0));return NextResponse.json({ok:true,...result})}const member=await addLoyaltyPoint(b.code);return NextResponse.json({ok:true,member})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Opération impossible.'},{status:400})}}
