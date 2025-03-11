import { Metadata } from "next"
import { PromotionsContent } from "@/components/crm/promotions/PromotionsContent"

export const metadata: Metadata = {
  title: "Promotions & Discounts - Metrosuites",
  description: "Manage special offers and discounts for your properties and services",
}

export default function GeneralPromotionsPage() {
  return (
    <div className="px-3">
      <PromotionsContent />
    </div>
  )
}