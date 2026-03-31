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
