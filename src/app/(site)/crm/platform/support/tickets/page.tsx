// app/support/tickets/page.tsx

import { Metadata } from "next"
import { EnhancedTicketsContent } from "@/components/crm/tickets/tickets-content"

export const metadata: Metadata = {
  title: "Support Tickets - OmniStack Hub",
  description: "Manage customer support tickets and requests",
}

export default function TicketsPage() {
  return (
    <div className="px-3">
      <EnhancedTicketsContent />
    </div>
  )
}