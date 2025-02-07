// app/api/verify-access/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Validate API key
    const headersList = headers();
    const apiKey = headersList.get('x-api-key');
    const validApiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;

    if (!apiKey || apiKey !== validApiKey) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        message: 'Invalid or missing API key' 
      }, { status: 401 });
    }

    const body = await req.json();
    const { external_ids } = body;

    if (!external_ids || !Array.isArray(external_ids)) {
      return NextResponse.json({ 
        hasAccess: false, 
        message: 'Invalid external_ids' 
      }, { status: 400 });
    }

    // Find staff member with app access
    const staff = await prisma.staff.findFirst({
      where: {
        id: external_ids.staffId,
        status: 'ACTIVE',
        canAccessApp: true
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        subRole: true,
        clientId: true
      }
    });

    if (!staff) {
      return NextResponse.json({ 
        hasAccess: false, 
        message: 'Staff member not found or inactive' 
      });
    }

    // Staff found and has access
    return NextResponse.json({
      hasAccess: true,
      permissions: {
        canUseApp: true,
      },
      staff: {
        id: staff.id,
        name: `${staff.firstName} ${staff.lastName}`,
        email: staff.email,
        role: staff.role,
        subRole: staff.subRole,
        clientId: staff.clientId
      }
    });

  } catch (error) {
    console.error('Verify access error:', error);
    return NextResponse.json({ 
      hasAccess: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}