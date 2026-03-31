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
