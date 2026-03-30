import { Session } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface Props {
  session: Session
  isBooked: boolean
  bookedCount: number
  onClick: () => void
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export default function TrainingCard({ session, isBooked, bookedCount, onClick }: Props) {
  const isFull = bookedCount >= session.maxParticipants
  const needsVolunteer = session.requiresVolunteer && !session.volunteerAssigned

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-cc-black-card border border-cc-black-border rounded-xl p-3 flex gap-3 items-start hover:brightness-105 active:opacity-80 focus-visible:ring-2 focus-visible:ring-cc-orange focus-visible:ring-offset-1 focus-visible:ring-offset-cc-black transition-[opacity,filter] outline-none ${
        needsVolunteer ? 'border-l-2 border-l-cc-orange' : ''
      }`}
    >
      <span className="font-bebas text-2xl leading-none text-cc-white min-w-[46px]">
        {formatTime(session.startsAt)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-cc-white font-dm leading-tight">
          {session.title}
        </div>
        <div className="text-[11px] text-cc-gray font-dm mt-0.5">
          {session.location} · {session.trainer}
        </div>
        <div className="flex gap-1.5 flex-wrap mt-2">
          {isFull ? (
            <Badge variant="red">Fuldt</Badge>
          ) : (
            <Badge variant="green">{bookedCount} / {session.maxParticipants}</Badge>
          )}
          {needsVolunteer && <Badge variant="amber">Vagt søges</Badge>}
          {isBooked && <Badge variant="gray">Tilmeldt</Badge>}
        </div>
      </div>
    </button>
  )
}
