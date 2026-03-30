'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays, Trophy, RefreshCw, MessageSquare, BookOpen, Zap,
} from 'lucide-react'

const NAV = [
  { href: '/kalender',  label: 'Kalender', Icon: CalendarDays  },
  { href: '/staevner',  label: 'Stævner',  Icon: Trophy        },
  { href: '/vagter',    label: 'Vagter',   Icon: RefreshCw     },
  { href: '/chat',      label: 'Chat',     Icon: MessageSquare },
  { href: '/haandbog',  label: 'Håndbog',  Icon: BookOpen      },
  { href: '/generator', label: 'Træner',   Icon: Zap           },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="flex-shrink-0 bg-cc-black-mid border-t border-cc-black-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-14">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] font-medium min-h-0 transition-colors ${
                active ? 'text-cc-orange' : 'text-cc-gray'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              <span>{label}</span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-cc-orange mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
