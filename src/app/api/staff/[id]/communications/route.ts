// src/app/api/staff/[id]/communications/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET handler to fetch staff communications
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has access to this staff member
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('session', session);

    // Check if client type is BOOKING (MetroSuites)
    if (session.user.clientType !== 'BOOKING') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the staff member with communications
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
      include: {
        communications: {
          orderBy: { sentAt: 'desc' },
        }
      }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Verify that staff belongs to user's client
    if (staff.clientId !== session.user.clientId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(staff.communications || []);
  } catch (error) {
    console.error('Error fetching staff communications:', error);
    return NextResponse.json({ error: 'Failed to fetch staff communications' }, { status: 500 });
  }
}

// POST handler to send a new communication
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      // Check if client type is BOOKING (MetroSuites)
      if (session.user.clientType !== 'BOOKING') {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
  
      const body = await req.json();
      const { type, subject, message } = body;
  
      // Basic validation - type and message are always required
      if (!type || !message) {
        return NextResponse.json(
          { error: 'Type and message are required' }, 
          { status: 400 }
        );
      }
  
      // Subject validation only for email/sms communications
      if ((type === 'EMAIL' || type === 'SMS') && !subject) {
        return NextResponse.json(
          { error: 'Subject is required for communications' }, 
          { status: 400 }
        );
      }
  
      // Get the staff member with client info to access API key
      const staff = await prisma.staff.findUnique({
        where: { id: params.id },
        include: {
          client: {
            select: {
              omniGatewayApiKey: true
            }
          }
        }
      });
  
      if (!staff) {
        return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
      }
  
      // Verify that staff belongs to user's client
      if (staff.clientId !== session.user.clientId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
  
      // Skip communication preferences validation for notes
      if (type !== 'NOTE') {
        // Check if staff has the appropriate communication preference enabled
        const communicationPreferences = staff.communicationPreferences as 
          { email: boolean, sms: boolean } | null;
  
        if (!communicationPreferences) {
          return NextResponse.json(
            { error: 'Staff member has no communication preferences set' }, 
            { status: 400 }
          );
        }
  
        if (type === 'EMAIL' && !communicationPreferences.email) {
          return NextResponse.json(
            { error: 'Staff member has not opted in for email communications' }, 
            { status: 400 }
          );
        }
  
        if (type === 'SMS' && !communicationPreferences.sms) {
          return NextResponse.json(
            { error: 'Staff member has not opted in for SMS communications' }, 
            { status: 400 }
          );
        }
      }
  
      // Create the communication record with default subject for notes if not provided
      const communication = await prisma.staffCommunication.create({
        data: {
          staffId: params.id,
          type,
          subject: subject || (type === 'NOTE' ? 'Staff Note' : 'No Subject'),
          message,
          status: type === 'NOTE' ? 'SENT' : 'DRAFT',  // Notes are sent, others pending
          sentAt: new Date(),
        }
      });
  
      // For actual email/SMS communications, use the OmniStack API
      if (type !== 'NOTE') {
        if (!staff.client?.omniGatewayApiKey) {
          return NextResponse.json(
            { error: 'Client OmniGateway API key not found' }, 
            { status: 500 }
          );
        }
        // Import and use the communication API
        const { createOmniStackCommunicationApi } = await import('@/app/api/external/omnigateway/communications');
        const communicationApi = createOmniStackCommunicationApi(staff.client.omniGatewayApiKey);
        
        try {
          // Send the communication
          const result = await communicationApi.sendCommunication({
            type,
            recipient: type === 'EMAIL' ? staff.email : staff.phone,
            subject,
            message,
            metadata: {
              staffId: params.id,
              staffName: `${staff.firstName} ${staff.lastName}`,
              communicationId: communication.id
            },
            template: type === 'EMAIL' ? 'metrosuites-staff' : undefined
          });
          
          
          // Update the communication with delivery info
          const updatedCommunication = await prisma.staffCommunication.update({
            where: { id: communication.id },
            data: {
              status: 'DELIVERED',
              deliveredAt: new Date(),
              metadata: {
                deliveryId: result.deliveryId,
                provider: result.provider
              }
            }
          });
          
          return NextResponse.json(updatedCommunication);
        } catch (error) {
          // Update status to FAILED if sending fails
          const failedCommunication = await prisma.staffCommunication.update({
            where: { id: communication.id },
            data: {
              status: 'FAILED',
              metadata: {
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            }
          });
          
          return NextResponse.json(
            { error: 'Failed to send communication', details: failedCommunication }, 
            { status: 500 }
          );
        }
      }
  
      return NextResponse.json(communication);
    } catch (error) {
      console.error('Error sending communication:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to send communication' }, 
        { status: 500 }
      );
    }
  }