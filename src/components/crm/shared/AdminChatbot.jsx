"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MessageSquare, X, Send, Sparkles, 
  BarChart, Tag, ShoppingBag, Users,
  Loader2, PieChart, LineChart, Zap,
  HelpCircle
} from "lucide-react"
import { useChatbot } from '../../../app/(site)/context/ChatbotContext'
import { AssistantType } from '@/app/api/external/omnigateway/types/ai-assistant'


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
    processMessage,
    staticData
  } = useChatbot()
  
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { message: "Hello! I'm TrackMaster AI, your intelligent business assistant. How can I help optimize your store operations today?", isBot: true }
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
    e?.preventDefault?.()
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

  // Handle tab click - immediately set the active tab
  const handleTabClick = (type) => {
    // Update the current assistant type
    setChatbotState(prev => ({ ...prev, currentType: type }))
    
    // Update suggestions based on the selected tab
    updateSuggestions(type)
  }
  
  // Function to update suggestions based on assistant type
  const updateSuggestions = (type) => {
    let newSuggestions = [];
    
    switch (type) {
      case AssistantType.SALES:
        newSuggestions = [
          "What's our revenue growth?",
          "Show top selling products",
          "Compare sales to last month",
          "What's our average order value?"
        ];
        break;
      case AssistantType.CUSTOMER:
        newSuggestions = [
          "Who are our top spenders?",
          "Show new customers this month",
          "What's our customer retention rate?",
          "Identify potential churning customers"
        ];
        break;
      case AssistantType.PRODUCT:
        newSuggestions = [
          "What products need restocking?",
          "Show product performance by category",
          "Which products are out of stock?",
          "Identify slow-moving inventory"
        ];
        break;
      case AssistantType.MARKETING:
        newSuggestions = [
          "Create a new discount code",
          "How are our promotions performing?",
          "Show customer segments",
          "Suggest promotions for slow inventory"
        ];
        break;
      case AssistantType.ANALYTICS:
        newSuggestions = [
          "Show key performance indicators",
          "What are our growth trends?",
          "Compare channel performance",
          "What's our conversion rate?"
        ];
        break;
      default:
        newSuggestions = [
          "How are sales performing?",
          "Show me my top customers",
          "What products need restocking?",
          "Create a discount code"
        ];
    }
    
    setChatbotState(prev => ({ ...prev, suggestions: newSuggestions }));
  };

  // Get icon based on assistant type
  const getAssistantTypeIcon = () => {
    switch (chatbotState.currentType) {
      case AssistantType.SALES:
        return BarChart;
      case AssistantType.CUSTOMER:
        return Users;
      case AssistantType.PRODUCT:
        return ShoppingBag;
      case AssistantType.MARKETING:
        return Tag;
      case AssistantType.ANALYTICS:
        return LineChart;
      default:
        return Sparkles;
    }
  }

  // Function to get assistant type label
  const getAssistantTypeLabel = () => {
    switch (chatbotState.currentType) {
      case AssistantType.SALES:
        return "Sales Assistant";
      case AssistantType.CUSTOMER:
        return "Customer Insights";
      case AssistantType.PRODUCT:
        return "Inventory Manager";
      case AssistantType.MARKETING:
        return "Marketing Advisor";
      case AssistantType.ANALYTICS:
        return "Analytics Expert";
      default:
        return "TrackMaster AI";
    }
  }

  // Quick action buttons based on potential assistant types
  const quickActions = [
    { 
      icon: BarChart, 
      label: "Sales", 
      type: AssistantType.SALES,
    },
    { 
      icon: Users, 
      label: "Customers", 
      type: AssistantType.CUSTOMER,
    },
    { 
      icon: ShoppingBag, 
      label: "Products", 
      type: AssistantType.PRODUCT,
    },
    { 
      icon: Tag, 
      label: "Marketing", 
      type: AssistantType.MARKETING,
    },
  ]

  // Dynamic icon component based on current assistant type
  const TypeIcon = getAssistantTypeIcon();

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
              <TypeIcon className="h-5 w-5 text-white" />
              <h3 className="font-bold text-white">{getAssistantTypeLabel()}</h3>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setChatHistory([
                  { message: "Hello! I'm TrackMaster AI, your intelligent business assistant. How can I help optimize your store operations today?", isBot: true }
                ])}
                className="h-6 w-6 hover:bg-white/20 text-white mr-1"
                title="Clear conversation"
              >
                <Zap className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat}
                className="h-6 w-6 hover:bg-white/20 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="flex justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={chatbotState.currentType === action.type ? "default" : "ghost"}
                className={`flex flex-col items-center justify-center h-auto py-2 px-3 rounded transition-colors ${
                  chatbotState.currentType === action.type 
                    ? 'bg-primary/10 hover:bg-primary/20 text-primary' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => handleTabClick(action.type)}
              >
                <action.icon className={`h-5 w-5 mb-1 ${
                  chatbotState.currentType === action.type 
                    ? 'text-primary' 
                    : 'text-gray-600 dark:text-gray-300'
                }`} />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Chat messages - maximized space */}
          <CardContent className="flex-1 overflow-y-auto p-4 hide-scrollbar">
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
            <div className="px-4 py-2 border-t overflow-x-auto bg-gray-50 dark:bg-gray-800/50 hide-scrollbar">
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
                placeholder="Ask about sales, customers, products..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-8"
                ref={inputRef}
                disabled={processingMessage}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full flex items-center justify-center p-0"
                onClick={() => handleSuggestionClick("What can you help me with?")}
              >
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </Button>
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