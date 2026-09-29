export function rewardToken(member:string,reward:string,expiresAt:string|null):string;
export function verifyRewardToken(token:string):{member:string;reward:string;nonce:string;exp:number};
