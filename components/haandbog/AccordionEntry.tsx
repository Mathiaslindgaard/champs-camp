'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { HandbookEntry } from '@/lib/types'

interface Props {
  entry: HandbookEntry
}

function renderMarkdown(raw: string): React.ReactNode[] {
  const lines = raw.split('\n')
  const nodes: React.ReactNode[] = []
  let listBuffer: string[] = []
  let keyCounter = 0

  function flushList() {
    if (listBuffer.length === 0) return
    nodes.push(
      <ul key={`ul-${keyCounter++}`} className="list-disc list-inside space-y-1 text-cc-gray-light text-[13px] font-dm leading-relaxed">
        {listBuffer.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed === '') {
      flushList()
      continue
    }

    if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.slice(2))
      continue
    }

    flushList()

    if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
      const text = trimmed.slice(2, -2)
      nodes.push(
        <strong key={`strong-${keyCounter++}`} className="block text-cc-white text-[13px] font-dm font-semibold mt-3 first:mt-0">
          {text}
        </strong>
      )
      continue
    }

    nodes.push(
      <p key={`p-${keyCounter++}`} className="text-cc-gray-light text-[13px] font-dm leading-relaxed">
        {trimmed}
      </p>
    )
  }

  flushList()
  return nodes
}

export default function AccordionEntry({ entry }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="py-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 text-left transition-[opacity] hover:opacity-80 active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cc-orange focus-visible:ring-offset-2 focus-visible:ring-offset-cc-black rounded-sm"
      >
        <span className="font-dm text-[14px] font-medium text-cc-white">{entry.title}</span>
        <span className="shrink-0 text-cc-gray">
          {open
            ? <ChevronDown size={16} strokeWidth={2} />
            : <ChevronRight size={16} strokeWidth={2} />
          }
        </span>
      </button>

      {open && entry.content && (
        <div className="mt-3 space-y-1.5">
          {renderMarkdown(entry.content)}
        </div>
      )}
    </div>
  )
}
