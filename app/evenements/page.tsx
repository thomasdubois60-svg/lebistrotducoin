'use client'
import { PageHero } from '@/components/page-hero'
import { useSiteContent } from '@/components/content-provider'
import { eventAnchor, eventDateLabel, partitionEvents } from '@/lib/events'

type EventRow = ReturnType<typeof partitionEvents>['upcoming'][number]
function EventCard({ item }: { item: EventRow }) {
  const { event } = item
  return <article className="event-card" id={eventAnchor(event)}>{event.image && <img src={event.image} alt={event.imageAlt || event.title}/>}<div className="event-content"><span className="eyebrow">{eventDateLabel(event)}</span><h2>{event.title}</h2><p>{event.description}</p>{event.price && <strong className="event-price">{event.price}</strong>}</div></article>
}

export default function EventsPage() {
  const { events, general, pageTexts } = useSiteContent()
  const { upcoming, past } = partitionEvents(events)
  return <><PageHero eyebrow="Au Bistrot" title="Événements" text={pageTexts.eventsIntro}/><section className="section"><div className="container event-sections"><section><h2>Événements à venir</h2>{upcoming.length ? <div className="events-grid">{upcoming.map(item => <EventCard key={`${item.index}-${item.event.title}`} item={item}/>)}</div> : <div className="empty-state"><h3>Les prochains événements arrivent bientôt</h3><p>Suivez nos actualités ou contactez-nous pour en savoir plus.</p><a className="button" href={`tel:${general.phoneHref}`}>Nous contacter</a></div>}</section>{past.length > 0 && <section className="past-events"><h2>Événements passés</h2><div className="events-grid">{past.map(item => <EventCard key={`${item.index}-${item.event.title}`} item={item}/>)}</div></section>}</div></section></>
}
