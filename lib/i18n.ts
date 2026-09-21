import { messages } from './messages'
export const locales = ['fr','en','es','pt','de'] as const
export type Locale = typeof locales[number]
export const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale)
export const languageNames: Record<Locale,string> = {fr:'Français',en:'English',es:'Español',pt:'Português',de:'Deutsch'}
export const flags: Record<Locale,string> = {fr:'🇫🇷',en:'🇬🇧',es:'🇪🇸',pt:'🇵🇹',de:'🇩🇪'}
export function translate(text: string, locale: Locale, values: Record<string,string|number> = {}) {
 const key=text.trim(), translated=locale==='fr'?key:messages[key]?.[locale]||key
 const result=translated.replace(/\{(\w+)\}/g,(match,key)=>String(values[key]??match))
 return text.match(/^\s*/)?.[0]+result+(text.match(/\s*$/)?.[0]||'')
}
