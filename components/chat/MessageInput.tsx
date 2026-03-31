'use client'
import { useState } from 'react'
import { Send } from 'lucide-react'

interface Props { onSend: (text: string) => void }

export default function MessageInput({ onSend }: Props) {
  const [text, setText] = useState('')

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-shrink-0 border-t border-cc-black-border bg-cc-black-mid px-3 py-2 flex gap-2 items-center"
         style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Skriv en besked…"
        className="flex-1 bg-cc-black-card border border-cc-black-border rounded-xl px-3 py-2 text-[13px] text-cc-white font-dm placeholder:text-cc-gray focus:outline-none focus:border-cc-orange min-h-0"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="w-9 h-9 rounded-xl bg-cc-orange flex items-center justify-center disabled:opacity-30 hover:bg-cc-orange-dark active:scale-95 focus-visible:ring-2 focus-visible:ring-cc-orange focus-visible:ring-offset-2 focus-visible:ring-offset-cc-black-mid transition-[background-color,transform,opacity] min-h-0"
      >
        <Send size={16} className="text-cc-black" />
      </button>
    </div>
  )
}
