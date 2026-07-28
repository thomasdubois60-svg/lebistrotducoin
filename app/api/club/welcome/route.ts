import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { redeemWelcomeOffer } from '@/lib/welcome-offer-store'
export const dynamic='force-dynamic'
export async function POST(request:NextRequest){if(!isAdminRequest(request))return NextResponse.json({error:'Connexion administrateur requise.'},{status:401});try{const body=await request.json() as {token?:string;originalAmountTtc?:number};const offer=await redeemWelcomeOffer(body.token||'',Number(body.originalAmountTtc));return NextResponse.json({ok:true,offer})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Validation impossible.'},{status:400})}}
