// src/components/crm/promotions-list.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const promotions = [
    { id: 1, name: "Holiday Sale", discount: "20%", active: true },
    { id: 2, name: "Summer Promo", discount: "15%", active: false },
];

export function PromotionsList() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Promotions</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Manage and view all promotions
                    </p>
                </div>
                <Button variant="default" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Promotion
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search promotions..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promotions.map((promo) => (
                                <TableRow key={promo.id}>
                                    <TableCell>{promo.name}</TableCell>
                                    <TableCell>{promo.discount}</TableCell>
                                    <TableCell>{promo.active ? "Active" : "Inactive"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}