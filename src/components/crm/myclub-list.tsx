// src/components/crm/myclub-list.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const clubUsers = [
    { id: 1, name: "Alice Brown", email: "alice@example.com", joinDate: "2024-01-08" },
    { id: 2, name: "Bob White", email: "bob@example.com", joinDate: "2024-01-15" },
];

export function MyClubList() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">My Club Members</h2>
                <p className="text-sm text-muted-foreground mt-2">
                    View all users who joined via the My Club landing page.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search members..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Join Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clubUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.joinDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
