import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ContentProvider } from '@/components/content-provider'
import { ServiceWorker } from '@/components/service-worker'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lebistrotducoin.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Le Bistrot Du Coin | Saint-Laurent-Nouan', template: '%s | Le Bistrot Du Coin' },
  description: 'Restaurant convivial à Saint-Laurent-Nouan : cuisine maison, plats du jour et moments à partager.',
  keywords: ['restaurant Saint-Laurent-Nouan', 'bistrot 41220', 'restaurant Loir-et-Cher', 'cuisine maison'],
  openGraph: { title: 'Le Bistrot Du Coin', description: 'Un lieu où se rencontrer et partager de bons moments.', type: 'website', locale: 'fr_FR', url: siteUrl },
  alternates: { canonical: '/' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><ContentProvider><ServiceWorker/><Header/><main>{children}</main><Footer/></ContentProvider></body></html>
}
