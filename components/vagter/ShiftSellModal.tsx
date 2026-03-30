'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Urgency } from '@/lib/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (urgency: Urgency, note: string) => void
}

export default function ShiftSellModal({ isOpen, onClose, onConfirm }: Props) {
  const [urgency, setUrgency] = useState<Urgency>('normal')
  const [note, setNote] = useState('')

  function handleConfirm() {
    onConfirm(urgency, note)
    setNote('')
    setUrgency('normal')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sælg vagt">
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Haster det?
          </label>
          <div className="flex gap-2">
            {(['normal', 'urgent'] as Urgency[]).map(u => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                className={`flex-1 py-2 rounded-xl text-[12px] font-semibold font-dm border transition-colors min-h-0 ${
                  urgency === u
                    ? u === 'urgent'
                      ? 'bg-cc-red/20 border-cc-red text-cc-red'
                      : 'bg-cc-orange-light border-cc-orange text-cc-orange'
                    : 'border-cc-black-border text-cc-gray'
                }`}
              >
                {u === 'urgent' ? 'Akut' : 'Normal'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Note (valgfri)
          </label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="F.eks. 'Har tandlæge…'"
            className="w-full bg-cc-black-card border border-cc-black-border rounded-xl px-3 py-2.5 text-[13px] text-cc-white font-dm placeholder:text-cc-gray focus:outline-none focus:border-cc-orange"
          />
        </div>

        <Button variant="primary" size="md" className="w-full justify-center font-bebas text-lg tracking-wider" onClick={handleConfirm}>
          LÆGG VAGT OP
        </Button>
      </div>
    </Modal>
  )
}
