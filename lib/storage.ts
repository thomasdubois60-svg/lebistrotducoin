'use client'

import { defaultContent, SiteContent } from './default-content'

const KEY = 'bistrot-content-v1'

export function loadContent(): SiteContent {
  if (typeof window === 'undefined') return defaultContent
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : defaultContent
  } catch {
    return defaultContent
  }
}

export function saveContent(content: SiteContent) {
  window.localStorage.setItem(KEY, JSON.stringify(content))
  window.dispatchEvent(new Event('bistrot-content-updated'))
}

export function resetContent() {
  window.localStorage.removeItem(KEY)
  window.dispatchEvent(new Event('bistrot-content-updated'))
}
