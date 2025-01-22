// src/app/crm/ecommerce/promotions/list/page.tsx
import { Metadata } from "next";
import { PromotionsList } from "@/components/crm/promotions-list";

export const metadata: Metadata = {
    title: "Promotions List - CRM",
    description: "View and manage all promotions",
};

export default function PromotionsPage() {
    return (
        <div className="px-3">
            <PromotionsList />
        </div>
    );
}