"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MessageSquare, X, Send, Sparkles, 
  LineChart, Tag, ShoppingBag, Activity,
  Loader2
} from "lucide-react"
import { useChatbot } from '../../../app/(site)/context/ChatbotContext'

const ChatMessage = ({ message, isBot, isLoading }) => {
  // Handle message formatting - detect newlines and convert to <br>
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`rounded-lg px-4 py-3 max-w-[85%] ${
        isBot 
          ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
          : 'bg-primary text-white'
      }`}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          formatMessage(message)
        )}
      </div>
    </div>
  )
}

const SuggestionChip = ({ text, onClick }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="rounded-full text-xs whitespace-nowrap"
      onClick={() => onClick(text)}
    >
      {text}
    </Button>
  )
}

const TrackMasterAI = () => {
  const { 
    chatbotState, 
    setChatbotState, 
    processMessage 
  } = useChatbot()
  
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { message: "Hello! I'm TrackMaster AI, your intelligent business assistant. How can I help optimize your operations today?", isBot: true }
  ])
  const [processingMessage, setProcessingMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    if (chatbotState.isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [chatHistory, chatbotState.isOpen])

  const handleSendMessage = async (e) => {
    e?.preventDefault()
    if (!message.trim()) return

    // Add user message to chat
    setChatHistory(prev => [...prev, { message, isBot: false }])
    
    // Add loading message
    setProcessingMessage(true)
    
    // Clear input
    setMessage('')

    // Process the message
    try {
      const response = await processMessage(message)
      
      // Remove loading state and add bot response
      setProcessingMessage(false)
      setChatHistory(prev => [...prev, { message: response, isBot: true }])
    } catch (error) {
      setProcessingMessage(false)
      setChatHistory(prev => [...prev, { 
        message: "Sorry, I encountered an error processing that request.", 
        isBot: true 
      }])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion)
    handleSendMessage()
  }

  const toggleChat = () => {
    setChatbotState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }

  // Quick action buttons
  const quickActions = [
    { icon: LineChart, label: "Sales Data", onClick: () => handleSuggestionClick("Show me sales data") },
    { icon: ShoppingBag, label: "Products", onClick: () => handleSuggestionClick("Show top selling products") },
    { icon: Tag, label: "Discounts", onClick: () => handleSuggestionClick("Create a new discount code") },
    { icon: Activity, label: "Performance", onClick: () => handleSuggestionClick("Analyze store performance") },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      {!chatbotState.isOpen && (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full shadow-lg"
          style={{ backgroundColor: "#5FC4D0" }}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat interface */}
      {chatbotState.isOpen && (
        <Card className="w-[420px] h-[650px] shadow-xl flex flex-col border-0 overflow-hidden">
          {/* Chat header - more compact */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b relative z-10"
            style={{ 
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              background: "#5FC4D0"
            }}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-white" />
              <h3 className="font-bold text-white">TrackMaster AI</h3>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleChat}
              className="h-6 w-6 hover:bg-white/20 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick action buttons */}
          <div className="flex justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center justify-center h-auto py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={action.onClick}
              >
                <action.icon className="h-5 w-5 mb-1 text-gray-600 dark:text-gray-300" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Chat messages - maximized space */}
          <CardContent className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            {chatHistory.map((chat, index) => (
              <ChatMessage 
                key={index} 
                message={chat.message} 
                isBot={chat.isBot} 
              />
            ))}
            
            {processingMessage && (
              <ChatMessage 
                message="" 
                isBot={true} 
                isLoading={true} 
              />
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Suggestions - only show if present */}
          {chatbotState.suggestions.length > 0 && (
            <div className="px-4 py-2 border-t overflow-x-auto bg-gray-50 dark:bg-gray-800/50">
              <div className="flex space-x-2">
                {chatbotState.suggestions.map((suggestion, index) => (
                  <SuggestionChip 
                    key={index} 
                    text={suggestion} 
                    onClick={handleSuggestionClick} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input area - compact but functional */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-3 border-t flex items-center gap-2 bg-gray-50 dark:bg-gray-800/30"
          >
            <div className="flex items-center bg-white dark:bg-gray-700 rounded-full flex-1 px-4 py-2 shadow-sm">
              <Input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Ask something..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8"
                ref={inputRef}
                disabled={processingMessage}
              />
            </div>
            
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full h-10 w-10"
              style={{ backgroundColor: "#5FC4D0" }}
              disabled={!message.trim() || processingMessage}
            >
              {processingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}

export default TrackMasterAI