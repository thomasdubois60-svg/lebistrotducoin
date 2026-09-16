'use client'
import { useParams, useRouter } from 'next/navigation'
import { useSiteContent } from '@/components/content-provider'
import MenuExperience from '@/components/MenuExperience'
export default function MenuCategoryPage() {
 const {menu,pageTexts}=useSiteContent(), router=useRouter(), params=useParams<{category:string}>()
 return <MenuExperience menu={menu} activeKey={params.category} introduction={pageTexts.menuIntro} onNavigate={(key: string | null)=>router.push(key?'/carte/'+encodeURIComponent(key):'/carte')}/>
}
