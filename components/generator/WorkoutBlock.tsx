import { WorkoutBlock as WB } from '@/lib/types'

interface Props {
  block: WB
}

export default function WorkoutBlock({ block }: Props) {
  const isFirst = block.order === 1
  return (
    <div className="flex gap-3 items-center bg-cc-black-card border border-cc-black-border rounded-xl p-3">
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bebas text-[15px] flex-shrink-0 ${
          isFirst
            ? 'bg-cc-orange text-cc-black'
            : 'bg-cc-black border border-cc-black-border text-cc-gray'
        }`}
      >
        {block.order}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-cc-white font-dm">
          {block.name}
        </div>
        {block.description && (
          <div className="text-[11px] text-cc-gray font-dm mt-0.5">
            {block.description}
          </div>
        )}
      </div>
      <div className="text-[11px] text-cc-gray font-dm flex-shrink-0">
        {block.durationMin} min
      </div>
    </div>
  )
}
