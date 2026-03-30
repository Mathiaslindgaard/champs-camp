# Champs Camp Aarhus — Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive Next.js 14 prototype of the Champs Camp Aarhus club platform with hardcoded mock data, deployable to Vercel, covering all 6 tabs.

**Architecture:** Next.js 14 App Router with TypeScript. All data lives in `lib/mock-data.ts` as static typed constants — no database, no auth. UI state is managed with React `useState` per page so interactions (booking, shift take/sell, secret reveal) respond visually within a session. A `RoleContext` provides a demo role switcher so the club can see all permission levels during the demo.

**Tech Stack:** Next.js 14, TypeScript (strict), Tailwind CSS, `next/font/google` (Bebas Neue + DM Sans), lucide-react (icons), Vercel (deploy)

---

## File Map

```
/app
  layout.tsx                     ← root layout: RoleProvider, TopHeader, BottomNav
  page.tsx                       ← redirect to /kalender
  /kalender/page.tsx             ← training calendar with booking
  /staevner/page.tsx             ← competition events
  /vagter/page.tsx               ← volunteer shifts
  /chat/page.tsx                 ← channel list
  /chat/[channelId]/page.tsx     ← chat thread
  /haandbog/page.tsx             ← club handbook
  /generator/page.tsx            ← workout generator

/components
  /layout
    TopHeader.tsx                ← logo + bell + role switcher pill
    BottomNav.tsx                ← 6-tab nav, active state from usePathname
  /kalender
    DayHeader.tsx                ← formatted Danish date label
    TrainingCard.tsx             ← session card with time, type, badge, tap handler
    BookingModal.tsx             ← slide-up modal: session detail + tilmeld button
  /staevner
    FighterPill.tsx              ← name + weight class pill
    SupporterButton.tsx          ← toggle: "Støt holdet" → "Du deltager"
    RideSection.tsx              ← collapsible ride list with Book plads
    EventCard.tsx                ← full event card composing above components
  /vagter
    ShiftCard.tsx                ← shift card with urgency styling + action buttons
    ShiftSellModal.tsx           ← modal: urgency select + note + confirm
  /chat
    ChannelItem.tsx              ← single channel row with unread badge
    MessageBubble.tsx            ← chat bubble (mine=right+orange, theirs=left+dark)
    MessageInput.tsx             ← sticky input bar
    ChatThread.tsx               ← message list + input, real-time-like append
  /haandbog
    SecretEntry.tsx              ← lock icon → reveal + 30s auto-hide
    AccordionEntry.tsx           ← tap to expand/collapse
    HandbookSection.tsx          ← section label + list of entries
  /generator
    WorkoutBlock.tsx             ← numbered block with name + duration
    WorkoutPlan.tsx              ← renders list of WorkoutBlocks
    WorkoutForm.tsx              ← dropdowns + generate button
  /ui
    Badge.tsx                    ← status badge (green/amber/red variants)
    Button.tsx                   ← primary (orange fill) and outline variants
    Modal.tsx                    ← slide-up overlay with backdrop

/lib
  types.ts                       ← all shared TypeScript interfaces
  mock-data.ts                   ← all seed data, dates generated relative to now()
  role-context.tsx               ← RoleProvider + useRole hook
  workout-generator.ts           ← pure fn: (type, duration) → WorkoutBlock[]
  utils.ts                       ← formatDanishDate, groupByDay helpers

/public
  logo.png                       ← copied from Downloads
```

---

## Task 1: Initialize Project

**Files:**
- Create: entire Next.js 14 scaffold in `champs-camp-aarhus/`
- Modify: `tailwind.config.ts` — add brand color + font tokens
- Modify: `app/globals.css` — CSS custom properties + app-shell layout
- Copy: `public/logo.png` from Downloads

- [ ] **Step 1: Scaffold Next.js 14 inside the existing directory**

```bash
cd /Users/mathiaslindgaard/projects/websites/champs-camp-aarhus
npx create-next-app@14 . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
```

When prompted about the existing directory, press `y`. When asked about other options, accept defaults (no `src/` dir, `@/*` alias).

Expected output ends with: `Success! Created champs-camp-aarhus`

- [ ] **Step 2: Install lucide-react**

```bash
npm install lucide-react
```

- [ ] **Step 3: Copy logo**

```bash
cp "/Users/mathiaslindgaard/Downloads/19tii81qktc_champs-camp-logo-415.png" public/logo.png
```

- [ ] **Step 4: Replace `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cc-orange':       'var(--cc-orange)',
        'cc-orange-dark':  'var(--cc-orange-dark)',
        'cc-orange-light': 'var(--cc-orange-light)',
        'cc-black':        'var(--cc-black)',
        'cc-black-mid':    'var(--cc-black-mid)',
        'cc-black-card':   'var(--cc-black-card)',
        'cc-black-border': 'var(--cc-black-border)',
        'cc-gray':         'var(--cc-gray)',
        'cc-gray-light':   'var(--cc-gray-light)',
        'cc-red':          'var(--cc-red)',
        'cc-red-light':    'var(--cc-red-light)',
        'cc-green':        'var(--cc-green)',
        'cc-green-light':  'var(--cc-green-light)',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        dm:    ['var(--font-dm)',    'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Replace `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cc-orange:       #F5A623;
  --cc-orange-dark:  #C47D0E;
  --cc-orange-light: rgba(245, 166, 35, 0.10);
  --cc-black:        #0D0D0D;
  --cc-black-mid:    #111111;
  --cc-black-card:   #171717;
  --cc-black-border: #222222;
  --cc-white:        #FFFFFF;
  --cc-gray:         #555555;
  --cc-gray-light:   #888888;
  --cc-red:          #E03A3A;
  --cc-red-light:    rgba(224, 58, 58, 0.12);
  --cc-green:        #4CAF50;
  --cc-green-light:  rgba(76, 175, 80, 0.12);
}

*, *::before, *::after { box-sizing: border-box; }

html, body { height: 100%; }

body {
  background-color: var(--cc-black);
  color: var(--cc-white);
  font-family: var(--font-dm), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  margin: 0;
}

/* Mobile app shell — header + scrollable content + nav */
.app-shell {
  max-width: 430px;
  margin: 0 auto;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--cc-black);
  position: relative;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 16px;
}

/* Ensure tappable elements meet 44px minimum */
button, a { min-height: 44px; display: inline-flex; align-items: center; }
nav a { min-height: unset; }
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:3000. Expected: default Next.js page loads without errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 with brand design system"
```

---

## Task 2: Types, Mock Data, and Utilities

**Files:**
- Create: `lib/types.ts`
- Create: `lib/utils.ts`
- Create: `lib/mock-data.ts`
- Create: `lib/role-context.tsx`
- Create: `lib/workout-generator.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```ts
export type Role = 'admin' | 'trainer' | 'volunteer' | 'member'
export type SessionType = 'motions' | 'teknisk' | 'kamp' | 'ungdom'
export type Urgency = 'normal' | 'urgent'
export type HandbookCategory = 'koder' | 'vejledninger' | 'kontakter' | 'regler'

export interface Profile {
  id: string
  name: string
  initials: string
  role: Role
}

export interface Session {
  id: string
  title: string
  type: SessionType
  trainer: string
  location: string
  startsAt: Date
  endsAt: Date
  maxParticipants: number
  requiresVolunteer: boolean
  volunteerAssigned: boolean
  bookedCount: number
}

export interface Booking {
  sessionId: string
  userId: string
}

export interface Shift {
  id: string
  assignedTo: string
  isAvailable: boolean
  urgency: Urgency
  note?: string
  sessionTitle: string
  sessionDate: Date
  sessionTimeLabel: string
}

export interface Fighter {
  name: string
  weightClass: string
}

export interface Ride {
  id: string
  driverName: string
  seatsTotal: number
  seatsTaken: number
  departureTime: string
  departureLocation: string
}

export interface Event {
  id: string
  title: string
  location: string
  startsAt: Date
  source: 'dabu' | 'club'
  fighters: Fighter[]
  supporterCount: number
  rides: Ride[]
}

export interface Channel {
  id: string
  name: string
  initials: string
  unreadCount: number
}

export interface Message {
  id: string
  channelId: string
  senderName: string
  senderInitials: string
  content: string
  createdAt: Date
  isCurrentUser: boolean
}

export interface HandbookEntry {
  id: string
  category: HandbookCategory
  title: string
  content?: string
  secretValue?: string
  isSecret: boolean
}

export interface WorkoutBlock {
  order: number
  name: string
  description: string
  durationMin: number
}
```

- [ ] **Step 2: Create `lib/utils.ts`**

```ts
import { Session } from './types'

export function formatDanishDate(date: Date): string {
  const s = new Intl.DateTimeFormat('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function groupSessionsByDay(sessions: Session[]): [string, Session[]][] {
  const map = new Map<string, Session[]>()
  for (const s of sessions) {
    const key = s.startsAt.toDateString()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  return Array.from(map.entries())
}
```

