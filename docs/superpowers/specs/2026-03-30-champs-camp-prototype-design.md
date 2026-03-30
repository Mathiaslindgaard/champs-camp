# Champs Camp Aarhus — Club Platform Prototype Design

**Date:** 2026-03-30
**Status:** Approved
**Goal:** Build a fully interactive prototype to validate the concept with the club before committing to a real backend.

---

## 1. Scope & Purpose

A mobile-first prototype of the Champs Camp Aarhus club platform — a replacement for Holdsport. The prototype is built to show the club what they'd be getting before any database work begins. If the club approves, the real backend (Supabase) is wired in as a second phase without rewriting the UI.

**In scope for prototype:**
- All 6 tabs fully designed and interactive
- Hardcoded mock data (the seed members, sessions, events from the PRD)
- Visual interactions using React `useState` (booking updates counts, shifts can be taken, secrets reveal on tap)
- Role switcher in header to demo member / volunteer / trainer / admin views
- Deployed to Vercel via GitHub

**Out of scope for prototype:**
- Supabase / any real database
- Authentication (no login screen)
- Data persistence across page refreshes
- Push notifications

---

## 2. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router), TypeScript strict mode |
| Styling | Tailwind CSS + CSS custom properties for brand tokens |
| Fonts | Bebas Neue (display) + DM Sans (body) via `next/font/google` |
| Data | Static TypeScript file `lib/mock-data.ts` |
| State | React `useState` per page — no global store needed |
| Deployment | Vercel, auto-deploy from GitHub |

---

## 3. Design System

### Color tokens (CSS custom properties)
```css
--cc-orange: #F5A623
--cc-orange-dark: #C47D0E
--cc-orange-light: rgba(245,166,35,0.10)
--cc-black: #0D0D0D
--cc-black-mid: #111111
--cc-black-card: #171717
--cc-black-border: #222222
--cc-white: #FFFFFF
--cc-gray: #555555
--cc-gray-light: #888888
--cc-red: #E03A3A
--cc-red-light: rgba(224,58,58,0.12)
--cc-green: #4CAF50
--cc-green-light: rgba(76,175,80,0.12)
```

### Typography rules
- **Bebas Neue** — session times, event titles, section counters, primary button text. Never body copy.
- **DM Sans** — everything else. 10px for card metadata, 600 weight for card titles.
- Large Bebas numbers: `font-size: clamp(2rem, 5vw, 3rem)`, tracking `0.02em`.

### Visual language
- Dark-first. `--cc-black` backgrounds, `--cc-black-card` for cards.
- Cards: `border: 1px solid var(--cc-black-border)`, `border-radius: 10px`.
- Active/important cards: `border-left: 2px solid var(--cc-orange)`.
- No gradients, no blurs, no box-shadows. Flat and industrial.
- No emojis in the UI. SVG icons (Lucide or inline) only.
- Badges use translucent backgrounds — `rgba()` not solid fills.
- All interactive elements have `:active` states (scale down slightly).

### Logo
- Source: `/Users/mathiaslindgaard/Downloads/19tii81qktc_champs-camp-logo-415.png`
- Copied to: `public/logo.png`
- Rendered in `TopHeader` at `height: 32px`, `width: auto`.

---

## 4. Layout Architecture

### Max width
`max-width: 430px; margin: 0 auto` on the root container — feels like a native mobile app on desktop too.

### TopHeader (sticky, top)
- Left: logo (`public/logo.png`)
- Right: bell icon (SVG, red dot if notifications) + role switcher pill (for prototype demo)
- Height: ~52px
- Background: `--cc-black-mid`, `border-bottom: 1px solid var(--cc-black-border)`

### BottomNav (sticky, bottom)
- 6 tabs: Kalender / Stævner / Vagter / Chat / Håndbog / Træner
- Active tab: orange icon + 3px orange dot below label
- Inactive: `--cc-gray` colour
- Safe area: `padding-bottom: env(safe-area-inset-bottom)`
- Height: ~56px + safe area

### PageWrapper
- `padding-top: 52px` (TopHeader height)
- `padding-bottom: calc(56px + env(safe-area-inset-bottom))`
- Scrollable content area between the two nav bars

---

## 5. File Structure

```
/app
  layout.tsx                   ← root layout, fonts, TopHeader, BottomNav
  page.tsx                     ← redirect → /kalender
  /kalender/page.tsx
  /staevner/page.tsx
  /vagter/page.tsx
  /chat
    page.tsx                   ← channel list
    /[channelId]/page.tsx      ← thread view
  /haandbog/page.tsx
  /generator/page.tsx

/components
  /layout
    TopHeader.tsx
    BottomNav.tsx
    PageWrapper.tsx
  /kalender
    TrainingCard.tsx
    DayHeader.tsx
    BookingModal.tsx
  /staevner
    EventCard.tsx
    FighterPill.tsx
    RideSection.tsx
    SupporterButton.tsx
  /vagter
    ShiftCard.tsx
    ShiftSellModal.tsx
  /chat
    ChannelList.tsx
    ChannelItem.tsx
    ChatThread.tsx
    MessageBubble.tsx
    MessageInput.tsx
  /haandbog
    HandbookSection.tsx
    SecretEntry.tsx
    AccordionEntry.tsx
  /generator
    WorkoutForm.tsx
    WorkoutPlan.tsx
    WorkoutBlock.tsx
  /ui
    Badge.tsx
    Button.tsx
    Modal.tsx

/lib
  mock-data.ts                 ← all seed data, typed
  types.ts                     ← shared TypeScript interfaces
  role-context.tsx             ← React context for current demo role
  workout-generator.ts         ← pure function: type + duration → plan blocks

/public
  logo.png
```

