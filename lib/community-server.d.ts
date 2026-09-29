export type DailyProducts = {starters?:{name?:string}[];mains?:{name?:string}[];desserts?:{name?:string}[];suggestion?:{name?:string}};
export function menuProducts(daily:DailyProducts):{name:string;category:string}[];
export function menuIdentity(daily:DailyProducts,now?:Date):{day:string;products:{name:string;category:string}[];key:string};
export function queueMenuNotifications(daily:DailyProducts):Promise<number>;
export function dispatchCommunity(memberId?:string|null):Promise<{sent:number;failed:number;reason?:string}>;
