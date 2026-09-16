import {GET as readPublishedContent} from '@/app/api/content/route'
import {normalizeLoyaltyProgram,loyaltyRewardDetails} from './loyalty-program'
import type {SiteContent} from './default-content'
export async function readLoyaltyContent(){const response=await readPublishedContent();if(!response.ok)throw new Error('Impossible de vérifier le programme de fidélité publié.');return await response.json() as SiteContent}
export async function getPublishedLoyalty(){const content=await readLoyaltyContent();return normalizeLoyaltyProgram(content.loyaltyProgram)}
export async function getPublishedReward(){return loyaltyRewardDetails(await readLoyaltyContent())}
