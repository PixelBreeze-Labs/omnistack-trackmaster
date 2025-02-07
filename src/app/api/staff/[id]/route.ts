
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
    const staff = await prisma.staff.update({
      where: { id: params.id },
      data: body,
      include: {
        department: true
      }
    });

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

    // If staff has app access, delete from external systems
    if (staff.documents?.externalIds) {
      // Delete from OmniStack if API key exists
      if (staff.client.omniGatewayApiKey && staff.documents.externalIds.omnistack) {
        const omniStackApi = createOmniStackUserApi(staff.client.omniGatewayApiKey);
        await omniStackApi.deleteUser(staff.documents.externalIds.omnistack);
      }

      // Delete associated user record
      await prisma.user.delete({
        where: { email: staff.email }
      });
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