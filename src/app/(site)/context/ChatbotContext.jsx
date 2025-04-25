"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Create context
const ChatbotContext = createContext(null)

// Sample sales data - in a real app, you would fetch this from your API
const sampleSalesData = {
  lastMonth: {
    revenue: 24567,
    orders: 1345,
    customers: 892,
    avgOrderValue: 142,
  },
  productPerformance: [
    { product: 'Wireless Headphones', sales: 324, revenue: 12960 },
    { product: 'Smartphone Case', sales: 521, revenue: 7815 },
    { product: 'Smart Watch', sales: 142, revenue: 21300 },
    { product: 'Bluetooth Speaker', sales: 268, revenue: 8040 },
  ],
  activePromotions: [
    { name: 'Summer Sale', discount: '20%', usedCount: 234, revenue: 8765 },
    { name: 'New Customer', discount: '15%', usedCount: 156, revenue: 4532 },
    { name: 'Flash Deal', discount: '25%', usedCount: 89, revenue: 3216 },
  ]
}

export const ChatbotProvider = ({ children }) => {
  const { data: session } = useSession()
  const [salesData, setSalesData] = useState(sampleSalesData)
  const [chatbotState, setChatbotState] = useState({
    isOpen: false,
    isLoading: false,
    suggestions: [
      "How are my sales performing this month?",
      "Create a 15% discount code for new customers",
      "Show me the top selling products",
      "What's my customer retention rate?"
    ]
  })

  // This would make API calls in a real app
  const fetchSalesData = async () => {
    // Simulating an API call
    setChatbotState(prev => ({ ...prev, isLoading: true }))
    
    // In a real app, you would call your API here
    // const response = await fetch('/api/sales-data')
    // const data = await response.json()
    // setSalesData(data)
    
    // For demo, we'll just use our sample data after a delay
    setTimeout(() => {
      setSalesData(sampleSalesData)
      setChatbotState(prev => ({ ...prev, isLoading: false }))
    }, 1000)
  }

  // Example function to create a discount code
  const createDiscountCode = async (percentage, description) => {
    setChatbotState(prev => ({ ...prev, isLoading: true }))
    
    // In a real app, call your API
    // const response = await fetch('/api/create-discount', {
    //   method: 'POST',
    //   body: JSON.stringify({ percentage, description }),
    //   headers: { 'Content-Type': 'application/json' }
    // })
    // const data = await response.json()
    
    // Simulate API response
    const discountCode = `SALE${percentage}${Math.floor(Math.random() * 1000)}`
    
    setTimeout(() => {
      setChatbotState(prev => ({ ...prev, isLoading: false }))
      return {
        success: true,
        code: discountCode,
        percentage,
        description
      }
    }, 1000)
    
    return {
      success: true,
      code: discountCode,
      percentage,
      description
    }
  }

  // Parse messages and determine intent
  const processMessage = async (message) => {
    // This is where you would implement NLP or AI processing
    // For demo purposes, we'll use simple keyword matching
    
    let response = ''
    
    const lowerMsg = message.toLowerCase()
    
    if (lowerMsg.includes('sales') || lowerMsg.includes('revenue') || lowerMsg.includes('performing')) {
      response = `Your total revenue last month was €${salesData.lastMonth.revenue} from ${salesData.lastMonth.orders} orders. The average order value was €${salesData.lastMonth.avgOrderValue}.`
    } 
    else if (lowerMsg.includes('discount') || lowerMsg.includes('promotion') || lowerMsg.includes('code')) {
      const percentageMatch = lowerMsg.match(/(\d+)%/)
      const percentage = percentageMatch ? percentageMatch[1] : '10'
      
      const result = await createDiscountCode(percentage, "Generated via chatbot")
      
      response = `I've created a ${percentage}% discount code: ${result.code}. This code is now active and ready to use.`
    }
    else if (lowerMsg.includes('top') || lowerMsg.includes('best') || lowerMsg.includes('selling')) {
      const topProducts = salesData.productPerformance
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3)
      
      response = `Your top selling products by revenue are:\n1. ${topProducts[0].product}: €${topProducts[0].revenue}\n2. ${topProducts[1].product}: €${topProducts[1].revenue}\n3. ${topProducts[2].product}: €${topProducts[2].revenue}`
    }
    else {
      response = "I'm not sure how to help with that yet. You can ask me about sales performance, creating discount codes, or viewing top-selling products."
    }
    
    return response
  }

  // Initialize data when session is loaded
  useEffect(() => {
    if (session) {
      fetchSalesData()
    }
  }, [session])

  const value = {
    salesData,
    chatbotState,
    setChatbotState,
    processMessage,
    fetchSalesData,
    createDiscountCode,
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

export const useChatbot = () => {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}

export default ChatbotContext