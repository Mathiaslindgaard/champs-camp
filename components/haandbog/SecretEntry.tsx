'use client'
import { useState, useEffect, useRef } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useRole } from '@/lib/role-context'
import type { HandbookEntry } from '@/lib/types'

interface Props {
  entry: HandbookEntry
}

export default function SecretEntry({ entry }: Props) {
  const { isAtLeast } = useRole()
  const [revealed, setRevealed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearTimer() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function reveal() {
    setRevealed(true)
    clearTimer()
    timerRef.current = setTimeout(() => {
      setRevealed(false)
      timerRef.current = null
    }, 30_000)
  }

  function hide() {
    clearTimer()
    setRevealed(false)
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  const allowed = isAtLeast('volunteer')

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="font-dm text-[14px] font-medium text-cc-white">{entry.title}</span>

        {!allowed ? (
          <div className="flex items-center gap-1.5 text-cc-gray">
            <Lock size={13} strokeWidth={2} />
            <span className="font-dm text-[11px]">Kun for trænere og frivillige</span>
          </div>
        ) : (
          <button
            onClick={revealed ? hide : reveal}
            className={[
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5',
              'font-dm text-[12px] font-semibold',
              'transition-[background-color,color,transform,opacity]',
              revealed
                ? 'bg-cc-black-mid text-cc-gray hover:bg-cc-black-border hover:text-cc-white'
                : 'bg-cc-orange/10 text-cc-orange hover:bg-cc-orange/20',
              'active:scale-95 focus-visible:ring-2 focus-visible:ring-cc-orange focus-visible:ring-offset-2 focus-visible:ring-offset-cc-black',
            ].join(' ')}
          >
            {revealed ? (
              <>
                <Unlock size={12} strokeWidth={2} />
                Skjul
              </>
            ) : (
              <>
                <Lock size={12} strokeWidth={2} />
                Vis kode
              </>
            )}
          </button>
        )}
      </div>

      {allowed && revealed && (
        <div className="mt-2 pl-0">
          <span className="font-bebas text-3xl text-cc-orange tracking-wider">
            {entry.secretValue}
          </span>
        </div>
      )}
    </div>
  )
}
