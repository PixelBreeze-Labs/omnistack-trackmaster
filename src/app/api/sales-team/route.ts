// app/api/sales-team/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StaffRole } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const search = searchParams.get('search') || '';
    const position = searchParams.get('position');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const where = {
      clientId,
      role: StaffRole.SALES,
      OR: search ? [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ] : undefined,
      subRole: position !== 'all' ? position : undefined,
      status: status !== 'all' ? status : undefined
    };

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        include: {
          department: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.staff.count({ where })
    ]);

    return NextResponse.json({
      items: staff,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Sales team fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales team' }, { status: 500 });
  }
}
