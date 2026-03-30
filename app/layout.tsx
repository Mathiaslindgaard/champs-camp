import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { RoleProvider } from '@/lib/role-context'
import TopHeader from '@/components/layout/TopHeader'
import BottomNav from '@/components/layout/BottomNav'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Champs Camp Aarhus',
  description: 'Klubplatform for Champs Camp Aarhus bokseklub',
}

export const viewport = 'width=device-width, initial-scale=1, viewport-fit=cover'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body>
        <RoleProvider>
          <div className="app-shell">
            <TopHeader />
            <main className="app-content">
              {children}
            </main>
            <BottomNav />
          </div>
        </RoleProvider>
      </body>
    </html>
  )
}
