"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { AssistantType } from '@/app/api/external/omnigateway/types/ai-assistant'

// Create context
const ChatbotContext = createContext(null)

export const ChatbotProvider = ({ children }) => {
    const { data: session } = useSession();
    const {
        isLoading: aiLoading,
        currentType,
        suggestions: aiSuggestions,
        askAssistant,
        setAssistantType,
        isInitialized
    } = useAIAssistant();

    const [chatbotState, setChatbotState] = useState({
        isOpen: false,
        isLoading: false,
        currentType: AssistantType.ADMIN,
        suggestions: [
            "How are sales performing this month?",
            "Show me my top customers",
            "What products need restocking?",
            "Create a 15% discount code"
        ]
    });

    // Sync AI assistant type with chatbot state
    useEffect(() => {
        if (isInitialized && currentType) {
            setChatbotState(prev => ({
                ...prev,
                currentType
            }));
        }
    }, [isInitialized, currentType]);

    // Sync AI suggestions with chatbot state
    useEffect(() => {
        if (isInitialized && aiSuggestions && aiSuggestions.length > 0) {
            setChatbotState(prev => ({
                ...prev,
                suggestions: aiSuggestions
            }));
        }
    }, [isInitialized, aiSuggestions]);

    // Sync loading state
    useEffect(() => {
        if (isInitialized) {
            setChatbotState(prev => ({
                ...prev,
                isLoading: aiLoading
            }));
        }
    }, [isInitialized, aiLoading]);

    // Process message using AI service
    const processMessage = async (message) => {
        if (!isInitialized) {
            console.error('AI service not initialized');
            return "I'm having trouble connecting to the AI service. Please try again later.";
        }

        try {
            // Set loading state
            setChatbotState(prev => ({ ...prev, isLoading: true }));
            
            // Call the AI service
            const response = await askAssistant(message);
            
            if (!response) {
                throw new Error('No response from AI service');
            }
            
            return response.answer;
        } catch (error) {
            console.error('Failed to process message:', error);
            return "Sorry, I encountered an error processing your request. Please try again.";
        } finally {
            setChatbotState(prev => ({ ...prev, isLoading: false }));
        }
    };

    // Handle changing the assistant type
    const handleSetAssistantType = (type) => {
        setAssistantType(type);
    };

    // Initialize with session user
    useEffect(() => {
        if (session?.user && isInitialized) {
            // Personalize assistant type based on user role
            if (session.user.role === 'SALES') {
                setAssistantType(AssistantType.SALES);
            }
        }
    }, [session, isInitialized, setAssistantType]);

    const value = {
        chatbotState,
        setChatbotState,
        processMessage,
        setAssistantType: handleSetAssistantType
    };

    return (
        <ChatbotContext.Provider value={value}>
            {children}
        </ChatbotContext.Provider>
    );
};

export const useChatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within a ChatbotProvider');
    }
    return context;
};

export default ChatbotContext;