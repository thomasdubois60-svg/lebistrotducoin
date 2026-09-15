'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { defaultContent, normalizeContent, SiteContent } from '@/lib/default-content'

const ContentContext = createContext<SiteContent>(defaultContent)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState(defaultContent)
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
    void update()
    window.addEventListener('focus', update)
    window.addEventListener('pageshow', update)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('bistrot-content-updated', update)
    return () => {
      disposed = true
      window.removeEventListener('focus', update)
      window.removeEventListener('pageshow', update)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('bistrot-content-updated', update)
    }
  }, [])
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
export const useSiteContent = () => useContext(ContentContext)