---

## 6. Mock Data (`lib/mock-data.ts`)

All data is typed and hardcoded. Exports:

- `MEMBERS: Profile[]` — 8 people (Mathias admin, Thomas trainer, Sofie trainer, Kristian volunteer, Lucas/Emil/Sara/Anders members)
- `SESSIONS: Session[]` — next 14 days, recurring schedule
- `BOOKINGS: Booking[]` — some sessions pre-booked
- `SHIFTS: Shift[]` — some assigned, one urgent/available
- `EVENTS: Event[]` — Fyns Open (fighters: Lucas 64kg, Emil 75kg), Jyllandsmesterskab
- `CHANNELS: Channel[]` — 5 channels with pre-seeded messages
- `MESSAGES: Message[]` — realistic Danish conversation threads
- `HANDBOOK_ENTRIES: HandbookEntry[]` — alarm code, WiFi, guides, contacts

---

## 7. Role Switcher (Prototype-Only)

A small pill in the top-right of the header shows the current demo role:
`ADMIN` / `TRÆNER` / `FRIVILLIG` / `MEDLEM`

Tapping cycles through roles. All role-gated UI (FAB buttons, secret handbook entries, fighter registration) responds immediately. This is stored in `RoleContext` and consumed throughout the app.

---

## 8. Feature Behaviour (Prototype)

### Kalender
- Sessions grouped by day, next 14 days
- Tapping a card opens `BookingModal` (slide-up)
- "Tilmeld" → `useState` updates spot count and changes button to "Afmeld"
- "Vagt søges" badge on cards with no volunteer assigned
- FAB (plus button) visible for trainer/admin roles only — opens a non-functional "create session" modal with a "Kommer snart" message

### Stævner
- "Støt holdet" button: toggles to "Du deltager" on tap, increments supporter count
- Fighter pills shown for registered fighters
- "Tilmeld kæmper" visible for trainer/admin — opens modal, adds a fighter pill on confirm
- Ride section: collapsible, shows dummy rides, "Book plads" decrements seat count

### Vagter
- "Tage vagten" → removes shift from "Søges nu", adds to "Mine vagter"
- "Vis interesse" → button changes to "Interesse registreret"
- "Sælg vagt" → opens `ShiftSellModal`, marks shift as available (moves to søges list)

### Chat
- Channel list with unread counts
- Thread view: pre-seeded messages, user can type and send (appends to local state)
- No real-time — typing in one browser tab doesn't appear in another

### Håndbog
- Secret entries: tap → reveal `secret_value` in large Bebas Neue, auto-hide after 30 seconds
- Role check: member role sees "Kræver frivillig adgang" instead of the reveal
- Non-secret: tap to expand accordion

### Træningsgenerator
- Two dropdowns: Træningstype (4 options) + Varighed (60/90/120 min)
- "GENERÉR TRÆNING" button → renders workout blocks from `workout-generator.ts`
- Pure function, no state needed beyond the form selections

---

## 9. Build Order

1. **Project setup** — Next.js 14, TypeScript, Tailwind, fonts, CSS vars, logo
2. **Layout shell** — `TopHeader`, `BottomNav`, `PageWrapper`, role switcher, routing
3. **Mock data + types** — `lib/types.ts`, `lib/mock-data.ts`
4. **Kalender** — session list, day headers, booking modal
5. **Vagter** — shift cards, take/sell flow
6. **Stævner** — event cards, fighter pills, supporter button, ride section
7. **Chat** — channel list, thread view, message input
8. **Håndbog** — accordion, secret reveal, role gating
9. **Træningsgenerator** — form + output
10. **Polish** — mobile viewport, safe areas, touch targets, deploy to Vercel

---

## 10. Deployment

- GitHub repo: `champs-camp-aarhus` (new, public or private)
- Vercel: connect repo, zero config (Next.js auto-detected)
- Share the Vercel preview URL with the club to try on their phones

---

## Phase 2 (After Club Approval)

- Create Supabase project, run schema from PRD
- Replace `lib/mock-data.ts` imports with `supabase.from(...).select()` calls
- Add Supabase Auth (email/password + magic link)
- Remove role switcher, implement real RLS
- Add Supabase Realtime for booking counts and chat
- Set up notification table and in-app panel
