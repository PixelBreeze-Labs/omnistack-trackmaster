// app/api/client/gateway-api-key/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { authPrisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // Use the auth session with server session to ensure latest user data
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get the client ID from the URL parameter
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  
  if (!clientId) {
    return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
  }
  
  try {
    // Always read from primary for authorization checks
    // Using authPrisma which is configured with primary read preference
    const user = await authPrisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        clientId: true,
        role: true,
      },
    });
    
    // Authorization check
    if (!user || (user.clientId !== clientId && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'You do not have access to this client' },
        { status: 403 }
      );
    }
    
    // Get API key using authPrisma to ensure fresh data
    const client = await authPrisma.client.findUnique({
      where: {
        id: clientId,
      },
      select: {
        omniGatewayApiKey: true,
      },
    });
    
    if (!client || !client.omniGatewayApiKey) {
      return NextResponse.json(
        { error: 'API key not found for this client' },
        { status: 404 }
      );
    }
    
    // Return with cache control headers
    return NextResponse.json(
      { apiKey: client.omniGatewayApiKey },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching gateway API key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}