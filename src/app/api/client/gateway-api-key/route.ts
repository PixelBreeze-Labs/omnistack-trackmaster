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

        // Use findUnique with exact ID match instead of findFirst
        const client = await prisma.client.findUnique({
            where: {
                id: clientId, // Ensure this matches your schema's primary key field 
            },
            select: {
                omniGatewayApiKey: true,
            },
        });

        // Debug output for development
        console.log(`Looking for client with ID: ${clientId}`);
        console.log(`Found client:`, client);

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        return NextResponse.json({ apiKey: client.omniGatewayApiKey });
    } catch (error) {
        console.error("Error fetching API key:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}