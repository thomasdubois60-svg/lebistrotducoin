'use client'
import { useRouter } from 'next/navigation'
import { useSiteContent } from '@/components/content-provider'
import MenuExperience from '@/components/MenuExperience'
export default function MenuPage() {
 const {menu,pageTexts,menuStyle}=useSiteContent(), router=useRouter()
 return <MenuExperience globalStyle={menuStyle} menu={menu} introduction={pageTexts.menuIntro} onNavigate={(key: string | null)=>router.push(key?'/carte/'+encodeURIComponent(key):'/carte')}/>
}
