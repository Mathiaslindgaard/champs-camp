'use client'
import { useEffect, useId, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[430px] bg-cc-black-mid rounded-t-2xl border-t border-x border-cc-black-border p-5 pb-8 max-h-[85dvh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id={titleId} className="font-bebas text-2xl tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Luk"
            className="text-cc-gray hover:text-cc-white active:opacity-70 transition-[color,opacity] p-1 min-h-0"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
