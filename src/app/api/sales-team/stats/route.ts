// app/api/sales-team/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StaffRole } from '@prisma/client';


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const salesStaff = await prisma.staff.findMany({
      where: {
        clientId,
        role: StaffRole.SALES,
        status: 'ACTIVE'
      },
      select: {
        performanceScore: true
      }
    });

    const stats: SalesTeamStats = {
      totalSales: 0, // This would come from Orders table
      salesGrowth: 0,
      conversionRate: 0,
      conversionGrowth: 0,
      activeAssociates: salesStaff.length,
      teamGrowth: 0,
      avgPerformance: salesStaff.reduce((acc, staff) => acc + (staff.performanceScore || 0), 0) / salesStaff.length,
      performanceGrowth: 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Sales stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales stats' }, { status: 500 });
  }
}
