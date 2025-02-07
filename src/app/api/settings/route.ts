// app/api/settings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { settings: true }
    });

    // Initialize default settings if none exist
    const settings = client?.settings || {
     
      integrations: {
        venueBoost: {
          enabled: false
        }
      }
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { clientId, settings } = await request.json();

    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { 
        settings: settings
      },
      select: { settings: true }
    });

    return NextResponse.json(updatedClient.settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}