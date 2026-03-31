'use client'
import { useState } from 'react'
import { generateWorkout, TrainingType, Duration } from '@/lib/workout-generator'
import { WorkoutBlock } from '@/lib/types'
import WorkoutPlan from './WorkoutPlan'
import Button from '@/components/ui/Button'

const TYPES: { value: TrainingType; label: string }[] = [
  { value: 'motions', label: 'Motionshold' },
  { value: 'teknisk', label: 'Teknisk træning' },
  { value: 'kamp', label: 'Kampboksning' },
  { value: 'ungdom', label: 'Ungdomshold' },
]

const DURATIONS: { value: Duration; label: string }[] = [
  { value: 60, label: '60 minutter' },
  { value: 90, label: '90 minutter' },
  { value: 120, label: '120 minutter' },
]

export default function WorkoutForm() {
  const [type, setType] = useState<TrainingType>('motions')
  const [duration, setDuration] = useState<Duration>(90)
  const [plan, setPlan] = useState<WorkoutBlock[] | null>(null)

  function generate() {
    setPlan(generateWorkout(type, duration))
  }

  return (
    <div>
      <div className="bg-cc-black-card border border-cc-black-border rounded-xl p-4 space-y-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Træningstype
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value as TrainingType)}
            className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2.5 text-[13px] text-cc-white font-dm focus:outline-none focus:border-cc-orange appearance-none"
          >
            {TYPES.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Varighed
          </label>
          <select
            value={duration}
            onChange={e => setDuration(Number(e.target.value) as Duration)}
            className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2.5 text-[13px] text-cc-white font-dm focus:outline-none focus:border-cc-orange appearance-none"
          >
            {DURATIONS.map(d => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full justify-center font-bebas text-xl tracking-[0.1em]"
          onClick={generate}
        >
          GENERÉR TRÆNING
        </Button>
      </div>

      {plan && <WorkoutPlan blocks={plan} />}
    </div>
  )
}
