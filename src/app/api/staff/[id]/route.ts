// src/app/api/staff/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOmniStackUserApi } from '../../external/omnigateway/user';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
      include: {
        department: true
      }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff member' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    // First get the existing staff to check for changes to communication preferences
    const existingStaff = await prisma.staff.findUnique({
      where: { id: params.id },
      include: { client: true }
    });
    
    if (!existingStaff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }
    
    // Update the staff record
    const staff = await prisma.staff.update({
      where: { id: params.id },
      data: body,
      include: {
        department: true
      }
    });
    
    // If communication preferences changed and this staff has an associated user,
    // update the user's communication preferences too
    if (
      existingStaff.documents?.externalIds?.omnistack && 
      body.communicationPreferences &&
      (
        body.communicationPreferences.email !== existingStaff.communicationPreferences?.email ||
        body.communicationPreferences.sms !== existingStaff.communicationPreferences?.sms
      )
    ) {
      // Find user by email
      const user = await prisma.user.findFirst({
        where: { email: existingStaff.email }
      });
      
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            communicationPreferences: {
              email: body.communicationPreferences.email,
              sms: body.communicationPreferences.sms
            }
          }
        });
      }
    }

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update staff member' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the staff member to delete
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
      include: { client: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    // Check if client is MetroSuites
    const isMetroSuites = staff.client.type === 'METROSUITES';

    // If staff has app access or external IDs, delete from external systems
    if (staff.documents?.externalIds) {
      // Delete from OmniStack if API key exists
      if (staff.client.omniGatewayApiKey && staff.documents.externalIds.omnistack) {
        const omniStackApi = createOmniStackUserApi(staff.client.omniGatewayApiKey);
        await omniStackApi.deleteUser(staff.documents.externalIds.omnistack);
      }

      // Delete associated user record if it exists
      try {
        await prisma.user.delete({
          where: { email: staff.email }
        });
      } catch (error) {
        console.error('Error deleting user record:', error);
        // Continue with staff deletion even if user deletion fails
      }
    }

    // Finally delete the staff record
    await prisma.staff.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete staff error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}