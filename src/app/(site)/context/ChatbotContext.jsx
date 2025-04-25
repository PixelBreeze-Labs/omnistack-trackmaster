"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Create AssistantType as a JS object instead of enum
export const AssistantType = {
    CUSTOMER: 'customer',
    SALES: 'sales',
    PRODUCT: 'product',
    MARKETING: 'marketing',
    ANALYTICS: 'analytics',
    ADMIN: 'admin'
};
// Create context
const ChatbotContext = createContext(null)

// Sample static data that mimics the backend response structure
const sampleData = {
    customer: {
        topCustomers: [
            { id: '1', name: 'John Doe', totalSpent: 2450, ordersCount: 12 },
            { id: '2', name: 'Jane Smith', totalSpent: 1875, ordersCount: 8 },
            { id: '3', name: 'Alex Johnson', totalSpent: 1350, ordersCount: 6 }
        ],
        recentOrders: [
            { id: 'ORD-1001', customer: 'John Doe', total: 245.99, date: '2024-04-20', status: 'Delivered' },
            { id: 'ORD-1002', customer: 'Jane Smith', total: 187.50, date: '2024-04-19', status: 'Processing' },
            { id: 'ORD-1003', customer: 'Alex Johnson', total: 365.25, date: '2024-04-18', status: 'Shipped' }
        ],
        customerMetrics: {
            totalCustomers: 892,
            activeCustomers: 674,
            averageLifetimeValue: 1234,
            newCustomersThisMonth: 45
        }
    },
    sales: {
        revenueOverview: {
            total: 24567,
            previousPeriod: 21890,
            change: 12.5,
            byChannel: {
                online: 18425,
                retail: 6142
            }
        },
        orderStats: {
            totalOrders: 1345,
            averageOrderValue: 142,
            completionRate: 98.2
        },
        topProducts: [
            { id: 'P001', name: 'Wireless Headphones', sales: 324, revenue: 12960 },
            { id: 'P002', name: 'Smartphone Case', sales: 521, revenue: 7815 },
            { id: 'P003', name: 'Smart Watch', sales: 142, revenue: 21300 }
        ]
    },
    product: {
        inventory: {
            totalProducts: 567,
            lowStock: 24,
            outOfStock: 8,
            inventoryValue: 187500
        },
        categoryPerformance: [
            { category: 'Electronics', sales: 456, revenue: 45600 },
            { category: 'Clothing', sales: 328, revenue: 19680 },
            { category: 'Home & Kitchen', sales: 234, revenue: 23400 }
        ],
        topSellingProducts: [
            { id: 'P001', name: 'Wireless Headphones', sold: 324, inStock: 47 },
            { id: 'P002', name: 'Smartphone Case', sold: 521, inStock: 153 },
            { id: 'P003', name: 'Smart Watch', sold: 142, inStock: 28 }
        ]
    },
    marketing: {
        activePromotions: [
            { id: 'PROMO1', name: 'Summer Sale', discount: '20%', usedCount: 234, revenue: 8765 },
            { id: 'PROMO2', name: 'New Customer', discount: '15%', usedCount: 156, revenue: 4532 },
            { id: 'PROMO3', name: 'Flash Deal', discount: '25%', usedCount: 89, revenue: 3216 }
        ],
        customerSegments: [
            { segment: 'New Customers', count: 234, averageSpend: 85 },
            { segment: 'Regular Shoppers', count: 456, averageSpend: 145 },
            { segment: 'VIP Customers', count: 78, averageSpend: 325 }
        ],
        campaignPerformance: [
            { campaign: 'Spring Email Campaign', opens: 4532, clicks: 567, conversions: 89, revenue: 12567 },
            { campaign: 'Social Media Ads', impressions: 15670, clicks: 789, conversions: 124, revenue: 18975 }
        ]
    },
    analytics: {
        kpis: {
            revenue: 24567,
            orders: 1345,
            averageOrderValue: 142,
            conversionRate: 3.2,
            customerAcquisitionCost: 25,
            customerLifetimeValue: 1234
        },
        trends: {
            revenueGrowth: 12.5,
            orderGrowth: 8.3,
            aovGrowth: 3.8
        },
        channelPerformance: [
            { channel: 'Organic Search', visitors: 12567, conversions: 234, revenue: 8750 },
            { channel: 'Direct', visitors: 8932, conversions: 345, revenue: 12340 },
            { channel: 'Social', visitors: 7845, conversions: 156, revenue: 5670 }
        ]
    }
};

