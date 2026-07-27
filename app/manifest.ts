import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name:'Le Bistrot Du Coin',
    short_name:'LBDC',
    description:'Menus du jour, carte, événements et actualités du Bistrot.',
    start_url:'/',
    scope:'/',
    display:'standalone',
    background_color:'#f4efe8',
    theme_color:'#6f0d22',
    lang:'fr',
    categories:['food','lifestyle'],
    icons:[
      {src:'/icons/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
      {src:'/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},
      {src:'/icons/icon-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}
    ],
    shortcuts:[
      {name:'Menu du jour',short_name:'Aujourd’hui',url:'/aujourdhui',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
      {name:'La carte',short_name:'Carte',url:'/carte',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
      {name:'Événements',short_name:'Événements',url:'/evenements',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]}
    ]
  }
}
