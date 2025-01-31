// src/app/api/staff/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const departmentId = searchParams.get('departmentId');
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const where: any = {
      clientId,
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { employeeId: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(departmentId && { departmentId }),
      ...(role && { role }),
      ...(status && { status })
    };

    const [staff, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        include: {
          department: true
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
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const staff = await prisma.staff.create({
      data: {
        ...body,
        employeeId: `EMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      },
      include: {
        department: true
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create staff member' }, { status: 500 });
  }
}