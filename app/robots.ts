import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots { const base=process.env.NEXT_PUBLIC_SITE_URL||'https://lebistrotducoin.vercel.app'; return {rules:{userAgent:'*',allow:'/',disallow:'/administration'},sitemap:`${base}/sitemap.xml`} }
