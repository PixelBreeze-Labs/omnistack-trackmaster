// src/app/crm/ecommerce/promotions/coupons/page.tsx
import { Metadata } from "next";
import { PromotionsCoupons } from "@/components/crm/promotions-coupons";

export const metadata: Metadata = {
    title: "Promotions Coupons - CRM",
    description: "Manage promotional coupons",
};

export default function PromotionsCouponsPage() {
    return (
        <div className="px-5">
            <PromotionsCoupons />
        </div>
    );
}
