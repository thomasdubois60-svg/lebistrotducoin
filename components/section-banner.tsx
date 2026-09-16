'use client'
import {usePathname} from 'next/navigation'
import {useSiteContent} from './content-provider'
import SectionPhoto from './SectionPhoto'
const routes:Record<string,string>={'/carte':'menu','/galerie':'gallery','/evenements':'events','/privatisation':'privatization','/histoire':'story','/avis':'reviews','/club':'club','/club/espace':'club'}
export function SectionBanner({section}:{section?:string}){const path=usePathname(),{sectionPhotos}=useSiteContent();const key=section||routes[path];const photo=key?sectionPhotos?.[key]:undefined;return <SectionPhoto photo={photo}/>}
