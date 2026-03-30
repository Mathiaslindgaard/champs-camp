import { Session } from './types'

export function formatDanishDate(date: Date): string {
  const s = new Intl.DateTimeFormat('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function groupSessionsByDay(sessions: Session[]): [string, Session[]][] {
  const map = new Map<string, Session[]>()
  for (const s of sessions) {
    const key = s.startsAt.toDateString()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  return Array.from(map.entries())
}
