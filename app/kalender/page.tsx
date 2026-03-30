'use client'
import { useState } from 'react'
import { SESSIONS, INITIAL_BOOKINGS } from '@/lib/mock-data'
import { Session } from '@/lib/types'
import DayHeader from '@/components/kalender/DayHeader'
import TrainingCard from '@/components/kalender/TrainingCard'
import BookingModal from '@/components/kalender/BookingModal'

function groupByDay(sessions: Session[]): [string, Session[]][] {
  const map = new Map<string, Session[]>()
  for (const s of sessions) {
    const key = s.startsAt.toDateString()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  return Array.from(map.entries())
}

export default function KalenderPage() {
  const [bookedIds, setBookedIds] = useState<Set<string>>(
    new Set(INITIAL_BOOKINGS.map(b => b.sessionId))
  )
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(SESSIONS.map(s => [s.id, s.bookedCount]))
  )
  const [selected, setSelected] = useState<Session | null>(null)

  function handleBook() {
    if (!selected) return
    setBookedIds(prev => new Set(Array.from(prev).concat(selected.id)))
    setCounts(prev => ({ ...prev, [selected.id]: (prev[selected.id] ?? 0) + 1 }))
    setSelected(null)
  }

  function handleCancel() {
    if (!selected) return
    setBookedIds(prev => { const next = new Set(prev); next.delete(selected.id); return next })
    setCounts(prev => ({ ...prev, [selected.id]: Math.max(0, (prev[selected.id] ?? 1) - 1) }))
    setSelected(null)
  }

  const days = groupByDay(SESSIONS)

  return (
    <>
      <div className="space-y-1">
        {days.map(([dayKey, sessions]) => (
          <div key={dayKey}>
            <DayHeader date={sessions[0].startsAt} />
            <div className="space-y-2">
              {sessions.map(s => (
                <TrainingCard
                  key={s.id}
                  session={s}
                  isBooked={bookedIds.has(s.id)}
                  bookedCount={counts[s.id] ?? s.bookedCount}
                  onClick={() => setSelected(s)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <BookingModal
        session={selected}
        isBooked={selected ? bookedIds.has(selected.id) : false}
        bookedCount={selected ? (counts[selected.id] ?? selected.bookedCount) : 0}
        onClose={() => setSelected(null)}
        onBook={handleBook}
        onCancel={handleCancel}
      />
    </>
  )
}
