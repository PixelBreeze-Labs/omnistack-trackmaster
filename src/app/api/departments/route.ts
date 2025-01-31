// src/app/api/departments/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    
    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const departments = await prisma.department.findMany({
      where: { 
        clientId,
        isActive: true 
      },
      include: {
        _count: {
          select: { staff: true }
        }
      }
    });

    return NextResponse.json(departments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, code, description, clientId } = body;

    const department = await prisma.department.create({
      data: {
        name,
        code,
        description,
        clientId
      }
    });

    return NextResponse.json(department);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}