- [ ] **Step 3: Create `lib/mock-data.ts`**

```ts
import {
  Profile, Session, Booking, Shift, Event, Channel, Message, HandbookEntry,
} from './types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysFrom(days: number, h: number, m: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(h, m, 0, 0)
  return d
}

// Return offset (in days from today) for next occurrence of a weekday
// weekday: 0=Sun, 1=Mon, ... 6=Sat
function nextWeekday(weekday: number, weeksOffset = 0): number {
  const today = new Date().getDay()
  const diff = ((weekday - today + 7) % 7) + weeksOffset * 7
  return diff === 0 ? 7 : diff // if today, push to next week
}

// ─── Members ─────────────────────────────────────────────────────────────────

export const MEMBERS: Profile[] = [
  { id: 'mathias', name: 'Mathias L.', initials: 'ML', role: 'admin' },
  { id: 'thomas',  name: 'Thomas B.',  initials: 'TB', role: 'trainer' },
  { id: 'sofie',   name: 'Sofie M.',   initials: 'SM', role: 'trainer' },
  { id: 'kristian',name: 'Kristian T.',initials: 'KT', role: 'volunteer' },
  { id: 'lucas',   name: 'Lucas N.',   initials: 'LN', role: 'member' },
  { id: 'emil',    name: 'Emil R.',    initials: 'ER', role: 'member' },
  { id: 'sara',    name: 'Sara K.',    initials: 'SK', role: 'member' },
  { id: 'anders',  name: 'Anders P.',  initials: 'AP', role: 'member' },
]

export const CURRENT_USER_ID = 'mathias'

// ─── Sessions (next 14 days) ──────────────────────────────────────────────────

let sid = 1
function makeSession(
  type: Session['type'],
  title: string,
  trainer: string,
  daysOffset: number,
  startH: number,
  startM: number,
  durationH: number,
  bookedCount: number,
  maxParticipants: number,
  requiresVolunteer: boolean,
  volunteerAssigned: boolean,
): Session {
  return {
    id: `s${sid++}`,
    title,
    type,
    trainer,
    location: 'Hal 1',
    startsAt: daysFrom(daysOffset, startH, startM),
    endsAt: daysFrom(daysOffset, startH + durationH, startM),
    maxParticipants,
    requiresVolunteer,
    volunteerAssigned,
    bookedCount,
  }
}

// Recurring schedule: Mon/Thu = Motions+Kamp, Tue/Thu = Teknisk, Tue+Sat = Ungdom
// nextWeekday(1)=Mon, (2)=Tue, (3)=Wed, (4)=Thu, (6)=Sat
export const SESSIONS: Session[] = [
  // Week 1
  makeSession('motions',  'Motionshold',     'Thomas B.', nextWeekday(1),   17, 30, 2, 8,  20, true,  true),
  makeSession('kamp',     'Kampboksning',    'Sofie M.',  nextWeekday(1),   19,  0, 2, 5,  12, true,  false),
  makeSession('teknisk',  'Teknisk træning', 'Thomas B.', nextWeekday(2),   17, 30, 2, 12, 12, false, false),
  makeSession('ungdom',   'Ungdomshold',     'Sofie M.',  nextWeekday(2),   18,  0, 1, 5,  15, false, false),
  makeSession('kamp',     'Kampboksning',    'Sofie M.',  nextWeekday(3),   19,  0, 2, 6,  12, true,  true),
  makeSession('motions',  'Motionshold',     'Thomas B.', nextWeekday(4),   17, 30, 2, 15, 20, true,  true),
  makeSession('teknisk',  'Teknisk træning', 'Thomas B.', nextWeekday(4),   17, 30, 2, 12, 12, false, false),
  makeSession('ungdom',   'Ungdomshold',     'Sofie M.',  nextWeekday(6),   10,  0, 1, 8,  15, false, false),
  // Week 2
  makeSession('motions',  'Motionshold',     'Thomas B.', nextWeekday(1,1), 17, 30, 2, 3,  20, true,  false),
  makeSession('kamp',     'Kampboksning',    'Sofie M.',  nextWeekday(1,1), 19,  0, 2, 4,  12, true,  false),
  makeSession('teknisk',  'Teknisk træning', 'Thomas B.', nextWeekday(2,1), 17, 30, 2, 9,  12, false, false),
  makeSession('ungdom',   'Ungdomshold',     'Sofie M.',  nextWeekday(2,1), 18,  0, 1, 3,  15, false, false),
  makeSession('kamp',     'Kampboksning',    'Sofie M.',  nextWeekday(3,1), 19,  0, 2, 2,  12, true,  true),
  makeSession('motions',  'Motionshold',     'Thomas B.', nextWeekday(4,1), 17, 30, 2, 7,  20, true,  true),
  makeSession('teknisk',  'Teknisk træning', 'Thomas B.', nextWeekday(4,1), 17, 30, 2, 11, 12, false, false),
  makeSession('ungdom',   'Ungdomshold',     'Sofie M.',  nextWeekday(6,1), 10,  0, 1, 6,  15, false, false),
].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

// ─── Bookings (Mathias is booked into the first motionshold) ─────────────────

export const INITIAL_BOOKINGS: Booking[] = [
  { sessionId: SESSIONS[0].id, userId: 'mathias' },
  { sessionId: SESSIONS[2].id, userId: 'mathias' },
]

// ─── Shifts ───────────────────────────────────────────────────────────────────

export const SHIFTS: Shift[] = [
  {
    id: 'sh1',
    assignedTo: 'Kristian T.',
    isAvailable: true,
    urgency: 'urgent',
    note: 'Har tandlæge, skal skiftes hurtigst muligt',
    sessionTitle: 'Motionshold',
    sessionDate: daysFrom(nextWeekday(4), 17, 30),
    sessionTimeLabel: '17:30–19:30',
  },
  {
    id: 'sh2',
    assignedTo: 'Anders P.',
    isAvailable: true,
    urgency: 'normal',
    note: undefined,
    sessionTitle: 'Kampboksning',
    sessionDate: daysFrom(nextWeekday(1, 1), 19, 0),
    sessionTimeLabel: '19:00–21:00',
  },
  {
    id: 'sh3',
    assignedTo: 'mathias',
    isAvailable: false,
    urgency: 'normal',
    sessionTitle: 'Teknisk træning',
    sessionDate: daysFrom(nextWeekday(2), 17, 30),
    sessionTimeLabel: '17:30–19:30',
  },
]

// ─── Events ───────────────────────────────────────────────────────────────────

export const EVENTS: Event[] = [
  {
    id: 'ev1',
    title: 'FYNS OPEN CHAMPIONSHIP',
    location: 'Odense',
    startsAt: daysFrom(13, 9, 0),
    source: 'dabu',
    fighters: [
      { name: 'Lucas N.', weightClass: '64 kg' },
      { name: 'Emil R.',  weightClass: '75 kg' },
    ],
    supporterCount: 4,
    rides: [
      { id: 'r1', driverName: 'Thomas B.',   seatsTotal: 4, seatsTaken: 2, departureTime: '07:00', departureLocation: 'Hallen' },
      { id: 'r2', driverName: 'Kristian T.', seatsTotal: 3, seatsTaken: 1, departureTime: '07:30', departureLocation: 'Banegården' },
    ],
  },
  {
    id: 'ev2',
    title: 'JYLLANDSMESTERSKAB',
    location: 'Aarhus',
    startsAt: daysFrom(34, 9, 0),
    source: 'club',
    fighters: [],
    supporterCount: 0,
    rides: [],
  },
]

// ─── Channels ─────────────────────────────────────────────────────────────────

export const CHANNELS: Channel[] = [
  { id: 'motions',      name: 'Motionshold',    initials: 'MH', unreadCount: 3 },
  { id: 'kamp',         name: 'Kampboksning',   initials: 'KB', unreadCount: 1 },
  { id: 'frivillige',   name: 'Frivillige',     initials: 'FV', unreadCount: 0 },
  { id: 'bestyrelse',   name: 'Klubbestyrelse', initials: 'KL', unreadCount: 0 },
  { id: 'ungdom',       name: 'Ungdomshold',    initials: 'UH', unreadCount: 0 },
]

// ─── Messages ─────────────────────────────────────────────────────────────────

function minsAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 1000)
}

export const MESSAGES: Message[] = [
  // Motionshold
  { id: 'm1', channelId: 'motions', senderName: 'Thomas B.',  senderInitials: 'TB', content: 'Husk at tage wraps med i morgen — vi kører fokuspads hele anden halvdel', createdAt: minsAgo(62),  isCurrentUser: false },
  { id: 'm2', channelId: 'motions', senderName: 'Sara K.',    senderInitials: 'SK', content: 'Tak for reminder! Har glemt dem 3 gange i træk 😅',                         createdAt: minsAgo(45),  isCurrentUser: false },
  { id: 'm3', channelId: 'motions', senderName: 'Mathias L.', senderInitials: 'ML', content: 'Jeg har et par ekstra par i skabet hvis nogen mangler',                       createdAt: minsAgo(30),  isCurrentUser: true  },
  // Kampboksning
  { id: 'm4', channelId: 'kamp',    senderName: 'Sofie M.',   senderInitials: 'SM', content: 'Sparring sker kl. 19 — vi starter med teknisk kontrol, ingen fuld kontakt',  createdAt: minsAgo(120), isCurrentUser: false },
  { id: 'm5', channelId: 'kamp',    senderName: 'Lucas N.',   senderInitials: 'LN', content: 'Perfekt, Emil og jeg glæder os',                                              createdAt: minsAgo(110), isCurrentUser: false },
  // Frivillige
  { id: 'm6', channelId: 'frivillige', senderName: 'Kristian T.', senderInitials: 'KT', content: 'Kan ikke torsdag — har tandlæge. Har lagt vagten op i Vagter-fanen',    createdAt: minsAgo(180), isCurrentUser: false },
  { id: 'm7', channelId: 'frivillige', senderName: 'Mathias L.', senderInitials: 'ML', content: 'Set — der er allerede en der har vist interesse',                          createdAt: minsAgo(170), isCurrentUser: true  },
  // Bestyrelse
  { id: 'm8', channelId: 'bestyrelse', senderName: 'Mathias L.', senderInitials: 'ML', content: 'Budget for Q2 er godkendt — vi har råd til nyt spejlglas i hal 1',        createdAt: minsAgo(300), isCurrentUser: true  },
  // Ungdom
  { id: 'm9', channelId: 'ungdom', senderName: 'Sofie M.',   senderInitials: 'SM', content: 'Stævne lørdag! Husk at børnene skal møde 30 min før — vi skal tape bandager', createdAt: minsAgo(200), isCurrentUser: false },
]

// ─── Handbook ─────────────────────────────────────────────────────────────────

export const HANDBOOK_ENTRIES: HandbookEntry[] = [
  { id: 'h1', category: 'koder',       title: 'Alarmkode',             isSecret: true,  secretValue: '4782' },
  { id: 'h2', category: 'koder',       title: 'WiFi — Hal 1',          isSecret: true,  secretValue: 'BoksAAR2024!' },
  { id: 'h3', category: 'koder',       title: 'Nøgleskab — kode',      isSecret: true,  secretValue: '9931' },
  {
    id: 'h4', category: 'vejledninger', title: 'Åbne & lukke hallen', isSecret: false,
    content: `**Åbning**\n1. Slå alarm fra med koden (se Koder)\n2. Tænd lys — lyskontakt til venstre for indgang\n3. Åbn vinduer i hal 1 hvis over 18°C\n4. Tjek at sandsækkene er ophængt korrekt\n\n**Lukning**\n1. Sluk lys i alle rum\n2. Tjek at ingen udstyr ligger fremme\n3. Luk alle vinduer\n4. Slå alarm til og luk dør`,
  },
  {
    id: 'h5', category: 'vejledninger', title: 'Førstehjælp', isSecret: false,
    content: `Hjertestarter hænger ved indgangen til hal 1.\n\nFørstehjælpskasse: skab i omklædningsrum (blå kasse).\n\nVed ulykke: ring 112 — giv adresse: **Sportsallé 12, 8000 Aarhus**`,
  },
  {
    id: 'h6', category: 'vejledninger', title: 'Opsætning af udstyr', isSecret: false,
    content: `Sandsækkene hænger på krogene — tjek at karabinhagerne er lukket.\nFokuspads ligger i den grå kasse ved siden af spejlet.\nHoppetov hænges på knagen ved døren efter brug.`,
  },
  {
    id: 'h7', category: 'kontakter', title: 'Formand — Mathias L.', isSecret: false,
    content: 'Tlf: +45 28 34 56 78\nEmail: mathias@champscampaarhus.dk',
  },
  {
    id: 'h8', category: 'kontakter', title: 'Cheftræner — Thomas B.', isSecret: false,
    content: 'Tlf: +45 31 23 45 67\nEmail: thomas@champscampaarhus.dk',
  },
  {
    id: 'h9', category: 'kontakter', title: 'DaBu — Dansk Amatørbokseforbund', isSecret: false,
    content: 'Tlf: +45 43 26 26 26\nWeb: dabu.dk\nKontaktperson: Kontorsekretær',
  },
  {
    id: 'h10', category: 'regler', title: 'Husregler', isSecret: false,
    content: `- Respekter alle uanset niveau\n- Rengør udstyr efter brug\n- Ingen mad eller drikkevarer i hallen (vand undtaget)\n- Brug altid handsker ved sandsæk\n- Meld afbud senest 2 timer før træning`,
  },
]
```

