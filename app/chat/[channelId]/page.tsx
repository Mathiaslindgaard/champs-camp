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
