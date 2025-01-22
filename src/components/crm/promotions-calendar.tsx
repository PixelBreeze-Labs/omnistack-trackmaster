// src/components/crm/promotions-calendar.tsx
"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PromotionsCalendar() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Promotions Calendar</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    View and manage promotional events in a calendar view.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                    <Calendar />
                </CardContent>
            </Card>
        </div>
    );
}
