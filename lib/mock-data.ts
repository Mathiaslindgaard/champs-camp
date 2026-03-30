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

export const INITIAL_BOOKINGS: Booking[] = [
  { sessionId: 's1', userId: 'mathias' }, // Motionshold week 1
  { sessionId: 's3', userId: 'mathias' }, // Teknisk træning week 1
]

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

export const CHANNELS: Channel[] = [
  { id: 'motions',    name: 'Motionshold',    initials: 'MH', unreadCount: 3 },
  { id: 'kamp',       name: 'Kampboksning',   initials: 'KB', unreadCount: 1 },
  { id: 'frivillige', name: 'Frivillige',     initials: 'FV', unreadCount: 0 },
  { id: 'bestyrelse', name: 'Klubbestyrelse', initials: 'KL', unreadCount: 0 },
  { id: 'ungdom',     name: 'Ungdomshold',    initials: 'UH', unreadCount: 0 },
]

function minsAgo(n: number): Date {
  return new Date(Date.now() - n * 60 * 1000)
}

export const MESSAGES: Message[] = [
  { id: 'm1', channelId: 'motions',    senderName: 'Thomas B.',   senderInitials: 'TB', content: 'Husk at tage wraps med i morgen — vi kører fokuspads hele anden halvdel', createdAt: minsAgo(62),  isCurrentUser: false },
  { id: 'm2', channelId: 'motions',    senderName: 'Sara K.',     senderInitials: 'SK', content: 'Tak for reminder! Har glemt dem 3 gange i træk 😅',                        createdAt: minsAgo(45),  isCurrentUser: false },
  { id: 'm3', channelId: 'motions',    senderName: 'Mathias L.',  senderInitials: 'ML', content: 'Jeg har et par ekstra par i skabet hvis nogen mangler',                      createdAt: minsAgo(30),  isCurrentUser: true  },
  { id: 'm4', channelId: 'kamp',       senderName: 'Sofie M.',    senderInitials: 'SM', content: 'Sparring sker kl. 19 — vi starter med teknisk kontrol, ingen fuld kontakt', createdAt: minsAgo(120), isCurrentUser: false },
  { id: 'm5', channelId: 'kamp',       senderName: 'Lucas N.',    senderInitials: 'LN', content: 'Perfekt, Emil og jeg glæder os',                                             createdAt: minsAgo(110), isCurrentUser: false },
  { id: 'm6', channelId: 'frivillige', senderName: 'Kristian T.', senderInitials: 'KT', content: 'Kan ikke torsdag — har tandlæge. Har lagt vagten op i Vagter-fanen',       createdAt: minsAgo(180), isCurrentUser: false },
  { id: 'm7', channelId: 'frivillige', senderName: 'Mathias L.',  senderInitials: 'ML', content: 'Set — der er allerede en der har vist interesse',                           createdAt: minsAgo(170), isCurrentUser: true  },
  { id: 'm8', channelId: 'bestyrelse', senderName: 'Mathias L.',  senderInitials: 'ML', content: 'Budget for Q2 er godkendt — vi har råd til nyt spejlglas i hal 1',         createdAt: minsAgo(300), isCurrentUser: true  },
  { id: 'm9', channelId: 'ungdom',     senderName: 'Sofie M.',    senderInitials: 'SM', content: 'Stævne lørdag! Husk at børnene skal møde 30 min før — vi skal tape bandager', createdAt: minsAgo(200), isCurrentUser: false },
]

export const HANDBOOK_ENTRIES: HandbookEntry[] = [
  { id: 'h1', category: 'koder',        title: 'Alarmkode',                      isSecret: true,  secretValue: '4782' },
  { id: 'h2', category: 'koder',        title: 'WiFi — Hal 1',                   isSecret: true,  secretValue: 'BoksAAR2024!' },
  { id: 'h3', category: 'koder',        title: 'Nøgleskab — kode',               isSecret: true,  secretValue: '9931' },
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
  { id: 'h7',  category: 'kontakter', title: 'Formand — Mathias L.',             isSecret: false, content: 'Tlf: +45 28 34 56 78\nEmail: mathias@champscampaarhus.dk' },
  { id: 'h8',  category: 'kontakter', title: 'Cheftræner — Thomas B.',           isSecret: false, content: 'Tlf: +45 31 23 45 67\nEmail: thomas@champscampaarhus.dk' },
  { id: 'h9',  category: 'kontakter', title: 'DaBu — Dansk Amatørbokseforbund', isSecret: false, content: 'Tlf: +45 43 26 26 26\nWeb: dabu.dk\nKontaktperson: Kontorsekretær' },
  {
    id: 'h10', category: 'regler', title: 'Husregler', isSecret: false,
    content: `- Respekter alle uanset niveau\n- Rengør udstyr efter brug\n- Ingen mad eller drikkevarer i hallen (vand undtaget)\n- Brug altid handsker ved sandsæk\n- Meld afbud senest 2 timer før træning`,
  },
]
