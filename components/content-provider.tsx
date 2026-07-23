'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { defaultContent, normalizeContent, SiteContent } from '@/lib/default-content'

const ContentContext = createContext<SiteContent>(defaultContent)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState(defaultContent)
  useEffect(() => {
    const update = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' })
        if (response.ok) setContent(normalizeContent(await response.json()))
      } catch { setContent(defaultContent) }
    }
    update()
    window.addEventListener('bistrot-content-updated', update)
    return () => window.removeEventListener('bistrot-content-updated', update)
  }, [])
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
export const useSiteContent = () => useContext(ContentContext)
