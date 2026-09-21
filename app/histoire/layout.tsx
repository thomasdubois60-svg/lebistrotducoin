import {localizedMetadata} from '@/lib/language-server'
export const generateMetadata=()=>localizedMetadata("Notre histoire",undefined,'/histoire')
export default function Layout({children}:{children:React.ReactNode}){return children}
