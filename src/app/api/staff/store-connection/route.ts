// app/api/staff/store-connection/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { staffId, storeId, action } = await req.json();

    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { documents: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    const documents = staff.documents || {};
    const storeConnections = documents.storeConnections || [];

    if (action === 'connect') {
      storeConnections.push({
        storeId,
        connectedAt: new Date().toISOString()
      });
    } else if (action === 'disconnect') {
      const index = storeConnections.findIndex(conn => conn.storeId === storeId);
      if (index > -1) {
        storeConnections.splice(index, 1);
      }
    }

    await prisma.staff.update({
      where: { id: staffId },
      data: {
        documents: {
          ...documents,
          storeConnections
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Store connection error:', error);
    return NextResponse.json(
      { error: 'Failed to update store connection' }, 
      { status: 500 }
    );
  }
}