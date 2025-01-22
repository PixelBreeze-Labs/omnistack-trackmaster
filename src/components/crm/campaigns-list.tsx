// src/components/crm/campaigns-list.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";

const campaigns = [
    { id: 1, name: "Spring Campaign", reach: "10,000 users", status: "Running" },
    { id: 2, name: "Black Friday", reach: "25,000 users", status: "Completed" },
];

export function CampaignsList() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Manage and view all campaigns
                    </p>
                </div>
                <Button variant="default" size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Campaign
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search campaigns..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Reach</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>{campaign.name}</TableCell>
                                    <TableCell>{campaign.reach}</TableCell>
                                    <TableCell>{campaign.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
