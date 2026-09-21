import {localizedMetadata} from '@/lib/language-server'
export const generateMetadata=()=>localizedMetadata("Menu du jour",undefined,'/aujourdhui')
export default function Layout({children}:{children:React.ReactNode}){return children}
