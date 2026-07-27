import { NextRequest,NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { listClubMembers,listLoyaltyEvents } from '@/lib/club-store'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){if(!isAdminRequest(request))return NextResponse.json({error:'Accès refusé.'},{status:401});try{const [members,events]=await Promise.all([listClubMembers(),listLoyaltyEvents()]);return NextResponse.json({members,events})}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Lecture impossible.'},{status:503})}}