- [ ] **Step 4: Create `lib/role-context.tsx`**

```tsx
'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
import { Role } from './types'

const ROLES: Role[] = ['admin', 'trainer', 'volunteer', 'member']

const ROLE_LABELS: Record<Role, string> = {
  admin:     'ADMIN',
  trainer:   'TRÆNER',
  volunteer: 'FRIVILLIG',
  member:    'MEDLEM',
}

// Permission hierarchy: admin > trainer > volunteer > member
const ROLE_RANK: Record<Role, number> = {
  member: 0, volunteer: 1, trainer: 2, admin: 3,
}

interface RoleContextValue {
  role: Role
  roleLabel: string
  cycleRole: () => void
  isAtLeast: (min: Role) => boolean
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [idx, setIdx] = useState(0)
  const role = ROLES[idx]

  function cycleRole() {
    setIdx(i => (i + 1) % ROLES.length)
  }

  function isAtLeast(min: Role): boolean {
    return ROLE_RANK[role] >= ROLE_RANK[min]
  }

  return (
    <RoleContext.Provider value={{ role, roleLabel: ROLE_LABELS[role], cycleRole, isAtLeast }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
```

- [ ] **Step 5: Create `lib/workout-generator.ts`**

```ts
import { WorkoutBlock } from './types'

export type TrainingType = 'motions' | 'teknisk' | 'kamp' | 'ungdom'
export type Duration = 60 | 90 | 120

function scale(base: number, from: Duration, to: Duration): number {
  return Math.round((base / from) * to)
}

export function generateWorkout(type: TrainingType, duration: Duration): WorkoutBlock[] {
  switch (type) {
    case 'motions':
      return [
        { order: 1, name: 'Opvarmning',            description: 'Løb, spring, skyggeboks',     durationMin: scale(10, 90, duration) },
        { order: 2, name: 'Udstrækning & mobilitet',description: '',                             durationMin: scale(10, 90, duration) },
        { order: 3, name: 'Kombinationssekvenser',  description: 'Høj puls på pads/sandsæk',    durationMin: scale(15, 90, duration) },
        { order: 4, name: 'Teknik på sandsæk',      description: 'Middel intensitet',            durationMin: scale(15, 90, duration) },
        { order: 5, name: 'Styrkeblok',             description: 'Planke, burpees, squat',      durationMin: scale(10, 90, duration) },
        { order: 6, name: 'Sprint afslutning',      description: 'Intervalrunder',               durationMin: scale(5,  90, duration) },
        ...(duration === 120 ? [{ order: 7, name: 'Cool-down & stræk', description: '', durationMin: 15 }] : []),
      ]
    case 'teknisk':
      return [
        { order: 1, name: 'Opvarmning',          description: 'Skyggeboks',                     durationMin: scale(10, 90, duration) },
        { order: 2, name: 'Udstrækning',          description: '',                               durationMin: scale(10, 90, duration) },
        { order: 3, name: 'Par-øvelse',           description: 'Timing og afstand',             durationMin: scale(15, 90, duration) },
        { order: 4, name: 'Individuel teknik',    description: 'Dagens fokus med træner',        durationMin: scale(15, 90, duration) },
        { order: 5, name: 'Sandsæk',             description: 'Kombinationer',                  durationMin: scale(10, 90, duration) },
        ...(duration === 120 ? [{ order: 6, name: 'Sparring', description: 'Teknisk kontrol', durationMin: 20 }] : []),
      ]
    case 'kamp':
      return [
        { order: 1, name: 'Opvarmning',          description: 'Reb & skyggeboks',               durationMin: scale(10, 90, duration) },
        { order: 2, name: 'Handske-pad arbejde', description: 'Med træner',                     durationMin: scale(20, 90, duration) },
        { order: 3, name: 'Sparring',            description: 'Teknisk kontrol',                durationMin: scale(15, 90, duration) },
        { order: 4, name: 'Konditionsblok',      description: 'Intervalrunder',                 durationMin: scale(10, 90, duration) },
        { order: 5, name: 'Cool-down & analyse', description: 'Feedback fra træner',            durationMin: scale(5,  90, duration) },
      ]
    case 'ungdom':
      return [
        { order: 1, name: 'Lege-opvarmning',    description: 'Bevægelses- og reaktionslege',   durationMin: scale(10, 60, duration) },
        { order: 2, name: 'Koordination',       description: 'Balance og koordinationsøvelser', durationMin: scale(10, 60, duration) },
        { order: 3, name: 'Grundteknik',        description: 'Jab & kryds med korrekt fodstilling', durationMin: scale(15, 60, duration) },
        { order: 4, name: 'Sandsæk i par',      description: '',                               durationMin: scale(10, 60, duration) },
        { order: 5, name: 'Konkurrence-runde',  description: 'Sjov afsluttende aktivitet',     durationMin: scale(5,  60, duration) },
      ]
  }
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. Fix any type errors before proceeding.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add types, mock data, role context, and workout generator"
```

