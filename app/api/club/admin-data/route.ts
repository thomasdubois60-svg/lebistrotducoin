import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { listClubMembers, listLoyaltyEvents } from '@/lib/club-store'
import { listWelcomeOffers } from '@/lib/welcome-offer-store'
import {getPublishedReward} from '@/lib/published-loyalty'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){if(!isAdminRequest(request))return NextResponse.json({error:'Accès refusé.'},{status:401});try{const [members,events,formula,welcomeOffers]=await Promise.all([listClubMembers(),listLoyaltyEvents(),getPublishedReward(),listWelcomeOffers()]);return NextResponse.json({members,events,formula,welcomeOffers})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Lecture impossible.'},{status:503})}}
