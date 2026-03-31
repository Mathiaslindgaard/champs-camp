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
