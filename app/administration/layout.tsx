import type { Metadata } from 'next'
export const metadata:Metadata={title:'Administration LBDC',description:'Administration du Bistrot Du Coin',manifest:'/administration/manifest.webmanifest',appleWebApp:{capable:true,title:'Admin LBDC',statusBarStyle:'black-translucent'},icons:{apple:'/icons/admin-192.png'}}
export default function AdministrationLayout({children}:{children:React.ReactNode}){return children}
