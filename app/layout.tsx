import {LanguageProvider} from '@/components/language-provider'
import {serverLanguage} from '@/lib/language-server'
import {translate} from '@/lib/i18n'
import {SectionBanner} from '@/components/section-banner'
import type { Metadata } from 'next'
import './globals.css'
import './harmony.css'
import './editorial.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContentProvider } from '@/components/content-provider'
import { ServiceWorker } from '@/components/service-worker'
import { Analytics } from '@vercel/analytics/next'
import { PwaInstallPrompt } from '@/components/pwa-install'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lebistrotducoin.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
 const locale=await serverLanguage();const t=(text:string)=>translate(text,locale);return {
  metadataBase: new URL(siteUrl),
  title: { default: 'Le Bistrot Du Coin | Saint-Laurent-Nouan', template: '%s | Le Bistrot Du Coin' },
  description: t('Restaurant convivial à Saint-Laurent-Nouan : cuisine maison, plats du jour et moments à partager.'),
  keywords: ['restaurant Saint-Laurent-Nouan', 'bistrot 41220', 'restaurant Loir-et-Cher', 'cuisine maison'],
  openGraph: { title: 'Le Bistrot Du Coin', description: t('Un lieu où se rencontrer et partager de bons moments.'), type: 'website', locale: {fr:'fr_FR',en:'en_GB',es:'es_ES',pt:'pt_PT',de:'de_DE'}[locale], url: siteUrl },
  alternates: { canonical: '/' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' }
}

}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale=await serverLanguage()
  return <html lang={locale}><body><LanguageProvider initialLocale={locale}><ContentProvider><ServiceWorker/><Header/><main><SectionBanner/>{children}</main><Footer/><PwaInstallPrompt/><Analytics/></ContentProvider></LanguageProvider></body></html>
}
