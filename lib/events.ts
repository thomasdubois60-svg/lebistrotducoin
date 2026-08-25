import type { EventItem } from './default-content'

export type ManagedEvent = EventItem & { time?: string; endDate?: string; endTime?: string }

function parseEventDate(dateValue?: string, timeValue?: string, endOfDay = false) {
  const date = String(dateValue || '').trim()
  if (!date) return null
  const time = String(timeValue || '').trim()
  let value = Number.NaN
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) value = new Date(`${date}T${time || (endOfDay ? '23:59:59.999' : '00:00:00')}`).getTime()
  else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) { const [day, month, year] = date.split('/'); value = new Date(`${year}-${month}-${day}T${time || (endOfDay ? '23:59:59.999' : '00:00:00')}`).getTime() }
  else value = Date.parse(time ? `${date} ${time}` : date)
  return Number.isNaN(value) ? null : value
}

export function eventTiming(event: ManagedEvent) {
  const start = parseEventDate(event.date, event.time)
  const hasExplicitEnd = Boolean(event.endDate || event.endTime)
  const end = hasExplicitEnd ? parseEventDate(event.endDate || event.date, event.endTime, !event.endTime) : parseEventDate(event.date, '', true)
  return { start, end: end ?? start }
}

export function partitionEvents(events: EventItem[], now = Date.now()) {
  const dated = events.map((source, index) => { const event = source as ManagedEvent; return { event, index, ...eventTiming(event) } })
  const upcoming = dated.filter(item => item.end === null || item.end >= now).sort((a, b) => (a.start ?? Number.MAX_SAFE_INTEGER) - (b.start ?? Number.MAX_SAFE_INTEGER) || a.index - b.index)
  const past = dated.filter(item => item.end !== null && item.end < now).sort((a, b) => (b.end ?? 0) - (a.end ?? 0) || b.index - a.index)
  return { upcoming, past }
}

export function featuredEvent(events: EventItem[], now = Date.now()) {
  const candidates = events.map((source, index) => { const event = source as ManagedEvent; return { event, index, ...eventTiming(event) } }).filter(item => item.start !== null && item.end !== null && item.end >= now)
  const current = candidates.filter(item => item.start! <= now).sort((a, b) => b.start! - a.start! || a.index - b.index)
  if (current.length) return current[0].event
  return candidates.filter(item => item.start! > now).sort((a, b) => a.start! - b.start! || a.index - b.index)[0]?.event || null
}

export function eventAnchor(event: ManagedEvent) {
  const source = `${event.title}-${event.date}-${event.time || ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `evenement-${source || 'bistrot'}`
}

export function eventDateLabel(event: ManagedEvent) {
  let date = event.date
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) date = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${event.date}T12:00:00`))
  return [date, event.time ? `à ${event.time.replace(':', 'h')}` : ''].filter(Boolean).join(' ')
}
