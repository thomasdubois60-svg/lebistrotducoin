export type LoyaltyProgram={title:string;description:string;threshold:number;reward:string;clientText:string;rewardValue:number|null;enabled:boolean}
export const defaultLoyaltyProgram:LoyaltyProgram
export function normalizeLoyaltyProgram(value?:unknown):LoyaltyProgram
export function validateLoyaltyProgram(value?:unknown):void
export function loyaltyRewardDetails(content:import('./default-content').SiteContent):{name:string;valueTtc:number;formatted:string;rawPrice:string}
