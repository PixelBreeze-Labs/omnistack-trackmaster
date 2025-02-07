// app/api/staff/connect-store/route.ts
import { NextResponse } from 'next/server';
import { createOmniGatewayApi } from '../../external/omnigateway';

export async function POST(req: Request) {
  try {
    const { staffId, storeId } = await req.json();

    // Get client's API key
    const client = await prisma.client.findFirst({
      where: {
        staff: {
          some: {
            id: staffId
          }
        }
      }
    });

    if (!client?.omniGatewayApiKey) {
      return NextResponse.json({ error: 'Client API key not found' }, { status: 404 });
    }

    // Connect staff to store in OmniStack
    const omniGateway = createOmniGatewayApi(client.omniGatewayApiKey);
    await omniGateway.post('/users/connect-store', {
      userId: staffId,
      storeId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to connect store:', error);
    return NextResponse.json(
      { error: 'Failed to connect store' }, 
      { status: 500 }
    );
  }
}