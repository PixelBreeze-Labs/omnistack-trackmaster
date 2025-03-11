// src/app/(dashboard)/messages/page.tsx
import { Metadata } from "next"
import { ChatsContent } from "@/components/crm/chats/chats-content"

export const metadata: Metadata = {
  title: "Chats - Metrosuites",
  description: "Manage conversations with your clients and staff",
}

export default function MessagesPage() {
  return (
    <div className="px-3">
      <ChatsContent />
    </div>
  )
}