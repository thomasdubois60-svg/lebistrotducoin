import { NextRequest, NextResponse } from 'next/server'
import {memberSessionCookie,readMemberSession} from '@/lib/member-session'
import {after} from 'next/server'
import {dispatchCommunity} from '@/lib/community-server'
import {getClubMemberByCode} from '@/lib/club-store'
import { deletePushSubscription, savePushSubscription } from '@/lib/push-store'
export const maxDuration=60;
export const dynamic='force-dynamic'
export async function POST(request:NextRequest){try{const body=await request.json() as {subscription?:PushSubscriptionJSON;memberCode?:string}&PushSubscriptionJSON;const subscription=body.subscription||body;if(!subscription?.endpoint||!subscription.keys?.p256dh||!subscription.keys?.auth)return NextResponse.json({error:'Abonnement invalide.'},{status:400});if(request.headers.get('origin')&&request.headers.get('origin')!==request.nextUrl.origin)return NextResponse.json({error:'Origine refusée.'},{status:403});const session=readMemberSession(request.cookies.get(memberSessionCookie.name)?.value);await savePushSubscription(subscription,request.headers.get('user-agent')||'',session?.code);if(session)after(async()=>{const m=await getClubMemberByCode(session.code).catch(()=>null);if(m)await dispatchCommunity(m.id).catch(()=>{})});return NextResponse.json({ok:true})}catch(error){return NextResponse.json({error:'Enregistrement des notifications momentanément impossible. Réessayez.'},{status:500})}}
export async function DELETE(request:NextRequest){try{const {endpoint}=await request.json() as {endpoint?:string};if(endpoint)await deletePushSubscription(endpoint);return NextResponse.json({ok:true})}catch{return NextResponse.json({error:'Désabonnement impossible.'},{status:500})}}
