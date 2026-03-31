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
