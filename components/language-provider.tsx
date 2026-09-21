'use client'
import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react'
import {useRouter} from 'next/navigation'
import {isLocale,Locale,translate} from '@/lib/i18n'

const LanguageContext=createContext({locale:'fr' as Locale,setLocale:(_locale:Locale)=>{},t:(text:string,values?:Record<string,string|number>)=>translate(text,'fr',values)})
export function LanguageProvider({children,initialLocale='fr'}:{children:React.ReactNode;initialLocale?:Locale}){
 const [locale,setLanguage]=useState<Locale>(initialLocale)
 const router=useRouter()
 const setLocale=useCallback((next:Locale)=>{
  if(!isLocale(next))return
  setLanguage(next)
  document.cookie=`lbdc-language=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`
  try{localStorage.setItem('lbdc-language',next)}catch{}
  router.refresh()
 },[router])
 useEffect(()=>{document.documentElement.lang=locale},[locale])
 useEffect(()=>{try{const saved=localStorage.getItem('lbdc-language');if(isLocale(saved)&&!document.cookie.includes('lbdc-language='))setLocale(saved)}catch{}},[setLocale])
 const t=useCallback((text:string,values?:Record<string,string|number>)=>translate(text,locale,values),[locale])
 const value=useMemo(()=>({locale,setLocale,t}),[locale,setLocale,t])
 return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
export const useLanguage=()=>useContext(LanguageContext)
export function Text({children}:{children:string}){const {t}=useLanguage();return <>{t(children)}</>}
