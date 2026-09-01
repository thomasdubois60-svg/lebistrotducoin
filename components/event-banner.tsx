'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSiteContent } from './content-provider'
import { eventAnchor, eventDateLabel, featuredEvent } from '@/lib/events'

export function EventBanner() {
  const { events } = useSiteContent()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(timer) }, [])
  const event = featuredEvent(events, now)
  if (!event) return null
  return <Link className="event-ticker" href={`/evenements#${eventAnchor(event)}`} aria-label={`Voir l’événement ${event.title}`}><span className="event-ticker-track"><b>🎉 {event.title}</b><span>— {eventDateLabel(event)}</span>{event.description && <span>— {event.description}</span>}<strong>— Voir l’événement →</strong></span></Link>
}
