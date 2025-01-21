"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Search,
  Send,
  Users,
  UserCircle,
  Filter,
  PlusCircle,
  MessagesSquare 
} from "lucide-react"
import InputSelect from '@/components/Common/InputSelect'

// Dummy data
const DUMMY_CHATS = {
  staff: Array.from({ length: 10 }, (_, i) => ({
    id: `s${i + 1}`,
    name: `Staff Member ${i + 1}`,
    role: ['Sales', 'Support', 'Admin'][Math.floor(Math.random() * 3)],
    lastMessage: 'Latest update on the sales report...',
    time: '10:30 AM',
    unread: Math.floor(Math.random() * 5),
    online: Math.random() > 0.5,
    avatar: null
  })),
  customers: Array.from({ length: 10 }, (_, i) => ({
    id: `c${i + 1}`,
    name: `Customer ${i + 1}`,
    type: ['VIP', 'Regular'][Math.floor(Math.random() * 2)],
    lastMessage: 'I have a question about my order...',
    time: '11:45 AM',
    unread: Math.floor(Math.random() * 3),
    online: Math.random() > 0.5,
    avatar: null
  }))
}

const DUMMY_MESSAGES = [
  {
    id: 1,
    sender: 'John Doe',
    content: 'Hello, I need help with my recent order.',
    time: '10:30 AM',
    role: 'customer',
    avatar: null
  },
  {
    id: 2,
    sender: 'Support Staff',
    content: 'Hi John, I\'d be happy to help. Could you please provide your order number?',
    time: '10:32 AM',
    role: 'staff',
    avatar: null
  },
  {
    id: 3,
    sender: 'John Doe',
    content: 'Sure, it\'s ORD-2024-001',
    time: '10:33 AM',
    role: 'customer',
    avatar: null
  }
]

export function OneBox() {
  const [activeTab, setActiveTab] = useState("staff")
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedChat, setSelectedChat] = useState(null)

  const getStatusColor = (online: boolean) => {
    return online ? "bg-green-500" : "bg-gray-300"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">OneBox</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Unified communication hub for staff and customer interactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-12 gap-4">
        {/* Chat List Section */}
        <Card className="col-span-4">
          <CardHeader className="p-4 pb-2">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="staff" className="flex-1">
                  <Users className="mr-2 h-4 w-4" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex-1">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Customers
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="divide-y">
              {DUMMY_CHATS[activeTab].map((chat) => (
                <div 
                  key={chat.id}
                  className="p-4 hover:bg-accent cursor-pointer flex items-start gap-3"
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div 
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(chat.online)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-medium truncate">{chat.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {activeTab === 'staff' ? chat.role : chat.type}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {chat.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        {chat.unread} new
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages Section */}
        <Card className="col-span-8">
          {selectedChat ? (
            <>
              <CardHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedChat.avatar} />
                      <AvatarFallback>{selectedChat.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedChat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {activeTab === 'staff' ? selectedChat.role : selectedChat.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <MessagesSquare className="h-4 w-4" />
                    </Button>
                    <InputSelect
                      name="actions"
                      label=""
                      value=""
                      onChange={(e) => {
                        // Handle different actions
                        switch(e.target.value) {
                          case "profile":
                            // Handle view profile
                            break;
                          case "unread":
                            // Handle mark as unread
                            break;
                          case "mute":
                            // Handle mute notifications
                            break;
                        }
                      }}
                      options={[
                        { value: "", label: "Actions" },
                        { value: "profile", label: "View Profile" },
                        { value: "unread", label: "Mark as Unread" },
                        { value: "mute", label: "Mute Notifications" }
                      ]}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[600px]">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {DUMMY_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'staff' ? 'justify-end' : ''
                      }`}
                    >
                      {message.role !== 'staff' && (
                        <Avatar>
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[70%] ${
                          message.role === 'staff'
                            ? 'bg-primary text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.time}
                        </span>
                      </div>
                      {message.role === 'staff' && (
                        <Avatar>
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No Chat Selected</h3>
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add bottom spacing */}
      <div className="h-8"></div>
    </div>
  )
}