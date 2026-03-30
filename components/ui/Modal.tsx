'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="relative w-full max-w-[430px] bg-cc-black-mid rounded-t-2xl border-t border-x border-cc-black-border p-5 pb-8 max-h-[85dvh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bebas text-2xl tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="text-cc-gray hover:text-cc-white p-1 min-h-0"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
