import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return { name:'Le Bistrot Du Coin', short_name:'Le Bistrot', description:'Restaurant convivial à Saint-Laurent-Nouan', start_url:'/', display:'standalone', background_color:'#f4efe8', theme_color:'#6f0d22', lang:'fr', icons:[{src:'/icons/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icons/icon-512.png',sizes:'512x512',type:'image/png'}] }
}
