import { NextRequest, NextResponse } from 'next/server'
import { getClubMemberByPassword, listMemberLoyaltyEvents } from '@/lib/club-store'
import { ensureWelcomeOffer } from '@/lib/welcome-offer-store'
import { ensureMemberPromotionCoupons } from '@/lib/promotion-coupon-store'
import { createMemberSession, memberSessionCookie } from '@/lib/member-session'
import { clubMemberView } from '@/lib/club-member-view'
export const dynamic='force-dynamic'
export async function POST(request:NextRequest){try{const b=await request.json() as {email?:string;password?:string};const email=b.email?.trim().toLowerCase()||'';const password=b.password||'';if(!/^\S+@\S+\.\S+$/.test(email)||!password)return NextResponse.json({error:'Adresse e-mail ou mot de passe invalide.'},{status:400});const m=await getClubMemberByPassword(email,password);if(!m)return NextResponse.json({error:'Adresse e-mail ou mot de passe incorrect.'},{status:401});const [offer,coupons,events]=await Promise.all([ensureWelcomeOffer(m.id),ensureMemberPromotionCoupons(m.id),listMemberLoyaltyEvents(m.id)]);const response=NextResponse.json({ok:true,member:clubMemberView(m,offer,coupons,events)});response.cookies.set(memberSessionCookie.name,createMemberSession(m.personal_code),memberSessionCookie.options);return response}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Connexion impossible.'},{status:503})}}