---

## Task 3: Layout Shell

**Files:**
- Create: `components/layout/TopHeader.tsx`
- Create: `components/layout/BottomNav.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/layout/TopHeader.tsx`**

```tsx
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
          className="text-cc-gray hover:text-cc-white transition-colors min-h-0 p-1"
          aria-label="Notifikationer"
        >
          <Bell size={20} strokeWidth={1.5} />
        </button>
        <button
          onClick={cycleRole}
          className="bg-cc-orange text-cc-black text-[10px] font-bold px-2.5 py-1 rounded font-dm tracking-wider min-h-0"
          title="Skift demo-rolle"
        >
          {roleLabel}
        </button>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create `components/layout/BottomNav.tsx`**

```tsx
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
```

- [ ] **Step 3: Replace `app/layout.tsx`**

```tsx
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
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
}

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
```

- [ ] **Step 4: Replace `app/page.tsx`**

```tsx
import { redirect } from 'next/navigation'
export default function Home() { redirect('/kalender') }
```

- [ ] **Step 5: Create placeholder pages so routing works**

Create each of these with the exact content shown (one file per command):

`app/kalender/page.tsx`:
```tsx
export default function KalenderPage() { return <div className="p-4 font-bebas text-4xl text-cc-orange">KALENDER</div> }
```

`app/staevner/page.tsx`:
```tsx
export default function StaevnerPage() { return <div className="p-4 font-bebas text-4xl text-cc-orange">STÆVNER</div> }
```

`app/vagter/page.tsx`:
```tsx
export default function VagterPage() { return <div className="p-4 font-bebas text-4xl text-cc-orange">VAGTER</div> }
```

`app/chat/page.tsx`:
```tsx
export default function ChatPage() { return <div className="p-4 font-bebas text-4xl text-cc-orange">CHAT</div> }
```

`app/haandbog/page.tsx`:
```tsx
export default function HaandbogPage() { return <div className="p-4 font-bebas text-4xl text-cc-orange">HÅNDBOG</div> }
```

`app/generator/page.tsx`:
```tsx
export default function GeneratorPage() { return <div className="p-4 font-bebas text-4xl text-cc-orange">TRÆNER</div> }
```

- [ ] **Step 6: Verify layout in browser**

```bash
npm run dev
```

Open http://localhost:3000. Expected:
- Redirects to `/kalender`
- Orange "KALENDER" heading visible
- Header shows logo and role pill (ADMIN)
- Bottom nav shows 6 tabs, Kalender tab is active (orange)
- Tapping role pill cycles ADMIN → TRÆNER → FRIVILLIG → MEDLEM

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add layout shell — header, bottom nav, routing"
```

---

## Task 4: Shared UI Components

**Files:**
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Modal.tsx`

- [ ] **Step 1: Create `components/ui/Badge.tsx`**

```tsx
interface Props {
  variant: 'green' | 'amber' | 'red' | 'gray'
  children: React.ReactNode
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
```

- [ ] **Step 2: Create `components/ui/Button.tsx`**

```tsx
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md'
}

const VARIANTS = {
  primary: 'bg-cc-orange text-cc-black font-bold hover:bg-cc-orange-dark active:scale-95',
  outline: 'border border-cc-orange/40 text-cc-orange hover:border-cc-orange active:scale-95',
  ghost:   'border border-cc-black-border text-cc-gray hover:text-cc-white active:scale-95',
}

const SIZES = {
  sm: 'text-[11px] px-3 py-1.5 rounded-lg',
  md: 'text-[13px] px-4 py-2.5 rounded-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`font-dm font-semibold transition-all min-h-0 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 3: Create `components/ui/Modal.tsx`**

```tsx
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
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Badge, Button, Modal UI primitives"
```

---

## Task 5: Kalender Page

**Files:**
- Create: `components/kalender/DayHeader.tsx`
- Create: `components/kalender/TrainingCard.tsx`
- Create: `components/kalender/BookingModal.tsx`
- Replace: `app/kalender/page.tsx`

- [ ] **Step 1: Create `components/kalender/DayHeader.tsx`**

```tsx
interface Props { date: Date }

export default function DayHeader({ date }: Props) {
  const label = new Intl.DateTimeFormat('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1)

  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mt-4 mb-2 first:mt-0">
      {capitalized}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/kalender/TrainingCard.tsx`**

```tsx
import { Session } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface Props {
  session: Session
  isBooked: boolean
  bookedCount: number
  onClick: () => void
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export default function TrainingCard({ session, isBooked, bookedCount, onClick }: Props) {
  const isFull = bookedCount >= session.maxParticipants
  const needsVolunteer = session.requiresVolunteer && !session.volunteerAssigned

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-cc-black-card border border-cc-black-border rounded-xl p-3 flex gap-3 items-start active:opacity-80 transition-opacity ${
        needsVolunteer ? 'border-l-2 border-l-cc-orange' : ''
      }`}
    >
      <span className="font-bebas text-2xl leading-none text-cc-white min-w-[46px]">
        {formatTime(session.startsAt)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-cc-white font-dm leading-tight">
          {session.title}
        </div>
        <div className="text-[11px] text-cc-gray font-dm mt-0.5">
          {session.location} · {session.trainer}
        </div>
        <div className="flex gap-1.5 flex-wrap mt-2">
          {isFull ? (
            <Badge variant="red">Fuldt</Badge>
          ) : (
            <Badge variant="green">{bookedCount} / {session.maxParticipants}</Badge>
          )}
          {needsVolunteer && <Badge variant="amber">Vagt søges</Badge>}
          {isBooked && <Badge variant="gray">Tilmeldt</Badge>}
        </div>
      </div>
    </button>
  )
}
```

- [ ] **Step 3: Create `components/kalender/BookingModal.tsx`**

```tsx
import { Session } from '@/lib/types'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface Props {
  session: Session | null
  isBooked: boolean
  bookedCount: number
  onClose: () => void
  onBook: () => void
  onCancel: () => void
}

