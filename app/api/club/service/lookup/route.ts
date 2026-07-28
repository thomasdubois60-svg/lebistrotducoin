import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { getServiceMember } from '@/lib/service-mode'
export const dynamic='force-dynamic'
export async function POST(request:NextRequest){
 if(!isAdminRequest(request)) return NextResponse.json({error:'Connexion administrateur requise.'},{status:401})
 try{const {value}=await request.json(); if(!value)return NextResponse.json({error:'QR code ou code membre manquant.'},{status:400}); const data=await getServiceMember(String(value)); if(!data)return NextResponse.json({error:'Membre introuvable.'},{status:404}); return NextResponse.json(data)}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Lecture impossible.'},{status:400})}
}
