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
