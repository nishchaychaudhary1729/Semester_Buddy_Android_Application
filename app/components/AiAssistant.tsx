'use client'

import { useState } from 'react'
import { Send, Brain } from 'lucide-react'

export default function AiAssistant() {
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI study assistant. How can I help you today?'
    }
  ])

  const handleSend = () => {
    if (!message.trim()) return

    // Add user message
    setChat(prev => [...prev, { role: 'user', content: message }])
    
    // Simulate AI response
    setTimeout(() => {
      setChat(prev => [...prev, {
        role: 'assistant',
        content: 'I understand your question. Let me help you with that...'
      }])
    }, 1000)

    setMessage('')
  }

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="h-6 w-6 text-purple-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">AI Study Assistant</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex space-x-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about your studies..."
          className="flex-1 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={handleSend}
          className="bg-primary-500 text-white p-4 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
} 