import { Session } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface Props {
  session: Session | null
  isBooked: boolean
  bookedCount: number
  onClose: () => void
  onBook: () => void
  onCancel: () => void
}

function fmt(date: Date) {
  return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export default function BookingModal({
  session, isBooked, bookedCount, onClose, onBook, onCancel,
}: Props) {
  if (!session) return null
  const isFull = bookedCount >= session.maxParticipants && !isBooked

  return (
    <Modal isOpen={!!session} onClose={onClose} title={session.title}>
      {/* Detail rows */}
      <div className="space-y-2 mb-6">
        {[
          ['Tidspunkt', `${fmt(session.startsAt)} – ${fmt(session.endsAt)}`],
          ['Træner',    session.trainer],
          ['Sted',      session.location],
          ['Pladser',   `${bookedCount} / ${session.maxParticipants} tilmeldt`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between font-dm text-[13px]">
            <span className="text-cc-gray">{label}</span>
            <span className="text-cc-white font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      {isBooked ? (
        <Button variant="ghost" size="md" className="w-full justify-center" onClick={onCancel}>
          Afmeld
        </Button>
      ) : isFull ? (
        <Button variant="outline" size="md" className="w-full justify-center" onClick={onBook}>
          Skriv på venteliste
        </Button>
      ) : (
        <Button variant="primary" size="md" className="w-full justify-center font-bebas text-lg tracking-wider" onClick={onBook}>
          TILMELD DIG
        </Button>
      )}
    </Modal>
  )
}
