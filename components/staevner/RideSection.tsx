'use client'
import { useState } from 'react'
import { Ride } from '@/lib/types'
import Button from '@/components/ui/Button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  rides: Ride[]
  onBookRide: (rideId: string) => void
  bookedRideId: string | null
}

export default function RideSection({ rides, onBookRide, bookedRideId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4 border-t border-cc-black-border pt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-[11px] font-semibold uppercase tracking-widest text-cc-gray font-dm min-h-0"
      >
        <span>Kørsel ({rides.length})</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {rides.length === 0 && (
            <p className="text-[12px] text-cc-gray font-dm">Ingen kørsel oprettet endnu</p>
          )}
          {rides.map(ride => {
            const seatsLeft = ride.seatsTotal - ride.seatsTaken
            const isBooked = bookedRideId === ride.id
            return (
              <div
                key={ride.id}
                className="bg-cc-black rounded-xl border border-cc-black-border p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold font-dm text-cc-white">{ride.driverName}</div>
                  <div className="text-[11px] text-cc-gray font-dm mt-0.5">
                    {ride.departureTime} · {ride.departureLocation} · {ride.seatsTaken}/{ride.seatsTotal} pladser
                  </div>
                </div>
                <Button
                  variant={isBooked ? 'ghost' : seatsLeft === 0 ? 'ghost' : 'outline'}
                  size="sm"
                  disabled={seatsLeft === 0 && !isBooked}
                  onClick={() => onBookRide(ride.id)}
                >
                  {isBooked ? 'Booket' : seatsLeft === 0 ? 'Fuldt' : 'Book plads'}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
