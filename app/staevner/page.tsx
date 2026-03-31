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
