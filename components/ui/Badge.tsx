import type { ReactNode } from 'react'

interface Props {
  variant: 'green' | 'amber' | 'red' | 'gray'
  children: ReactNode
  className?: string
}

const STYLES = {
  green: 'bg-cc-green-light text-cc-green',
  amber: 'bg-cc-orange-light text-cc-orange',
  red:   'bg-cc-red-light   text-cc-red',
  gray:  'bg-white/5        text-cc-gray-light',
}

export default function Badge({ variant, children, className = '' }: Props) {
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded font-dm tracking-wide ${STYLES[variant]} ${className}`}>
      {children}
    </span>
  )
}
