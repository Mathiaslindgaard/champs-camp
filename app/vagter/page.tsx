'use client'
import { useState } from 'react'
import { SHIFTS } from '@/lib/mock-data'
import { Shift, Urgency } from '@/lib/types'
import ShiftCard from '@/components/vagter/ShiftCard'
import ShiftSellModal from '@/components/vagter/ShiftSellModal'
import { useRole } from '@/lib/role-context'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2 mt-4 first:mt-0">
      {children}
    </div>
  )
}

export default function VagterPage() {
  const { isAtLeast } = useRole()
  const [shifts, setShifts] = useState<Shift[]>(SHIFTS)
  const [interests, setInterests] = useState<Set<string>>(new Set())
  const [sellTarget, setSellTarget] = useState<string | null>(null)

  if (!isAtLeast('volunteer')) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
        <div className="font-bebas text-5xl text-cc-black-border">VAGTER</div>
        <p className="text-cc-gray text-[13px] font-dm">Kun synlig for frivillige og op</p>
      </div>
    )
  }

  const available = shifts.filter(s => s.isAvailable && s.assignedTo !== 'mathias')
  const urgent    = available.filter(s => s.urgency === 'urgent')
  const normal    = available.filter(s => s.urgency === 'normal')
  const mine      = shifts.filter(s => s.assignedTo === 'mathias' && !s.isAvailable)

  function takeShift(id: string) {
    setShifts(prev => prev.map(s =>
      s.id === id ? { ...s, isAvailable: false, assignedTo: 'mathias' } : s
    ))
  }

  function toggleInterest(id: string) {
    setInterests(prev => { const n = new Set(prev); if (n.has(id)) { n.delete(id) } else { n.add(id) } return n })
  }

  function sellShift(urgency: Urgency, note: string) {
    if (!sellTarget) return
    setShifts(prev => prev.map(s =>
      s.id === sellTarget ? { ...s, isAvailable: true, urgency, note } : s
    ))
    setSellTarget(null)
  }

  return (
    <>
      <div className="space-y-1">
        {urgent.length > 0 && (
          <>
            <SectionLabel>Akut — søges nu</SectionLabel>
            <div className="space-y-2">
              {urgent.map(s => (
                <ShiftCard key={s.id} shift={s} mode="available"
                  onTake={() => takeShift(s.id)}
                />
              ))}
            </div>
          </>
        )}

        {normal.length > 0 && (
          <>
            <SectionLabel>Vagter søges</SectionLabel>
            <div className="space-y-2">
              {normal.map(s => (
                <ShiftCard key={s.id} shift={s} mode="available"
                  onInterest={() => toggleInterest(s.id)}
                  hasInterest={interests.has(s.id)}
                />
              ))}
            </div>
          </>
        )}

        {mine.length > 0 && (
          <>
            <SectionLabel>Mine vagter</SectionLabel>
            <div className="space-y-2">
              {mine.map(s => (
                <ShiftCard key={s.id} shift={s} mode="mine"
                  onSell={() => setSellTarget(s.id)}
                />
              ))}
            </div>
          </>
        )}

        {urgent.length === 0 && normal.length === 0 && mine.length === 0 && (
          <p className="text-cc-gray text-[13px] font-dm text-center mt-12">
            Ingen vagter at vise
          </p>
        )}
      </div>

      <ShiftSellModal
        isOpen={!!sellTarget}
        onClose={() => setSellTarget(null)}
        onConfirm={sellShift}
      />
    </>
  )
}
