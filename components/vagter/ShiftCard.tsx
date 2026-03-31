import { Shift } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Props {
  shift: Shift
  mode: 'available' | 'mine'
  onTake?: () => void
  onInterest?: () => void
  onSell?: () => void
  hasInterest?: boolean
}

function fmtDate(date: Date): string {
  const s = new Intl.DateTimeFormat('da-DK', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function ShiftCard({ shift, mode, onTake, onInterest, onSell, hasInterest }: Props) {
  const urgent = shift.urgency === 'urgent'

  return (
    <div className={`bg-cc-black-card rounded-xl p-3.5 border ${
      urgent ? 'border-cc-red/30 border-l-2 border-l-cc-red' : 'border-cc-black-border'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[13px] text-cc-white font-dm">{shift.sessionTitle}</div>
          <div className="text-[11px] text-cc-gray font-dm mt-0.5">
            {fmtDate(shift.sessionDate)} · {shift.sessionTimeLabel}
          </div>
          {shift.note && (
            <div className="text-[11px] text-cc-gray-light font-dm mt-1 italic">&ldquo;{shift.note}&rdquo;</div>
          )}
        </div>
        {urgent && <Badge variant="red">Akut</Badge>}
      </div>

      {mode === 'available' && (
        <div className="flex gap-2 mt-3">
          {onTake && (
            <Button variant="primary" size="sm" onClick={onTake}>
              Tage vagten
            </Button>
          )}
          {onInterest && (
            <Button variant="outline" size="sm" onClick={onInterest} disabled={hasInterest}>
              {hasInterest ? 'Interesse registreret' : 'Vis interesse'}
            </Button>
          )}
        </div>
      )}

      {mode === 'mine' && onSell && (
        <div className="mt-3">
          <Button variant="ghost" size="sm" onClick={onSell}>
            Sælg vagt
          </Button>
        </div>
      )}
    </div>
  )
}
