'use client'
import { useEffect, useState } from 'react'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
import { eventAnchor, eventDateLabel, partitionEvents } from '@/lib/events'
import { publishedImageUrl } from '@/lib/default-content'

type EventRow = ReturnType<typeof partitionEvents>['upcoming'][number]
type LightboxPhoto = { src: string; alt: string }

export function resolveEventMainPhoto(event: EventRow['event']): LightboxPhoto | null {
  const src = publishedImageUrl(event.image)
  if (!src) return null
  return { src, alt: event.imageAlt || event.title }
}

function EventCard({ item, past, openPhoto }: { item: EventRow; past?: boolean; openPhoto: (photo: LightboxPhoto) => void }) {
  const { event } = item
  const gallery = Array.isArray(event.gallery) ? event.gallery.filter(photo => photo?.src) : []
  const mainPhoto = resolveEventMainPhoto(event)
  return <article className={`event-card${past ? ' event-card-past' : ''}`} id={eventAnchor(event)}>
    {mainPhoto && <button type="button" className="event-main-photo" onClick={past ? () => openPhoto(mainPhoto) : undefined} aria-label={past ? `Agrandir la photo de ${event.title}` : undefined}><img src={mainPhoto.src} alt={mainPhoto.alt}/></button>}
    <div className="event-content"><span className="eyebrow">{eventDateLabel(event)}</span><h2>{event.title}</h2><p>{event.description}</p>{event.price && <strong className="event-price">{event.price}</strong>}</div>
    {past && gallery.length > 0 && <div className="event-memory-gallery" aria-label={`Galerie souvenir de ${event.title}`}>{gallery.map((photo, index) => <button type="button" key={`${photo.src}-${index}`} onClick={() => openPhoto({ src: photo.src, alt: photo.alt || `${event.title}, photo ${index + 1}` })}><img src={photo.src} alt={photo.alt || `${event.title}, photo ${index + 1}`} loading="lazy"/></button>)}</div>}
  </article>
}

export default function EventsPage() {
  const { events, general, pageTexts } = useSiteContent()
  const { upcoming, past } = partitionEvents(events)
  const [lightbox, setLightbox] = useState<LightboxPhoto | null>(null)
  useEffect(() => {
    if (!lightbox) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setLightbox(null) }
    document.body.classList.add('lightbox-open')
    window.addEventListener('keydown', close)
    return () => { document.body.classList.remove('lightbox-open'); window.removeEventListener('keydown', close) }
  }, [lightbox])
  const openPhoto = (photo: LightboxPhoto) => setLightbox(photo)
  return <><PageHero eyebrow="Au Bistrot" title="Événements" text={pageTexts.eventsIntro}/><section className="section"><div className="container event-sections"><section><h2>Événements à venir</h2>{upcoming.length ? <div className="events-grid">{upcoming.map(item => <EventCard key={`${item.index}-${item.event.title}`} item={item} openPhoto={openPhoto}/>)}</div> : <div className="empty-state"><h3>Les prochains événements arrivent bientôt</h3><p>Suivez nos actualités ou contactez-nous pour en savoir plus.</p><a className="button" href={`tel:${general.phoneHref}`}>Nous contacter</a></div>}</section>{past.length > 0 && <section className="past-events"><h2>Événements passés</h2><div className="events-grid">{past.map(item => <EventCard key={`${item.index}-${item.event.title}`} item={item} past openPhoto={openPhoto}/>)}</div></section>}</div></section>{lightbox && <div className="event-lightbox" role="dialog" aria-modal="true" aria-label="Photo agrandie" onClick={() => setLightbox(null)}><button type="button" className="event-lightbox-close" onClick={() => setLightbox(null)} aria-label="Fermer l’image agrandie">×</button><img src={lightbox.src} alt={lightbox.alt} onClick={event => event.stopPropagation()}/></div>}</>
}
