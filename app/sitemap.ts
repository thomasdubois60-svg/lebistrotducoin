import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL||'https://lebistrotducoin.vercel.app'; return ['','/aujourdhui','/carte','/histoire','/galerie','/contact'].map((path)=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path==='/aujourdhui'?'daily':'monthly',priority:path===''?1:0.8})) }
