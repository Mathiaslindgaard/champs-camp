import type { HandbookCategory, HandbookEntry } from '@/lib/types'
import SecretEntry from './SecretEntry'
import AccordionEntry from './AccordionEntry'

const CATEGORY_LABELS: Record<HandbookCategory, string> = {
  koder:       'Koder',
  vejledninger: 'Vejledninger',
  kontakter:   'Kontakter',
  regler:      'Regler',
}

interface Props {
  category: HandbookCategory
  entries: HandbookEntry[]
}

export default function HandbookSection({ category, entries }: Props) {
  return (
    <section className="mb-6">
      <h2 className="font-bebas text-xl tracking-wide text-cc-white mb-3">
        {CATEGORY_LABELS[category]}
      </h2>
      <div className="bg-cc-black-card rounded-xl border border-cc-black-border px-4">
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            className={idx < entries.length - 1 ? 'border-b border-cc-black-border' : ''}
          >
            {entry.isSecret
              ? <SecretEntry entry={entry} />
              : <AccordionEntry entry={entry} />
            }
          </div>
        ))}
      </div>
    </section>
  )
}
