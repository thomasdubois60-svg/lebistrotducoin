'use client'
import {useLanguage} from '@/components/language-provider'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSiteContent } from './content-provider'
import { eventAnchor, eventDateLabel, featuredEvent } from '@/lib/events'

export function EventBanner() {
 const {t,locale}=useLanguage();

  const { events } = useSiteContent()
  const [now, setNow] = useState(() => Date.now())
  const [animationRun, setAnimationRun] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000)
    const restart = () => setAnimationRun(run => run + 1)
    window.addEventListener('pageshow', restart)
    window.addEventListener('popstate', restart)
    return () => { clearInterval(timer); window.removeEventListener('pageshow', restart); window.removeEventListener('popstate', restart) }
  }, [])
  const event = featuredEvent(events, now)
  if (!event) return null
  return <Link className="event-ticker" href={`/evenements#${eventAnchor(event)}`} aria-label={`${t("Voir l’événement")} ${event.title}`} onClick={event => event.currentTarget.blur()}><span key={animationRun} className="event-ticker-track"><b>🎉 {event.title}</b><span>— {eventDateLabel(event,locale)}</span>{event.description && <span>— {event.description}</span>}<strong>{t("— Voir l’événement →")}</strong></span></Link>
}
