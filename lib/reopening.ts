import type { SiteContent } from './default-content'

const PARIS = 'Europe/Paris'
const partsFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: PARIS, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23' })

function parts(date: Date) {
  const values = Object.fromEntries(partsFormatter.formatToParts(date).filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]))
  return values as Record<'year'|'month'|'day'|'hour'|'minute'|'second', number>
}

export function parisLocalToUtc(year:number, month:number, day:number, hour:number, minute:number, second=0) {
  const wanted = Date.UTC(year, month - 1, day, hour, minute, second)
  let candidate = wanted
  for (let index = 0; index < 3; index += 1) {
    const actual = parts(new Date(candidate))
    const represented = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second)
    candidate += wanted - represented
  }
  return new Date(candidate)
}

export function reopeningWindow(closureEnd: string) {
  const end = new Date(closureEnd)
  if (Number.isNaN(end.getTime())) return null
  const localEnd = parts(end)
  const nextDay = new Date(Date.UTC(localEnd.year, localEnd.month - 1, localEnd.day + 1))
  const year = nextDay.getUTCFullYear(), month = nextDay.getUTCMonth() + 1, day = nextDay.getUTCDate()
  return { start: parisLocalToUtc(year, month, day, 8, 0), end: parisLocalToUtc(year, month, day, 23, 59, 59) }
}

export function pendingReopening(content: SiteContent, now = new Date()) {
  const general = content.general
  if (!general.closureEnd || general.reopeningProcessedClosureEnd === general.closureEnd) return null
  if (!general.reopeningPushEnabled && !general.reopeningBannerEnabled) return null
  const window = reopeningWindow(general.closureEnd)
  if (!window || now < window.start || now > window.end) return null
  return window
}