function fmt(date: Date) {
  return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export default function BookingModal({
  session, isBooked, bookedCount, onClose, onBook, onCancel,
}: Props) {
  if (!session) return null
  const isFull = bookedCount >= session.maxParticipants && !isBooked

  return (
    <Modal isOpen={!!session} onClose={onClose} title={session.title}>
      {/* Detail rows */}
      <div className="space-y-2 mb-6">
        {[
          ['Tidspunkt', `${fmt(session.startsAt)} – ${fmt(session.endsAt)}`],
          ['Træner',    session.trainer],
          ['Sted',      session.location],
          ['Pladser',   `${bookedCount} / ${session.maxParticipants} tilmeldt`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between font-dm text-[13px]">
            <span className="text-cc-gray">{label}</span>
            <span className="text-cc-white font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      {isBooked ? (
        <Button variant="ghost" size="md" className="w-full justify-center" onClick={onCancel}>
          Afmeld
        </Button>
      ) : isFull ? (
        <Button variant="outline" size="md" className="w-full justify-center" onClick={onBook}>
          Skriv på venteliste
        </Button>
      ) : (
        <Button variant="primary" size="md" className="w-full justify-center font-bebas text-lg tracking-wider" onClick={onBook}>
          TILMELD DIG
        </Button>
      )}
    </Modal>
  )
}
```

- [ ] **Step 4: Replace `app/kalender/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { SESSIONS, INITIAL_BOOKINGS } from '@/lib/mock-data'
import { Session } from '@/lib/types'
import DayHeader from '@/components/kalender/DayHeader'
import TrainingCard from '@/components/kalender/TrainingCard'
import BookingModal from '@/components/kalender/BookingModal'

function groupByDay(sessions: Session[]): [string, Session[]][] {
  const map = new Map<string, Session[]>()
  for (const s of sessions) {
    const key = s.startsAt.toDateString()
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(s)
  }
  return Array.from(map.entries())
}

export default function KalenderPage() {
  const [bookedIds, setBookedIds] = useState<Set<string>>(
    new Set(INITIAL_BOOKINGS.map(b => b.sessionId))
  )
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(SESSIONS.map(s => [s.id, s.bookedCount]))
  )
  const [selected, setSelected] = useState<Session | null>(null)

  function handleBook() {
    if (!selected) return
    setBookedIds(prev => new Set([...prev, selected.id]))
    setCounts(prev => ({ ...prev, [selected.id]: (prev[selected.id] ?? 0) + 1 }))
    setSelected(null)
  }

  function handleCancel() {
    if (!selected) return
    setBookedIds(prev => { const next = new Set(prev); next.delete(selected.id); return next })
    setCounts(prev => ({ ...prev, [selected.id]: Math.max(0, (prev[selected.id] ?? 1) - 1) }))
    setSelected(null)
  }

  const days = groupByDay(SESSIONS)

  return (
    <>
      <div className="space-y-1">
        {days.map(([dayKey, sessions]) => (
          <div key={dayKey}>
            <DayHeader date={sessions[0].startsAt} />
            <div className="space-y-2">
              {sessions.map(s => (
                <TrainingCard
                  key={s.id}
                  session={s}
                  isBooked={bookedIds.has(s.id)}
                  bookedCount={counts[s.id] ?? s.bookedCount}
                  onClick={() => setSelected(s)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <BookingModal
        session={selected}
        isBooked={selected ? bookedIds.has(selected.id) : false}
        bookedCount={selected ? (counts[selected.id] ?? selected.bookedCount) : 0}
        onClose={() => setSelected(null)}
        onBook={handleBook}
        onCancel={handleCancel}
      />
    </>
  )
}
```

- [ ] **Step 5: Verify in browser**

Navigate to http://localhost:3000/kalender. Expected:
- Sessions grouped by day with Danish date headers
- Each card shows time in Bebas Neue, title, trainer, location, badge
- Cards with no volunteer show orange left border + "Vagt søges" badge
- Tapping a card opens slide-up modal
- "TILMELD DIG" increments the spot count and shows "Tilmeldt" badge
- Tapping the booked card shows "Afmeld" button

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement Kalender page with booking modal"
```

---

## Task 6: Vagter Page

**Files:**
- Create: `components/vagter/ShiftCard.tsx`
- Create: `components/vagter/ShiftSellModal.tsx`
- Replace: `app/vagter/page.tsx`

- [ ] **Step 1: Create `components/vagter/ShiftCard.tsx`**

```tsx
import { Shift } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

interface Props {
  shift: Shift
  mode: 'available' | 'mine'
  onTake?: () => void
  onInterest?: () => void
  onSell?: () => void
  hasInterest?: boolean
}

function fmtDate(date: Date): string {
  const s = new Intl.DateTimeFormat('da-DK', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function ShiftCard({ shift, mode, onTake, onInterest, onSell, hasInterest }: Props) {
  const urgent = shift.urgency === 'urgent'

  return (
    <div className={`bg-cc-black-card rounded-xl p-3.5 border ${
      urgent ? 'border-cc-red/30 border-l-2 border-l-cc-red' : 'border-cc-black-border'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[13px] text-cc-white font-dm">{shift.sessionTitle}</div>
          <div className="text-[11px] text-cc-gray font-dm mt-0.5">
            {fmtDate(shift.sessionDate)} · {shift.sessionTimeLabel}
          </div>
          {shift.note && (
            <div className="text-[11px] text-cc-gray-light font-dm mt-1 italic">"{shift.note}"</div>
          )}
        </div>
        {urgent && <Badge variant="red">Akut</Badge>}
      </div>

      {mode === 'available' && (
        <div className="flex gap-2 mt-3">
          {onTake && (
            <Button variant="primary" size="sm" onClick={onTake}>
              Tage vagten
            </Button>
          )}
          {onInterest && (
            <Button variant="outline" size="sm" onClick={onInterest} disabled={hasInterest}>
              {hasInterest ? 'Interesse registreret' : 'Vis interesse'}
            </Button>
          )}
        </div>
      )}

      {mode === 'mine' && onSell && (
        <div className="mt-3">
          <Button variant="ghost" size="sm" onClick={onSell}>
            Sælg vagt
          </Button>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create `components/vagter/ShiftSellModal.tsx`**

```tsx
'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Urgency } from '@/lib/types'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (urgency: Urgency, note: string) => void
}

export default function ShiftSellModal({ isOpen, onClose, onConfirm }: Props) {
  const [urgency, setUrgency] = useState<Urgency>('normal')
  const [note, setNote] = useState('')

  function handleConfirm() {
    onConfirm(urgency, note)
    setNote('')
    setUrgency('normal')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sælg vagt">
      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Haster det?
          </label>
          <div className="flex gap-2">
            {(['normal', 'urgent'] as Urgency[]).map(u => (
              <button
                key={u}
                onClick={() => setUrgency(u)}
                className={`flex-1 py-2 rounded-xl text-[12px] font-semibold font-dm border transition-colors min-h-0 ${
                  urgency === u
                    ? u === 'urgent'
                      ? 'bg-cc-red/20 border-cc-red text-cc-red'
                      : 'bg-cc-orange-light border-cc-orange text-cc-orange'
                    : 'border-cc-black-border text-cc-gray'
                }`}
              >
                {u === 'urgent' ? 'Akut' : 'Normal'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Note (valgfri)
          </label>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="F.eks. 'Har tandlæge…'"
            className="w-full bg-cc-black-card border border-cc-black-border rounded-xl px-3 py-2.5 text-[13px] text-cc-white font-dm placeholder:text-cc-gray focus:outline-none focus:border-cc-orange"
          />
        </div>

        <Button variant="primary" size="md" className="w-full justify-center font-bebas text-lg tracking-wider" onClick={handleConfirm}>
          LÆGG VAGT OP
        </Button>
      </div>
    </Modal>
  )
}
```

- [ ] **Step 3: Replace `app/vagter/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { SHIFTS } from '@/lib/mock-data'
import { Shift, Urgency } from '@/lib/types'
import ShiftCard from '@/components/vagter/ShiftCard'
import ShiftSellModal from '@/components/vagter/ShiftSellModal'
import { useRole } from '@/lib/role-context'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2 mt-4 first:mt-0">
      {children}
    </div>
  )
}

export default function VagterPage() {
  const { isAtLeast } = useRole()
  const [shifts, setShifts] = useState<Shift[]>(SHIFTS)
  const [interests, setInterests] = useState<Set<string>>(new Set())
  const [sellTarget, setSellTarget] = useState<string | null>(null)

  if (!isAtLeast('volunteer')) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
        <div className="font-bebas text-5xl text-cc-black-border">VAGTER</div>
        <p className="text-cc-gray text-[13px] font-dm">Kun synlig for frivillige og op</p>
      </div>
    )
  }

  const available = shifts.filter(s => s.isAvailable && s.assignedTo !== 'mathias')
  const urgent    = available.filter(s => s.urgency === 'urgent')
  const normal    = available.filter(s => s.urgency === 'normal')
  const mine      = shifts.filter(s => s.assignedTo === 'mathias' && !s.isAvailable)

  function takeShift(id: string) {
    setShifts(prev => prev.map(s =>
      s.id === id ? { ...s, isAvailable: false, assignedTo: 'mathias' } : s
    ))
  }

  function toggleInterest(id: string) {
    setInterests(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function sellShift(urgency: Urgency, note: string) {
    if (!sellTarget) return
    setShifts(prev => prev.map(s =>
      s.id === sellTarget ? { ...s, isAvailable: true, urgency, note } : s
    ))
    setSellTarget(null)
  }

  return (
    <>
      <div className="space-y-1">
        {urgent.length > 0 && (
          <>
            <SectionLabel>Akut — søges nu</SectionLabel>
            <div className="space-y-2">
              {urgent.map(s => (
                <ShiftCard key={s.id} shift={s} mode="available"
                  onTake={() => takeShift(s.id)}
                />
              ))}
            </div>
          </>
        )}

        {normal.length > 0 && (
          <>
            <SectionLabel>Vagter søges</SectionLabel>
            <div className="space-y-2">
              {normal.map(s => (
                <ShiftCard key={s.id} shift={s} mode="available"
                  onInterest={() => toggleInterest(s.id)}
                  hasInterest={interests.has(s.id)}
                />
              ))}
            </div>
          </>
        )}

        {mine.length > 0 && (
          <>
            <SectionLabel>Mine vagter</SectionLabel>
            <div className="space-y-2">
              {mine.map(s => (
                <ShiftCard key={s.id} shift={s} mode="mine"
                  onSell={() => setSellTarget(s.id)}
                />
              ))}
            </div>
          </>
        )}

        {urgent.length === 0 && normal.length === 0 && mine.length === 0 && (
          <p className="text-cc-gray text-[13px] font-dm text-center mt-12">
            Ingen vagter at vise
          </p>
        )}
      </div>

      <ShiftSellModal
        isOpen={!!sellTarget}
        onClose={() => setSellTarget(null)}
        onConfirm={sellShift}
      />
    </>
  )
}
```

- [ ] **Step 4: Verify in browser**

Navigate to http://localhost:3000/vagter. Expected:
- Akut section shows Kristian's shift with red border and "Akut" badge
- "Tage vagten" moves it to "Mine vagter"
- Normal shift shows "Vis interesse" → changes to "Interesse registreret"
- "Sælg vagt" opens modal with urgency + note → moves shift to available list
- Switching to MEDLEM role shows locked message

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: implement Vagter page with take/sell shift flow"
```

---

## Task 7: Stævner Page

**Files:**
- Create: `components/staevner/FighterPill.tsx`
- Create: `components/staevner/SupporterButton.tsx`
- Create: `components/staevner/RideSection.tsx`
- Create: `components/staevner/EventCard.tsx`
- Replace: `app/staevner/page.tsx`

- [ ] **Step 1: Create `components/staevner/FighterPill.tsx`**

```tsx
interface Props { name: string; weightClass: string }

export default function FighterPill({ name, weightClass }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-cc-orange-light border border-cc-orange/30 text-cc-orange rounded-full text-[11px] font-medium px-2.5 py-1 font-dm">
      {name} · {weightClass}
    </span>
  )
}
```

- [ ] **Step 2: Create `components/staevner/SupporterButton.tsx`**

```tsx
'use client'
import Button from '@/components/ui/Button'

interface Props {
  count: number
  isSupporting: boolean
  onToggle: () => void
}

export default function SupporterButton({ count, isSupporting, onToggle }: Props) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <Button
        variant={isSupporting ? 'ghost' : 'primary'}
        size="sm"
        onClick={onToggle}
      >
        {isSupporting ? 'Du deltager ✓' : 'Støt holdet'}
      </Button>
      {count > 0 && (
        <span className="text-[11px] text-cc-gray font-dm">
          {count} {count === 1 ? 'støtter' : 'støtter'}
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/staevner/RideSection.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { Ride } from '@/lib/types'
import Button from '@/components/ui/Button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  rides: Ride[]
  onBookRide: (rideId: string) => void
  bookedRideId: string | null
}

export default function RideSection({ rides, onBookRide, bookedRideId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-4 border-t border-cc-black-border pt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-[11px] font-semibold uppercase tracking-widest text-cc-gray font-dm min-h-0"
      >
        <span>Kørsel ({rides.length})</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {rides.length === 0 && (
            <p className="text-[12px] text-cc-gray font-dm">Ingen kørsel oprettet endnu</p>
          )}
          {rides.map(ride => {
            const seatsLeft = ride.seatsTotal - ride.seatsTaken
            const isBooked = bookedRideId === ride.id
            return (
              <div
                key={ride.id}
                className="bg-cc-black rounded-xl border border-cc-black-border p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold font-dm text-cc-white">{ride.driverName}</div>
                  <div className="text-[11px] text-cc-gray font-dm mt-0.5">
                    {ride.departureTime} · {ride.departureLocation} · {ride.seatsTaken}/{ride.seatsTotal} pladser
                  </div>
                </div>
                <Button
                  variant={isBooked ? 'ghost' : seatsLeft === 0 ? 'ghost' : 'outline'}
                  size="sm"
                  disabled={seatsLeft === 0 && !isBooked}
                  onClick={() => onBookRide(ride.id)}
                >
                  {isBooked ? 'Booket ✓' : seatsLeft === 0 ? 'Fuldt' : 'Book plads'}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create `components/staevner/EventCard.tsx`**

Note: `EventCard` manages all interactive state (booking, fighters, rides) — it must be a client component.

```tsx
'use client'
import { useState } from 'react'
import { Event, Fighter } from '@/lib/types'
import FighterPill from './FighterPill'
import SupporterButton from './SupporterButton'
import RideSection from './RideSection'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useRole } from '@/lib/role-context'

interface Props { event: Event }

function fmtDate(date: Date): string {
  const s = new Intl.DateTimeFormat('da-DK', { day: 'numeric', month: 'long' }).format(date)
  return s
}

export default function EventCard({ event }: Props) {
  const { isAtLeast } = useRole()
  const [fighters, setFighters] = useState<Fighter[]>(event.fighters)
  const [supporterCount, setSupporterCount] = useState(event.supporterCount)
  const [isSupporting, setIsSupporting] = useState(false)
  const [rides, setRides] = useState(event.rides)
  const [bookedRideId, setBookedRideId] = useState<string | null>(null)

  // Fighter add modal state (simple inline)
  const [addingFighter, setAddingFighter] = useState(false)
  const [newName, setNewName] = useState('')
  const [newWeight, setNewWeight] = useState('')

  function toggleSupport() {
    setSupporterCount(c => isSupporting ? c - 1 : c + 1)
    setIsSupporting(s => !s)
  }

  function handleBookRide(rideId: string) {
    if (bookedRideId === rideId) {
      setBookedRideId(null)
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, seatsTaken: r.seatsTaken - 1 } : r))
    } else {
      if (bookedRideId) {
        setRides(prev => prev.map(r => r.id === bookedRideId ? { ...r, seatsTaken: r.seatsTaken - 1 } : r))
      }
      setBookedRideId(rideId)
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, seatsTaken: r.seatsTaken + 1 } : r))
    }
  }

  function addFighter() {
    if (!newName || !newWeight) return
    setFighters(prev => [...prev, { name: newName, weightClass: newWeight }])
    setNewName('')
    setNewWeight('')
    setAddingFighter(false)
  }

  const isDaBu = event.source === 'dabu'

  return (
    <div className={`bg-cc-black-card rounded-xl border border-cc-black-border ${isDaBu ? 'border-l-2 border-l-cc-orange' : ''} p-4`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="text-[10px] font-semibold uppercase tracking-widest font-dm text-cc-orange">
          {isDaBu ? 'DaBu' : 'Hjemmestævne'} · {fmtDate(event.startsAt)} · {event.location}
        </div>
      </div>
      <h2 className="font-bebas text-2xl tracking-wide leading-tight text-cc-white">{event.title}</h2>

      {/* Fighters */}
      <div className="mt-3">
        {fighters.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {fighters.map((f, i) => (
              <FighterPill key={i} name={f.name} weightClass={f.weightClass} />
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-cc-gray font-dm">Ingen kæmpere tilmeldt endnu</p>
        )}
      </div>

      {/* Add fighter (trainer/admin) */}
      {isAtLeast('trainer') && (
        <div className="mt-3">
          {addingFighter ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Kæmperens navn"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2 text-[12px] text-cc-white font-dm placeholder:text-cc-gray focus:outline-none focus:border-cc-orange"
              />
              <input
                type="text"
                placeholder="Vægtklasse (f.eks. 64 kg)"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2 text-[12px] text-cc-white font-dm placeholder:text-cc-gray focus:outline-none focus:border-cc-orange"
              />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={addFighter}>Tilmeld</Button>
                <Button variant="ghost" size="sm" onClick={() => setAddingFighter(false)}>Annuller</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setAddingFighter(true)}>
              Tilmeld kæmper
            </Button>
          )}
        </div>
      )}

      {/* Supporter button */}
      <SupporterButton
        count={supporterCount}
        isSupporting={isSupporting}
        onToggle={toggleSupport}
      />

      {/* Rides */}
      <RideSection
        rides={rides}
        onBookRide={handleBookRide}
        bookedRideId={bookedRideId}
      />
    </div>
  )
}
```

- [ ] **Step 5: Replace `app/staevner/page.tsx`**

```tsx
import { EVENTS } from '@/lib/mock-data'
import EventCard from '@/components/staevner/EventCard'

export default function StaevnerPage() {
  return (
    <div className="space-y-4">
      {EVENTS.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
```

Note: `StaevnerPage` itself is a server component. `EventCard` is a client component and handles all interactive state.

- [ ] **Step 6: Verify in browser**

Navigate to http://localhost:3000/staevner. Expected:
- Two event cards, first with orange left border (DaBu)
- Fighter pills for Fyns Open
- "Støt holdet" toggles to "Du deltager ✓"
- Kørsel section expands, "Book plads" decrements seats
- Switching to TRÆNER/ADMIN shows "Tilmeld kæmper" inline form

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: implement Stævner page with event cards, fighter pills, ride sharing"
```

---

## Task 8: Chat Pages

**Files:**
- Create: `components/chat/ChannelItem.tsx`
- Create: `components/chat/MessageBubble.tsx`
- Create: `components/chat/MessageInput.tsx`
- Create: `components/chat/ChatThread.tsx`
- Replace: `app/chat/page.tsx`
- Create: `app/chat/[channelId]/page.tsx`

- [ ] **Step 1: Create `components/chat/ChannelItem.tsx`**

```tsx
import Link from 'next/link'
import { Channel, Message } from '@/lib/types'

interface Props {
  channel: Channel
  lastMessage?: Message
}

export default function ChannelItem({ channel, lastMessage }: Props) {
  const preview = lastMessage
    ? `${lastMessage.senderName.split(' ')[0]}: ${lastMessage.content}`
    : 'Ingen beskeder endnu'

  return (
    <Link
      href={`/chat/${channel.id}`}
      className="flex items-center gap-3 py-3 border-b border-cc-black-border last:border-b-0 active:opacity-70 transition-opacity min-h-0"
    >
      <div className="w-10 h-10 rounded-full bg-cc-black-card border border-cc-black-border flex items-center justify-center font-bebas text-[13px] text-cc-gray-light flex-shrink-0">
        {channel.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-cc-white font-dm">{channel.name}</div>
        <div className="text-[11px] text-cc-gray font-dm mt-0.5 truncate">{preview}</div>
      </div>
      {channel.unreadCount > 0 && (
        <div className="bg-cc-orange text-cc-black text-[10px] font-bold rounded-full px-2 py-0.5 flex-shrink-0 font-dm">
          {channel.unreadCount}
        </div>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create `components/chat/MessageBubble.tsx`**

```tsx
import { Message } from '@/lib/types'

interface Props { message: Message }

function fmtTime(date: Date): string {
  return new Intl.DateTimeFormat('da-DK', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export default function MessageBubble({ message }: Props) {
  const mine = message.isCurrentUser
  return (
    <div className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : 'flex-row'}`}>
      {!mine && (
        <div className="w-7 h-7 rounded-full bg-cc-black-card border border-cc-black-border flex items-center justify-center text-[10px] font-bebas text-cc-gray flex-shrink-0 mb-0.5">
          {message.senderInitials}
        </div>
      )}
      <div className={`max-w-[75%] ${mine ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
        {!mine && (
          <span className="text-[10px] text-cc-gray font-dm ml-1">{message.senderName.split(' ')[0]}</span>
        )}
        <div className={`px-3 py-2 rounded-2xl text-[13px] font-dm leading-snug ${
          mine
            ? 'bg-cc-orange text-cc-black rounded-br-sm font-medium'
            : 'bg-cc-black-card border border-cc-black-border text-cc-white rounded-bl-sm'
        }`}>
          {message.content}
        </div>
        <span className="text-[10px] text-cc-gray font-dm mx-1">{fmtTime(message.createdAt)}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/chat/MessageInput.tsx`**

```tsx
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
        className="w-9 h-9 rounded-xl bg-cc-orange flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all min-h-0"
      >
        <Send size={16} className="text-cc-black" />
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/chat/ChatThread.tsx`**

```tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { Message } from '@/lib/types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface Props {
  channelId: string
  initialMessages: Message[]
}

export default function ChatThread({ channelId, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(text: string) {
    setMessages(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        channelId,
        senderName: 'Mathias L.',
        senderInitials: 'ML',
        content: text,
        createdAt: new Date(),
        isCurrentUser: true,
      },
    ])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
        <div ref={bottomRef} />
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  )
}
```

- [ ] **Step 5: Replace `app/chat/page.tsx`**

```tsx
import { CHANNELS, MESSAGES } from '@/lib/mock-data'
import ChannelItem from '@/components/chat/ChannelItem'

export default function ChatPage() {
  return (
    <div className="divide-y divide-cc-black-border">
      {CHANNELS.map(channel => {
        const channelMessages = MESSAGES.filter(m => m.channelId === channel.id)
        const lastMessage = channelMessages.at(-1)
        return (
          <ChannelItem key={channel.id} channel={channel} lastMessage={lastMessage} />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: Create `app/chat/[channelId]/page.tsx`**

This is a server component — no `'use client'`. It resolves the channel and passes data to the `ChatThread` client component.

The thread view needs to fill the available space between header and nav, and the message input must stick to the bottom. Use negative margins to break out of `app-content`'s 16px padding, then set an explicit height:

```tsx
import { notFound } from 'next/navigation'
import { CHANNELS, MESSAGES } from '@/lib/mock-data'
import ChatThread from '@/components/chat/ChatThread'

interface Props { params: { channelId: string } }

export default function ChatThreadPage({ params }: Props) {
  const channel = CHANNELS.find(c => c.id === params.channelId)
  if (!channel) notFound()

  const messages = MESSAGES.filter(m => m.channelId === channel.id)

  return (
    // Break out of app-content's padding and fill remaining viewport height
    <div
      className="-mx-4 -mt-4 flex flex-col bg-cc-black"
      style={{ height: 'calc(100dvh - 52px - 56px - env(safe-area-inset-bottom))' }}
    >
      {/* Channel name bar */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-cc-black-border bg-cc-black-mid">
        <div className="font-semibold text-[14px] text-cc-white font-dm">{channel.name}</div>
      </div>
      <ChatThread channelId={channel.id} initialMessages={messages} />
    </div>
  )
}
```

- [ ] **Step 7: Verify in browser**

Navigate to http://localhost:3000/chat. Expected:
- Channel list with unread badges
- Tapping a channel opens thread view
- Pre-seeded messages show: mine (right, orange), theirs (left, dark)
- Typing and pressing Enter/send appends a new orange bubble
- Page scrolls to bottom on new message

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: implement Chat pages — channel list and thread view"
```

---

## Task 9: Håndbog Page

**Files:**
- Create: `components/haandbog/SecretEntry.tsx`
- Create: `components/haandbog/AccordionEntry.tsx`
- Create: `components/haandbog/HandbookSection.tsx`
- Replace: `app/haandbog/page.tsx`

- [ ] **Step 1: Create `components/haandbog/SecretEntry.tsx`**

```tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useRole } from '@/lib/role-context'

interface Props {
  title: string
  secretValue: string
}

export default function SecretEntry({ title, secretValue }: Props) {
  const { isAtLeast } = useRole()
  const [revealed, setRevealed] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function reveal() {
    if (!isAtLeast('volunteer')) return
    setRevealed(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setRevealed(false), 30_000)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  if (!isAtLeast('volunteer')) {
    return (
      <div className="bg-cc-black-card border border-cc-black-border rounded-xl p-3.5 flex items-center justify-between gap-3">
        <div>
          <div className="text-[13px] font-semibold text-cc-white font-dm">{title}</div>
          <div className="text-[11px] text-cc-gray font-dm mt-0.5">Kræver frivillig adgang</div>
        </div>
        <Lock size={16} className="text-cc-gray flex-shrink-0" />
      </div>
    )
  }

  return (
    <button
      onClick={reveal}
      className="w-full text-left bg-cc-black-card border border-cc-black-border rounded-xl p-3.5 active:opacity-70 transition-opacity"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-cc-white font-dm">{title}</div>
          {revealed ? (
            <div className="font-bebas text-3xl text-cc-orange tracking-widest mt-1">{secretValue}</div>
          ) : (
            <div className="text-[11px] text-cc-gray font-dm mt-0.5">Tryk for at vise</div>
          )}
        </div>
        {revealed
          ? <Unlock size={16} className="text-cc-orange flex-shrink-0" />
          : <Lock size={16} className="text-cc-gray flex-shrink-0" />
        }
      </div>
      {revealed && (
        <div className="text-[10px] text-cc-gray font-dm mt-2">Skjuler automatisk om 30 sek.</div>
      )}
    </button>
  )
}
```

- [ ] **Step 2: Create `components/haandbog/AccordionEntry.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Props { title: string; content: string }

export default function AccordionEntry({ title, content }: Props) {
  const [open, setOpen] = useState(false)

  // Render simple markdown: **bold**, newlines, - bullets
  function renderContent(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('- ')) {
        return <li key={i} className="text-cc-gray-light">{line.slice(2)}</li>
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      return (
        <p key={i} className="text-cc-gray-light">
          {parts.map((p, j) =>
            p.startsWith('**') && p.endsWith('**')
              ? <strong key={j} className="text-cc-white font-semibold">{p.slice(2, -2)}</strong>
              : p
          )}
        </p>
      )
    })
  }

  return (
    <div className="bg-cc-black-card border border-cc-black-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3.5 py-3 min-h-0 active:opacity-70"
      >
        <span className="text-[13px] font-semibold text-cc-white font-dm">{title}</span>
        {open
          ? <ChevronDown size={16} className="text-cc-orange flex-shrink-0" />
          : <ChevronRight size={16} className="text-cc-gray flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-3.5 pb-4 border-t border-cc-black-border pt-3 text-[12px] font-dm leading-relaxed space-y-1">
          <ul className="list-none space-y-0.5">
            {renderContent(content)}
          </ul>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/haandbog/HandbookSection.tsx`**

```tsx
import { HandbookEntry } from '@/lib/types'
import SecretEntry from './SecretEntry'
import AccordionEntry from './AccordionEntry'

interface Props {
  label: string
  entries: HandbookEntry[]
}

export default function HandbookSection({ label, entries }: Props) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2 mt-4 first:mt-0">
        {label}
      </div>
      <div className="space-y-2">
        {entries.map(entry =>
          entry.isSecret ? (
            <SecretEntry key={entry.id} title={entry.title} secretValue={entry.secretValue!} />
          ) : (
            <AccordionEntry key={entry.id} title={entry.title} content={entry.content ?? ''} />
          )
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Replace `app/haandbog/page.tsx`**

```tsx
import { HANDBOOK_ENTRIES } from '@/lib/mock-data'
import { HandbookCategory } from '@/lib/types'
import HandbookSection from '@/components/haandbog/HandbookSection'

const CATEGORY_LABELS: Record<HandbookCategory, string> = {
  koder:       'Koder & adgang',
  vejledninger:'Vejledninger',
  kontakter:   'Kontakter',
  regler:      'Regler',
}

const CATEGORY_ORDER: HandbookCategory[] = ['koder', 'vejledninger', 'kontakter', 'regler']

export default function HaandbogPage() {
  return (
    <div className="space-y-1">
      {CATEGORY_ORDER.map(cat => {
        const entries = HANDBOOK_ENTRIES.filter(e => e.category === cat)
        if (entries.length === 0) return null
        return (
          <HandbookSection key={cat} label={CATEGORY_LABELS[cat]} entries={entries} />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

Navigate to http://localhost:3000/haandbog. Expected:
- "Koder & adgang" section shows lock icons
- With ADMIN role: tapping "Alarmkode" reveals "4782" in large Bebas Neue, auto-hides after 30s
- With MEDLEM role: shows "Kræver frivillig adgang"
- Vejledninger entries expand/collapse on tap
- Kontakter and Regler expand normally

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement Håndbog page with secret reveal and accordion"
```

---

## Task 10: Træningsgenerator Page

**Files:**
- Create: `components/generator/WorkoutBlock.tsx`
- Create: `components/generator/WorkoutPlan.tsx`
- Create: `components/generator/WorkoutForm.tsx`
- Replace: `app/generator/page.tsx`

- [ ] **Step 1: Create `components/generator/WorkoutBlock.tsx`**

```tsx
import { WorkoutBlock as WB } from '@/lib/types'

interface Props { block: WB; total: number }

export default function WorkoutBlock({ block, total }: Props) {
  const isFirst = block.order === 1
  return (
    <div className="flex gap-3 items-center bg-cc-black-card border border-cc-black-border rounded-xl p-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bebas text-[15px] flex-shrink-0 ${
        isFirst ? 'bg-cc-orange text-cc-black' : 'bg-cc-black border border-cc-black-border text-cc-gray'
      }`}>
        {block.order}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-cc-white font-dm">{block.name}</div>
        {block.description && (
          <div className="text-[11px] text-cc-gray font-dm mt-0.5">{block.description}</div>
        )}
      </div>
      <div className="text-[11px] text-cc-gray font-dm flex-shrink-0">
        {block.durationMin} min
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `components/generator/WorkoutPlan.tsx`**

```tsx
import { WorkoutBlock as WB } from '@/lib/types'
import WorkoutBlock from './WorkoutBlock'

interface Props { blocks: WB[] }

export default function WorkoutPlan({ blocks }: Props) {
  const totalMin = blocks.reduce((sum, b) => sum + b.durationMin, 0)
  return (
    <div>
      <div className="flex items-center justify-between mb-3 mt-5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm">
          Dagens plan
        </div>
        <div className="text-[10px] text-cc-gray font-dm">{totalMin} min total</div>
      </div>
      <div className="space-y-2">
        {blocks.map(b => (
          <WorkoutBlock key={b.order} block={b} total={blocks.length} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/generator/WorkoutForm.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { generateWorkout, TrainingType, Duration } from '@/lib/workout-generator'
import { WorkoutBlock } from '@/lib/types'
import WorkoutPlan from './WorkoutPlan'
import Button from '@/components/ui/Button'

const TYPES: { value: TrainingType; label: string }[] = [
  { value: 'motions',  label: 'Motionshold' },
  { value: 'teknisk',  label: 'Teknisk træning' },
  { value: 'kamp',     label: 'Kampboksning' },
  { value: 'ungdom',   label: 'Ungdomshold' },
]

const DURATIONS: { value: Duration; label: string }[] = [
  { value: 60,  label: '60 minutter' },
  { value: 90,  label: '90 minutter' },
  { value: 120, label: '120 minutter' },
]

export default function WorkoutForm() {
  const [type, setType] = useState<TrainingType>('motions')
  const [duration, setDuration] = useState<Duration>(90)
  const [plan, setPlan] = useState<WorkoutBlock[] | null>(null)

  function generate() {
    setPlan(generateWorkout(type, duration))
  }

  return (
    <div>
      <div className="bg-cc-black-card border border-cc-black-border rounded-xl p-4 space-y-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Træningstype
          </label>
          <select
            value={type}
            onChange={e => setType(e.target.value as TrainingType)}
            className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2.5 text-[13px] text-cc-white font-dm focus:outline-none focus:border-cc-orange appearance-none"
          >
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-widest text-cc-gray font-dm mb-2">
            Varighed
          </label>
          <select
            value={duration}
            onChange={e => setDuration(Number(e.target.value) as Duration)}
            className="w-full bg-cc-black border border-cc-black-border rounded-xl px-3 py-2.5 text-[13px] text-cc-white font-dm focus:outline-none focus:border-cc-orange appearance-none"
          >
            {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>

        <Button
          variant="primary"
          size="md"
          className="w-full justify-center font-bebas text-xl tracking-[0.1em]"
          onClick={generate}
        >
          GENERÉR TRÆNING
        </Button>
      </div>

      {plan && <WorkoutPlan blocks={plan} />}
    </div>
  )
}
```

- [ ] **Step 4: Replace `app/generator/page.tsx`**

```tsx
import WorkoutForm from '@/components/generator/WorkoutForm'

export default function GeneratorPage() {
  return <WorkoutForm />
}
```

- [ ] **Step 5: Verify in browser**

Navigate to http://localhost:3000/generator. Expected:
- Two dropdowns for type and duration
- "GENERÉR TRÆNING" in large Bebas Neue on orange button
- Clicking generates a numbered plan with durations
- Changing type/duration and re-generating updates the plan
- Total duration shown at top of plan

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: implement Træningsgenerator page"
```

---

## Task 11: Polish and Deploy

**Files:**
- Modify: `app/layout.tsx` — add `viewport` meta and manifest
- Modify: `app/globals.css` — touch target and scroll fixes
- Create: `.gitignore` additions
- Setup: GitHub repo + Vercel deploy

- [ ] **Step 1: Fix `app/layout.tsx` viewport metadata**

Replace the `metadata` export and add viewport export:

```tsx
export const metadata: Metadata = {
  title: 'Champs Camp Aarhus',
  description: 'Klubplatform for Champs Camp Aarhus bokseklub',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}
```

(Remove `viewport` from the metadata object — Next.js 14 separates it.)

- [ ] **Step 2: Check touch targets and spacing across all pages**

Open http://localhost:3000 on a mobile device or in Chrome DevTools mobile simulation (iPhone 14 Pro, 390px width). Walk through each tab:

- All buttons should be at least 44px tall — verify the nav items, cards, and CTA buttons
- Cards should have enough padding that tapping feels comfortable
- The bottom nav should not be obscured on iPhone (safe area should push it up)
- Modals should not be cut off on small screens

Fix any issues found:
- If nav items feel cramped: increase `font-size` or padding in `BottomNav.tsx`
- If cards are too dense: increase `py-` on `TrainingCard` or `ShiftCard`

- [ ] **Step 3: Add `.superpowers` to `.gitignore`**

Open `.gitignore` and add:

```
# Superpowers brainstorm files
.superpowers/
```

- [ ] **Step 4: Do a final TypeScript check**

```bash
npx tsc --noEmit
```

Expected: 0 errors. Fix any before proceeding.

- [ ] **Step 5: Create GitHub repository and push**

```bash
gh repo create champs-camp-aarhus --private --source=. --remote=origin --push
```

If `gh` is not installed: create the repo at github.com manually, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/champs-camp-aarhus.git
git push -u origin main
```

- [ ] **Step 6: Deploy to Vercel**

Go to https://vercel.com/new, import the `champs-camp-aarhus` repository. Vercel auto-detects Next.js — click Deploy with default settings.

Once deployed, copy the preview URL (e.g., `https://champs-camp-aarhus.vercel.app`).

- [ ] **Step 7: Test on a real phone**

Open the Vercel URL on an iPhone or Android. Verify:
- The app fits within the phone viewport (no horizontal scroll)
- Bottom nav is above the home indicator on iPhone
- Tap targets feel natural
- Fonts load correctly (Bebas Neue + DM Sans)
- All 6 tabs are reachable and interactive

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "feat: polish mobile viewport, deploy to Vercel"
git push
```

---

## Self-Review Checklist

- [x] All 6 tabs implemented: Kalender, Stævner, Vagter, Chat, Håndbog, Træningsgenerator
- [x] Role switcher in header, all role gates verified
- [x] Booking modal with Tilmeld / Afmeld / Venteliste
- [x] Shift take, interest, and sell flows
- [x] Fighter pills, supporter toggle, ride section
- [x] Chat thread with real-time-like append
- [x] Secret reveal with 30s auto-hide
- [x] Accordion entries
- [x] Workout generator with all 4 training types and 3 durations
- [x] Logo copied from Downloads
- [x] Dark theme, orange accents, no emojis, Bebas Neue + DM Sans
- [x] Deployed to Vercel
