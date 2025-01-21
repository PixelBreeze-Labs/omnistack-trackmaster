// src/app/crm/[type]/sales-team/performance/page.tsx
import { Metadata } from "next"
import { SalesPerformance } from "@/components/crm/sales-team/performance"

export const metadata: Metadata = {
    title: "Sales Team Performance - TrackMaster CRM",
    description: "Monitor and analyze sales team performance metrics",
}

export default function SalesPerformancePages() {
    return (
        <div className="px-5">
            <SalesPerformance />
        </div>
    )
}