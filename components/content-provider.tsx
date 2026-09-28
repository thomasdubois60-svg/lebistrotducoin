'use client'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import {useLanguage} from './language-provider'
import {usePathname} from 'next/navigation'
import {localizeContent} from '@/lib/content-translations'
import { defaultContent, normalizeContent, SiteContent } from '@/lib/default-content'

// Keep unpublished fallback photos out of the first render, including SSR.
const initialContent = { ...defaultContent, heroImage: '', privatization: { ...defaultContent.privatization, photos: [] } }
const ContentContext = createContext<SiteContent>(initialContent)

export function ContentProvider({ children, publishedContent }: { children: React.ReactNode; publishedContent?: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(()=>publishedContent?normalizeContent(publishedContent):initialContent)
  useEffect(() => {
    let disposed = false
    let latestRequest = 0
    const update = async () => {
      const request = ++latestRequest
      try {
        const response = await fetch(`/api/content?refresh=${Date.now()}`, { cache: 'no-store' })
        if (!response.ok) return
        const nextContent = normalizeContent(await response.json())
        // A slower, older request must never overwrite a newer refresh.
        if (!disposed && request === latestRequest) setContent(nextContent)
      } catch { /* Keep the last successfully loaded content until the next refresh. */ }
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void update()
    }
    if(!publishedContent)void update()
    window.addEventListener('focus', update)
    const onPageShow=(event:PageTransitionEvent)=>{if(event.persisted)void update()};window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('bistrot-content-updated', update)
    return () => {
      disposed = true
      window.removeEventListener('focus', update)
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('bistrot-content-updated', update)
    }
  }, [])
  const {locale}=useLanguage()
  const pathname=usePathname()
  const localized=useMemo(()=>localizeContent(content,pathname.startsWith('/administration')?'fr':locale),[content,locale,pathname])
  return <ContentContext.Provider value={localized}>{children}</ContentContext.Provider>
}
export const useSiteContent = () => useContext(ContentContext)
