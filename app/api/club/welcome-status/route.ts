import { NextRequest, NextResponse } from 'next/server'
import { getWelcomeOfferByToken } from '@/lib/welcome-offer-store'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){try{const token=request.nextUrl.searchParams.get('token')||'';if(!token)return NextResponse.json({error:'Jeton manquant.'},{status:400});const offer=await getWelcomeOfferByToken(token);if(!offer)return NextResponse.json({error:'Offre introuvable.'},{status:404});return NextResponse.json({usedAt:offer.used_at,expiresAt:offer.expires_at})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Lecture impossible.'},{status:500})}}
