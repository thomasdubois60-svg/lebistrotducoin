import {cookies} from 'next/headers'
import {isLocale,translate} from './i18n'
import type {Metadata} from 'next'
export async function serverLanguage(){const value=(await cookies()).get('lbdc-language')?.value;return isLocale(value)?value:'fr'}
export async function localizedMetadata(title:string,description?:string,path='/'):Promise<Metadata>{const locale=await serverLanguage();return {title:translate(title,locale),...(description?{description:translate(description,locale)}:{}),alternates:{canonical:path}}}
