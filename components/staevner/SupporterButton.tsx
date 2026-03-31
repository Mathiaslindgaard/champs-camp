'use client'
import Button from '@/components/ui/Button'

interface Props {
  count: number
  isSupporting: boolean
  onToggle: () => void
}

export default function SupporterButton({ count, isSupporting, onToggle }: Props) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <Button
        variant={isSupporting ? 'ghost' : 'primary'}
        size="sm"
        onClick={onToggle}
      >
        {isSupporting ? 'Du deltager' : 'Støt holdet'}
      </Button>
      {count > 0 && (
        <span className="text-[11px] text-cc-gray font-dm">
          {count} støtter
        </span>
      )}
    </div>
  )
}
