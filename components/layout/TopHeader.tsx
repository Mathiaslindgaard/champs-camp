'use client'
import Image from 'next/image'
import { Bell } from 'lucide-react'
import { useRole } from '@/lib/role-context'

export default function TopHeader() {
  const { roleLabel, cycleRole } = useRole()

  return (
    <header className="h-[52px] flex-shrink-0 flex items-center justify-between px-4 bg-cc-black-mid border-b border-cc-black-border">
      <Image
        src="/logo.png"
        alt="Champs Camp Aarhus"
        height={36}
        width={36}
        className="h-9 w-auto object-contain"
      />
      <div className="flex items-center gap-3">
        <button
          className="text-cc-gray hover:text-cc-white active:opacity-70 transition-colors min-h-0 p-1"
          aria-label="Notifikationer"
        >
          <Bell size={20} strokeWidth={1.5} />
        </button>
        <button
          onClick={cycleRole}
          className="bg-cc-orange text-cc-black text-[10px] font-bold px-2.5 py-1 rounded font-dm tracking-wider min-h-0 active:scale-95 transition-transform"
          aria-label="Skift demo-rolle"
        >
          {roleLabel}
        </button>
      </div>
    </header>
  )
}
