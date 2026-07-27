import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
export const dynamic='force-dynamic'
export async function GET(request:NextRequest){const code=request.nextUrl.searchParams.get('code')||'';if(!code)return new NextResponse('Code manquant',{status:400});const url=new URL(`/fidelite/${encodeURIComponent(code)}`,request.nextUrl.origin).toString();const svg=await QRCode.toString(url,{type:'svg',margin:1,width:360,errorCorrectionLevel:'M'});return new NextResponse(svg,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'private, max-age=300'}})}
