import { CHANNELS, MESSAGES } from '@/lib/mock-data'
import ChannelItem from '@/components/chat/ChannelItem'

export default function ChatPage() {
  return (
    <div>
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
