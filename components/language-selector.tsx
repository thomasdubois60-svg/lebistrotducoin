'use client'
import {useLanguage} from './language-provider'
import {flags,isLocale,languageNames,locales,Locale} from '@/lib/i18n'
function Flag({locale}:{locale:Locale}){
 return <svg width="20" height="14" viewBox="0 0 30 20" aria-hidden="true" style={{borderRadius:2,flexShrink:0}}>{locale==='fr'?<><path fill="#fff" d="M0 0h30v20H0z"/><path fill="#002395" d="M0 0h10v20H0z"/><path fill="#ed2939" d="M20 0h10v20H20z"/></>:locale==='de'?<><path d="M0 0h30v20H0z"/><path fill="#d00" d="M0 6.67h30v13.33H0z"/><path fill="#ffce00" d="M0 13.33h30V20H0z"/></>:locale==='es'?<><path fill="#aa151b" d="M0 0h30v20H0z"/><path fill="#f1bf00" d="M0 5h30v10H0z"/></>:locale==='pt'?<><path fill="#f00" d="M0 0h30v20H0z"/><path fill="#006600" d="M0 0h12v20H0z"/><circle cx="12" cy="10" r="4" fill="#ff0"/><path fill="#fff" stroke="#d00" strokeWidth="1.5" d="M10 7h4v5l-2 1-2-1z"/></>:<><path fill="#012169" d="M0 0h30v20H0z"/><path stroke="#fff" strokeWidth="5" d="m0 0 30 20M30 0 0 20"/><path stroke="#c8102e" strokeWidth="2" d="m0 0 30 20M30 0 0 20"/><path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30"/><path stroke="#c8102e" strokeWidth="4" d="M15 0v20M0 10h30"/></>}</svg>
}
export function LanguageSelector(){
 const {locale,setLocale,t}=useLanguage()
 return <label className="language-control"><span aria-hidden="true" style={{display:'flex',alignItems:'center',gap:6}}><Flag locale={locale}/>{locale.toUpperCase()}⌄</span><select aria-label={t('Choisir la langue')} value={locale} onChange={event=>{if(isLocale(event.target.value))setLocale(event.target.value)}}>{locales.map(key=><option lang={key} key={key} value={key}>{flags[key]} {languageNames[key]}</option>)}</select></label>
}
