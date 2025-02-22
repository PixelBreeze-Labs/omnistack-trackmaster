// src/app/crm/platform/promotions/calendar/page.tsx
import { Metadata } from "next";
import { PromotionsCalendar } from "@/components/crm/promotions-calendar";

export const metadata: Metadata = {
    title: "Promotions Calendar - CRM",
    description: "View promotional events on a calendar",
};

export default function PromotionsCalendarPage() {
    return (
        <div className="px-5">
            <PromotionsCalendar />
        </div>
    );
}
