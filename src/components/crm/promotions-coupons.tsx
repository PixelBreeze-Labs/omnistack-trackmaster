// src/components/crm/promotions-coupons.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";

const coupons = [
    { id: 1, code: "SAVE20", discount: "20%", expiration: "2024-12-31" },
    { id: 2, code: "FREESHIP", discount: "Free Shipping", expiration: "2024-11-30" },
];

export function PromotionsCoupons() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    Create and manage promotional coupons
                </p>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search coupons..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Expiration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell>{coupon.code}</TableCell>
                                    <TableCell>{coupon.discount}</TableCell>
                                    <TableCell>{coupon.expiration}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}