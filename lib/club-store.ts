import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export type ClubMember = {
  id: string
  first_name: string
  last_name: string
  email: string
  birthday: string | null
  email_marketing: boolean
  notification_interest: boolean
  loyalty_points: number
  reward_available: boolean
  personal_code: string
  created_at: string
}

const settings = () => ({
  url: process.env.SUPABASE_URL?.replace(/\/$/, ''),
  key: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
})
const headers = () => { const { key } = settings(); return { apikey:key||'', Authorization:`Bearer ${key||''}`, 'Content-Type':'application/json' } }
export function clubStorageConfigured(){const {url,key}=settings();return Boolean(url&&key)}
const memberSelect='id,first_name,last_name,email,birthday,email_marketing,notification_interest,loyalty_points,reward_available,personal_code,created_at'

function hashPassword(password:string,salt=randomBytes(16).toString('hex')){return {salt,hash:scryptSync(password,salt,64).toString('hex')}}
function verifyPassword(password:string,salt:string,expected:string){const actual=scryptSync(password,salt,64);const target=Buffer.from(expected,'hex');return actual.length===target.length&&timingSafeEqual(actual,target)}

export async function joinClub(input:{firstName:string;lastName:string;email:string;password:string;birthday?:string;emailMarketing:boolean;notificationInterest:boolean}){
 const {url}=settings(); if(!url||!clubStorageConfigured())throw new Error('Le Club LBDC n’est pas encore configuré.')
 const email=input.email.trim().toLowerCase(); const secured=hashPassword(input.password)
 const response=await fetch(`${url}/rest/v1/club_members?on_conflict=email`,{method:'POST',headers:{...headers(),Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({first_name:input.firstName.trim(),last_name:input.lastName.trim(),email,birthday:input.birthday||null,email_marketing:input.emailMarketing,notification_interest:input.notificationInterest,password_hash:secured.hash,password_salt:secured.salt,consent_updated_at:new Date().toISOString()}),cache:'no-store'})
 if(!response.ok)throw new Error(`Inscription impossible (${response.status}).`); const rows=await response.json() as ClubMember[];return rows[0]
}
export async function listClubMembers():Promise<ClubMember[]>{const {url}=settings();if(!url||!clubStorageConfigured())throw new Error('Le Club LBDC n’est pas encore configuré.');const r=await fetch(`${url}/rest/v1/club_members?select=${memberSelect}&order=created_at.desc`,{headers:headers(),cache:'no-store'});if(!r.ok)throw new Error(`Lecture impossible (${r.status}).`);return r.json()}
export async function getClubMemberByPassword(emailInput:string,password:string):Promise<ClubMember|null>{const {url}=settings();if(!url||!clubStorageConfigured())throw new Error('Le Club LBDC n’est pas encore configuré.');const email=emailInput.trim().toLowerCase();const q=new URLSearchParams({select:`${memberSelect},password_hash,password_salt`,email:`eq.${email}`,limit:'1'});const r=await fetch(`${url}/rest/v1/club_members?${q}`,{headers:headers(),cache:'no-store'});if(!r.ok)throw new Error(`Connexion impossible (${r.status}).`);const rows=await r.json() as (ClubMember&{password_hash:string|null;password_salt:string|null})[];const row=rows[0];if(!row?.password_hash||!row.password_salt||!verifyPassword(password,row.password_salt,row.password_hash))return null;const {password_hash,password_salt,...member}=row;return member}
export async function getClubMemberByCode(code:string):Promise<ClubMember|null>{const {url}=settings();if(!url||!clubStorageConfigured())throw new Error('Club non configuré.');const q=new URLSearchParams({select:memberSelect,personal_code:`eq.${code}`,limit:'1'});const r=await fetch(`${url}/rest/v1/club_members?${q}`,{headers:headers(),cache:'no-store'});if(!r.ok)throw new Error(`Lecture impossible (${r.status}).`);const rows=await r.json() as ClubMember[];return rows[0]||null}
export async function addLoyaltyPoint(code:string){const member=await getClubMemberByCode(code);if(!member)throw new Error('Membre introuvable.');const {url}=settings();const points=Math.min(10,(member.loyalty_points||0)+1);const reward=points>=10;const r=await fetch(`${url}/rest/v1/club_members?personal_code=eq.${encodeURIComponent(code)}`,{method:'PATCH',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify({loyalty_points:points,reward_available:reward,updated_at:new Date().toISOString()}),cache:'no-store'});if(!r.ok)throw new Error(`Mise à jour impossible (${r.status}).`);const rows=await r.json() as ClubMember[];return rows[0]}
export async function redeemReward(code:string){const member=await getClubMemberByCode(code);if(!member?.reward_available)throw new Error('Aucune récompense disponible.');const {url}=settings();const r=await fetch(`${url}/rest/v1/club_members?personal_code=eq.${encodeURIComponent(code)}`,{method:'PATCH',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify({loyalty_points:0,reward_available:false,updated_at:new Date().toISOString()}),cache:'no-store'});if(!r.ok)throw new Error(`Validation impossible (${r.status}).`);const rows=await r.json() as ClubMember[];return rows[0]}
