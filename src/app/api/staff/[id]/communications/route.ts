// src/app/api/staff/[id]/communications/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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

    // Check if client type is BOOKING (MetroSuites)
    if (session.user.clientType !== 'BOOKING') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the staff member with communications
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
      include: {
        department: true,
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

    return NextResponse.json(staff);
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

    if (!type || !subject || !message) {
      return NextResponse.json(
        { error: 'Type, subject, and message are required' }, 
        { status: 400 }
      );
    }

    // Get the staff member
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Verify that staff belongs to user's client
    if (staff.clientId !== session.user.clientId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

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

    // Here you would integrate with your email or SMS service
    // For now, we'll just create the record

    const communication = await prisma.staffCommunication.create({
      data: {
        staffId: params.id,
        type,
        subject,
        message,
        status: 'SENT',
        sentAt: new Date(),
      }
    });

    // In a real-world scenario, you would:
    // 1. Send the email or SMS
    // 2. Update the communication status based on the response
    // 3. Include delivery tracking information in metadata

    return NextResponse.json(communication);
  } catch (error) {
    console.error('Error sending communication:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send communication' }, 
      { status: 500 }
    );
  }
}