// Predefined responses for different query types
const responseTemplates = {
    salesOverview: `Based on the data, your store is performing well with total revenue of €24,567, which is up 12.5% from the previous period. You've processed 1,345 orders with an average order value of €142.

Your top-selling product is the Smart Watch, generating €21,300 in revenue, followed by Wireless Headphones (€12,960) and Smartphone Cases (€7,815).

Online sales account for 75% of your revenue (€18,425), while retail contributes 25% (€6,142).`,

    customerInsights: `You currently have 892 total customers, with 674 active in the last 30 days. Your average customer lifetime value is €1,234.

Your top customer is John Doe, who has spent €2,450 across 12 orders, followed by Jane Smith (€1,875) and Alex Johnson (€1,350).

You've gained 45 new customers this month, and your customer retention rate is strong at 76%.`,

    inventoryStatus: `Your inventory currently includes 567 products with a total value of €187,500.

24 products are running low on stock, including Wireless Headphones (47 units left). 8 products are completely out of stock.

Your best-performing category is Electronics with 456 sales generating €45,600 in revenue, followed by Home & Kitchen with higher average order values.`,

    createDiscount: `I've created a discount code for you: SUMMER25

This code provides 25% off all purchases and is valid until May 31, 2024. Would you like to:
1. Limit it to specific product categories
2. Set a minimum purchase amount
3. Restrict it to certain customer segments
4. Activate it immediately`,

    storePerformance: `Overall, your store is performing well with healthy growth metrics:

- Revenue is up 12.5% at €24,567
- Orders increased by 8.3% to 1,345
- Average order value grew 3.8% to €142
- Conversion rate is steady at 3.2%

Your customer acquisition cost is €25 with a lifetime value of €1,234, giving you a strong LTV:CAC ratio of 49:1.

The Electronics category continues to be your strongest performer, but Home & Kitchen shows promising growth.`
};

export const ChatbotProvider = ({ children }) => {
    const { data: session } = useSession()
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
    })

    // Simulate query processing with predefined responses
    const processMessage = async (message) => {
        // Set loading state
        setChatbotState(prev => ({ ...prev, isLoading: true }));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Determine intent from message
        let response = '';
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('sale') || lowerMsg.includes('revenue') || lowerMsg.includes('performing') || 
            lowerMsg.includes('orders') || lowerMsg.includes('sales')) {
            // Set the current type based on the query
            setChatbotState(prev => ({ ...prev, currentType: AssistantType.SALES }));
            response = responseTemplates.salesOverview;
        } 
        else if (lowerMsg.includes('customer') || lowerMsg.includes('client') || 
                lowerMsg.includes('buyer') || lowerMsg.includes('spend')) {
            setChatbotState(prev => ({ ...prev, currentType: AssistantType.CUSTOMER }));
            response = responseTemplates.customerInsights;
        }
        else if (lowerMsg.includes('inventory') || lowerMsg.includes('product') || 
                lowerMsg.includes('stock') || lowerMsg.includes('restock')) {
            setChatbotState(prev => ({ ...prev, currentType: AssistantType.PRODUCT }));
            response = responseTemplates.inventoryStatus;
        }
        else if (lowerMsg.includes('discount') || lowerMsg.includes('promotion') || 
                lowerMsg.includes('coupon') || lowerMsg.includes('offer')) {
            setChatbotState(prev => ({ ...prev, currentType: AssistantType.MARKETING }));
            response = responseTemplates.createDiscount;
        }
        else if (lowerMsg.includes('performance') || lowerMsg.includes('metrics') || 
                lowerMsg.includes('analytics') || lowerMsg.includes('report')) {
            setChatbotState(prev => ({ ...prev, currentType: AssistantType.ANALYTICS }));
            response = responseTemplates.storePerformance;
        }
        else {
            // Generic response when no specific intent is detected
            response = "I understand you're asking about " + message.substring(0, 30) + "... I can help with sales performance, customer insights, inventory management, creating discounts, and store analytics. Could you provide more details about what you're looking for?";
        }
        
        // Update suggestions based on the detected intent
        updateSuggestions(getChatbotType(lowerMsg));
        
        // Reset loading state
        setChatbotState(prev => ({ ...prev, isLoading: false }));
        
        return response;
    };

    const getChatbotType = (message) => {
        if (message.includes('sale') || message.includes('revenue') || message.includes('orders')) {
            return AssistantType.SALES;
        } 
        else if (message.includes('customer') || message.includes('client')) {
            return AssistantType.CUSTOMER;
        }
        else if (message.includes('inventory') || message.includes('product')) {
            return AssistantType.PRODUCT;
        }
        else if (message.includes('discount') || message.includes('promotion')) {
            return AssistantType.MARKETING;
        }
        else if (message.includes('performance') || message.includes('analytics')) {
            return AssistantType.ANALYTICS;
        }
        return AssistantType.ADMIN;
    };

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

    // Initialize with session user
    useEffect(() => {
        if (session?.user) {
            // You could personalize suggestions based on user role
            if (session.user.role === 'ADMIN') {
                setChatbotState(prev => ({
                    ...prev,
                    suggestions: [
                        "Show store performance overview",
                        "Identify growth opportunities",
                        "Analyze sales trends",
                        "Check inventory status"
                    ]
                }));
            } else if (session.user.role === 'SALES') {
                setChatbotState(prev => ({
                    ...prev, 
                    currentType: AssistantType.SALES,
                    suggestions: [
                        "Show today's sales",
                        "Compare to yesterday",
                        "Check top products",
                        "Create a discount"
                    ]
                }));
            }
        }
    }, [session]);

    const value = {
        chatbotState,
        setChatbotState,
        processMessage,
        staticData: sampleData,
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