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
      
      // Create staff member first
      const staff = await prisma.staff.create({
        data: {
          ...body,
          employeeId: `EMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          subRole: body.canAccessApp ? 'Sales Associate' : body.subRole // Set subRole automatically
        },
        include: {
          department: true
        }
      });
  
      // If staff member needs app access, create associated accounts
      if (body.canAccessApp && body.password) {
        // Create Supabase user
        const supabaseUser = await createSupabaseUser(body.email, body.password);
  
        // Create OmniStack user
        const omniStackUser = await createOmniStackUser({
          email: body.email,
          name: `${body.firstName} ${body.lastName}`,
          employeeId: staff.employeeId
        });
  
        const hashedPassword = await bcrypt.hash(body.password, 12)
        
        // Create User record in our database
        await prisma.user.create({
          data: {
            email: body.email,
            name: `${body.firstName} ${body.lastName}`,
            supabaseId: supabaseUser.id,
            role: 'SALES',
            clientId: body.clientId,
            password: hashedPassword,
          }
        });
  
        // Update staff record with note about app access
        await prisma.staff.update({
          where: { id: staff.id },
          data: {
            notes: `Sales associate app access granted. User accounts created on ${new Date().toISOString()}`
          }
        });
      }
  
      return NextResponse.json(staff);
    } catch (error) {
      console.error('Staff creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create staff member and associated accounts' }, 
        { status: 500 }
      );
    }
  }

// Add these helper functions
async function createSupabaseUser(email: string, password: string) {
    try {
      // Placeholder for Supabase user creation
      console.log('Creating Supabase user:', { email });
      return {
        id: `sb_${Math.random().toString(36).substr(2, 9)}`, // Simulate Supabase ID
        email
      };
    } catch (error) {
      throw new Error('Failed to create Supabase user');
    }
  }

  async function createOmniStackUser(userData: any) {
    try {
      // Placeholder for OmniStack Gateway API call
      console.log('Creating OmniStack user:', userData);
      return {
        id: `omni_${Math.random().toString(36).substr(2, 9)}`, // Simulate OmniStack ID
        status: 'success'
      };
    } catch (error) {
      throw new Error('Failed to create OmniStack user');
    }
  }