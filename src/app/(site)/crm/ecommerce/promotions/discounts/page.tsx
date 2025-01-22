// src/app/crm/ecommerce/promotions/discounts/page.tsx
import { Metadata } from "next";
import { PromotionsDiscounts } from "@/components/crm/promotions-discounts";

export const metadata: Metadata = {
    title: "Promotions Discounts - CRM",
    description: "Manage discount strategies for promotions",
};

export default function PromotionsDiscountsPage() {
    return (
        <div className="px-5">
            <PromotionsDiscounts />
        </div>
    );
}