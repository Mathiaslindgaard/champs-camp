import { WorkoutBlock as WB } from '@/lib/types'
import WorkoutBlock from './WorkoutBlock'

interface Props {
  blocks: WB[]
}

export default function WorkoutPlan({ blocks }: Props) {
  const totalMin = blocks.reduce((sum, b) => sum + b.durationMin, 0)
  return (
    <div>
      <div className="flex items-center justify-between mb-3 mt-5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm">
          Dagens plan
        </div>
        <div className="text-[10px] text-cc-gray font-dm">{totalMin} min total</div>
      </div>
      <div className="space-y-2">
        {blocks.map(b => (
          <WorkoutBlock key={b.order} block={b} total={blocks.length} />
        ))}
      </div>
    </div>
  )
}
