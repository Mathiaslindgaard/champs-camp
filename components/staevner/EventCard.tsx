'use client'
import { useState } from 'react'
import { Event, Fighter } from '@/lib/types'
import FighterPill from './FighterPill'
import SupporterButton from './SupporterButton'
import RideSection from './RideSection'
import Button from '@/components/ui/Button'
import { useRole } from '@/lib/role-context'

interface Props { event: Event }

function fmtDate(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long' }).format(date)
}

export default function EventCard({ event }: Props) {
  const { isAtLeast } = useRole()
  const [fighters, setFighters] = useState<Fighter[]>(event.fighters)
  const [supporterCount, setSupporterCount] = useState(event.supporterCount)
  const [isSupporting, setIsSupporting] = useState(false)
  const [rides, setRides] = useState(event.rides)
  const [bookedRideId, setBookedRideId] = useState<string | null>(null)
  const [addingFighter, setAddingFighter] = useState(false)
  const [newName, setNewName] = useState('')
  const [newWeight, setNewWeight] = useState('')

  function toggleSupport() {
    setSupporterCount(c => isSupporting ? c - 1 : c + 1)
    setIsSupporting(s => !s)
  }

  function handleBookRide(rideId: string) {
    if (bookedRideId === rideId) {
      setBookedRideId(null)
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, seatsTaken: r.seatsTaken - 1 } : r))
    } else {
      if (bookedRideId) {
        setRides(prev => prev.map(r => r.id === bookedRideId ? { ...r, seatsTaken: r.seatsTaken - 1 } : r))
      }
      setBookedRideId(rideId)
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, seatsTaken: r.seatsTaken + 1 } : r))
    }
  }

  function addFighter() {
    if (!newName || !newWeight) return
    setFighters(prev => [...prev, { name: newName, weightClass: newWeight }])
    setNewName('')
    setNewWeight('')
    setAddingFighter(false)
  }

  const isDaBu = event.source === 'dabu'

  return (
    <div className={`bg-cc-black-card rounded-xl border-t border-r border-b border-cc-black-border ${isDaBu ? 'border-l-2 border-l-cc-orange' : 'border-l border-l-cc-black-border'} p-4`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="text-[10px] font-semibold uppercase tracking-widest font-dm text-cc-orange">
          {isDaBu ? 'DaBu' : 'Hjemmestævne'} · {fmtDate(event.startsAt)} · {event.location}
        </div>
      </div>
      <h2 className="font-bebas text-2xl tracking-wide leading-tight text-cc-white">{event.title}</h2>

      <div className="mt-3">
        {fighters.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {fighters.map((f, i) => (
              <FighterPill key={`${f.name}-${f.weightClass}-${i}`} name={f.name} weightClass={f.weightClass} />
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-cc-gray font-dm">Ingen kæmpere tilmeldt endnu</p>
        )}
      </div>

      {isAtLeast('trainer') && (
        <div className="mt-3">
          {addingFighter ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Kæmperens navn"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2 text-[12px] text-cc-white font-dm placeholder:text-cc-gray focus:outline-none focus:border-cc-orange"
              />
              <input
                type="text"
                placeholder="Vægtklasse (f.eks. 64 kg)"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2 text-[12px] text-cc-white font-dm placeholder:text-cc-gray focus:outline-none focus:border-cc-orange"
              />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={addFighter}>Tilmeld</Button>
                <Button variant="ghost" size="sm" onClick={() => setAddingFighter(false)}>Annuller</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setAddingFighter(true)}>
              Tilmeld kæmper
            </Button>
          )}
        </div>
      )}

      <SupporterButton
        count={supporterCount}
        isSupporting={isSupporting}
        onToggle={toggleSupport}
      />

      <RideSection
        rides={rides}
        onBookRide={handleBookRide}
        bookedRideId={bookedRideId}
      />
    </div>
  )
}
