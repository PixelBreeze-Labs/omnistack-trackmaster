
// src/app/api/staff/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
    await prisma.staff.update({
      where: { id: params.id },
      data: { status: 'INACTIVE' }
    });

    return NextResponse.json({ message: 'Staff member deactivated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to deactivate staff member' }, { status: 500 });
  }
}