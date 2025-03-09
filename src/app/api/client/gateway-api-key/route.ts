// app/api/client/gateway-api-key/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        // Use findFirst with explicit ID matching to avoid caching issues
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
            },
            select: {
                omniGatewayApiKey: true,
            },
            orderBy: {
                updatedAt: 'desc', // Force newest record
            },
        });

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({ apiKey: client.omniGatewayApiKey });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}