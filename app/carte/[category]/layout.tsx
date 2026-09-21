import {localizedMetadata} from '@/lib/language-server'
export async function generateMetadata({params}:{params:Promise<{category:string}>}){const {category}=await params;return localizedMetadata('La carte',undefined,'/carte/'+encodeURIComponent(category))}
export default function Layout({children}:{children:React.ReactNode}){return children}
