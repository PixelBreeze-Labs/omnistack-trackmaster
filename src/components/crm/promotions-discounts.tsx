// src/components/crm/promotions-discounts.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export function PromotionsDiscounts() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Discount Management</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Create and manage discount strategies.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Create a Discount</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input placeholder="Discount Name" />
                        <div className="flex items-center gap-4">
                            <span>Percentage:</span>
                            {/* <Slider defaultValue={[20]} max={100} step={5} /> */}
                        </div>
                        <Button variant="default">Save Discount</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}