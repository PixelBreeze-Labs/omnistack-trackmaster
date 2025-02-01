// src/app/api/staff/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSupabaseUser } from '@/lib/supabase-admin';
import { createOmniStackUserApi } from '../external/omnigateway/user';
import bcrypt from 'bcrypt'

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
      
       // First verify the client exists
       const client = await prisma.client.findUnique({
        where: { id: body.clientId }
      });

      if (!client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
      }
      

        // Extract password for user creation but don't send it to staff model
        const { password, ...staffData } = body;
      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create staff member first
        const staff = await prisma.staff.create({
            data: {
              ...staffData,
              employeeId: `EMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
              subRole: body.canAccessApp ? 'Sales Associate' : body.subRole,
              dateOfJoin: new Date(body.dateOfJoin).toISOString()
            },
            include: {
              department: true,
              client: true
            }
          });
  
        // If staff member needs app access, create associated accounts
        if (body.canAccessApp && password) {
          // Create Supabase user
          const supabaseUser = await createSupabaseUser(body.email, password);
  
          // Get client's OmniStack API key
          if (!staff.client.omniGatewayApiKey) {
            throw new Error('Client OmniStack API key not configured');
          }
  
          // Create OmniStack user
          const omniStackApi = createOmniStackUserApi(staff.client.omniGatewayApiKey);
          const omniStackUser = await omniStackApi.createUser({
            name: body.firstName,
            surname: body.lastName,
            email: body.email,
            password: body,
            external_ids: [staff.id] // Add our staff ID as external ID
          });
  
          const hashedPassword = await bcrypt.hash(password, 12);
          
          // Create User record in our database
          await prisma.user.create({
            data: {
              email: body.email,
              name: `${body.firstName} ${body.lastName}`,
              supabaseId: supabaseUser.id,
              role: 'SALES',
              clientId: body.clientId,
              password: hashedPassword,
              externalIds: {
                supabase: supabaseUser.id,
                omnistack: omniStackUser.id
              }
            }
          });
  
          // Update staff record with note and external IDs
          await prisma.staff.update({
            where: { id: staff.id },
            data: {
              notes: `Sales associate app access granted. User accounts created on ${new Date().toISOString()}`,
              documents: {
                externalIds: {
                  omnistack: omniStackUser.id,
                  supabase: supabaseUser.id
                }
              }
            }
          });
        }
  
        return staff;
      });
  
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to create staff member' }, 
        { status: 500 }
      );
    }
  }