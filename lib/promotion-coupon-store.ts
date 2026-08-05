import { randomBytes } from 'node:crypto'
import type { ClubMember } from '@/lib/club-store'
import type { ClubPromotion } from '@/lib/promotion-store'
import { decodePromotionProduct } from '@/lib/product-pricing'

export type PromotionCoupon = {
  id:string; promotion_id:string; member_id:string; token:string; created_at:string; expires_at:string;
  used_at:string|null; original_amount_ttc:number|null; discount_rate:number; discount_amount_ttc:number|null;
  final_amount_ttc:number|null; receipt_number:string|null; product_label:string|null;
  club_promotions?: Pick<ClubPromotion,'id'|'title'|'description'|'discount_label'|'product_label'|'start_at'|'end_at'>;
  club_members?: Pick<ClubMember,'first_name'|'last_name'|'email'|'personal_code'>
}
const settings=()=>({url:process.env.SUPABASE_URL?.replace(/\/$/,''),key:process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY})
const headers=()=>{const {key}=settings();return {apikey:key||'',Authorization:`Bearer ${key||''}`,'Content-Type':'application/json'}}
function requireSettings(){const {url,key}=settings();if(!url||!key)throw new Error('Supabase n’est pas configuré.');return {url,key}}
async function parseError(r:Response,fallback:string){let detail='';try{const b=await r.json() as {message?:string;details?:string};detail=b.message||b.details||''}catch{}return new Error(detail?`${fallback} ${detail}`:fallback)}
function normalizeCoupon(coupon:PromotionCoupon):PromotionCoupon{if(!coupon.club_promotions)return coupon;const product=decodePromotionProduct(coupon.club_promotions.product_label);return{...coupon,club_promotions:{...coupon.club_promotions,product_label:product.label}}}

export async function ensureMemberPromotionCoupons(memberId:string):Promise<PromotionCoupon[]>{
 const {url}=requireSettings();const now=new Date().toISOString();
 const pQuery=`select=*&active=eq.true&coupon_enabled=eq.true&start_at=lte.${encodeURIComponent(now)}&end_at=gte.${encodeURIComponent(now)}`
 const pr=await fetch(`${url}/rest/v1/club_promotions?${pQuery}`,{headers:headers(),cache:'no-store'});if(!pr.ok)throw await parseError(pr,'Lecture des promotions impossible.');
 const promotions=await pr.json() as (Omit<ClubPromotion,'reference_price_ttc'|'price_customized'>&{coupon_enabled:boolean;discount_rate:number|null})[]
 for(const promotion of promotions){
   const token=randomBytes(24).toString('hex');
   const product=decodePromotionProduct(promotion.product_label)
   const r=await fetch(`${url}/rest/v1/club_promotion_coupons?on_conflict=promotion_id,member_id`,{method:'POST',headers:{...headers(),Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({promotion_id:promotion.id,member_id:memberId,token,expires_at:promotion.end_at,discount_rate:Number(promotion.discount_rate||0),product_label:product.label,original_amount_ttc:product.referencePrice}),cache:'no-store'});
   if(!r.ok&&r.status!==409)throw await parseError(r,'Création du coupon impossible.')
 }
 return listMemberPromotionCoupons(memberId)
}
export async function listMemberPromotionCoupons(memberId:string):Promise<PromotionCoupon[]>{const {url}=requireSettings();const select='*,club_promotions(id,title,description,discount_label,product_label,start_at,end_at)';const q=new URLSearchParams({select,member_id:`eq.${memberId}`,order:'created_at.desc'});const r=await fetch(`${url}/rest/v1/club_promotion_coupons?${q}`,{headers:headers(),cache:'no-store'});if(!r.ok)throw await parseError(r,'Lecture des coupons impossible.');return((await r.json())as PromotionCoupon[]).map(normalizeCoupon)}
export async function getPromotionCouponByToken(token:string):Promise<PromotionCoupon|null>{const {url}=requireSettings();const select='*,club_promotions(id,title,description,discount_label,product_label,start_at,end_at),club_members(first_name,last_name,email,personal_code)';const q=new URLSearchParams({select,token:`eq.${token}`,limit:'1'});const r=await fetch(`${url}/rest/v1/club_promotion_coupons?${q}`,{headers:headers(),cache:'no-store'});if(!r.ok)throw await parseError(r,'Lecture du coupon impossible.');const rows=await r.json() as PromotionCoupon[];return rows[0]?normalizeCoupon(rows[0]):null}
export async function redeemPromotionCoupon(token:string,originalAmountTtc:number){const coupon=await getPromotionCouponByToken(token);if(!coupon)throw new Error('Coupon introuvable.');if(coupon.used_at)throw new Error('Ce coupon a déjà été utilisé.');if(new Date(coupon.expires_at).getTime()<Date.now())throw new Error('Ce coupon est expiré.');const stored=Number(coupon.original_amount_ttc);const requested=Number(originalAmountTtc);const reference=Number.isFinite(stored)&&stored>0?stored:requested;if(!Number.isFinite(reference)||reference<=0)throw new Error('Montant de l’addition invalide.');const original=Math.round(reference*100)/100;const rate=Number(coupon.discount_rate);const discount=Math.round(original*rate)/100;const finalAmount=Math.round((original-discount)*100)/100;const receipt=`PROMO-${new Date().toISOString().replace(/\D/g,'').slice(0,14)}-${coupon.token.slice(0,6).toUpperCase()}`;const {url}=requireSettings();const r=await fetch(`${url}/rest/v1/club_promotion_coupons?id=eq.${coupon.id}&used_at=is.null`,{method:'PATCH',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify({used_at:new Date().toISOString(),original_amount_ttc:original,discount_amount_ttc:discount,final_amount_ttc:finalAmount,receipt_number:receipt}),cache:'no-store'});if(!r.ok)throw await parseError(r,'Validation du coupon impossible.');const rows=await r.json() as PromotionCoupon[];if(!rows[0])throw new Error('Ce coupon vient déjà d’être utilisé.');return normalizeCoupon(rows[0])}
export async function listPromotionCoupons():Promise<PromotionCoupon[]>{const {url}=requireSettings();const select='*,club_promotions(id,title,description,discount_label,product_label,start_at,end_at),club_members(first_name,last_name,email,personal_code)';const r=await fetch(`${url}/rest/v1/club_promotion_coupons?select=${encodeURIComponent(select)}&order=created_at.desc&limit=5000`,{headers:headers(),cache:'no-store'});if(!r.ok)throw await parseError(r,'Lecture des coupons impossible.');return((await r.json())as PromotionCoupon[]).map(normalizeCoupon)}
export async function updateUnusedPromotionCouponPricing(promotionId:string,productLabel:string,referencePrice:number|null){const{url}=requireSettings();const r=await fetch(`${url}/rest/v1/club_promotion_coupons?promotion_id=eq.${encodeURIComponent(promotionId)}&used_at=is.null`,{method:'PATCH',headers:{...headers(),Prefer:'return=minimal'},body:JSON.stringify({product_label:productLabel,original_amount_ttc:referencePrice}),cache:'no-store'});if(!r.ok)throw await parseError(r,'Mise à jour des coupons impossible.')}
