import { HANDBOOK_ENTRIES } from '@/lib/mock-data'
import type { HandbookCategory, HandbookEntry } from '@/lib/types'
import HandbookSection from '@/components/haandbog/HandbookSection'

const CATEGORY_ORDER: HandbookCategory[] = ['koder', 'vejledninger', 'kontakter', 'regler']

export default function HaandbogPage() {
  const grouped = CATEGORY_ORDER.reduce<Record<HandbookCategory, HandbookEntry[]>>(
    (acc, cat) => {
      acc[cat] = HANDBOOK_ENTRIES.filter(e => e.category === cat)
      return acc
    },
    { koder: [], vejledninger: [], kontakter: [], regler: [] },
  )

  return (
    <div className="px-4 py-5">
      <h1 className="font-bebas text-4xl tracking-wide text-cc-white mb-6">Håndbog</h1>

      {CATEGORY_ORDER.map(cat =>
        grouped[cat].length > 0 ? (
          <HandbookSection key={cat} category={cat} entries={grouped[cat]} />
        ) : null
      )}
    </div>
  )
}
