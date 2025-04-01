import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.findOne();
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const settings = await SiteSettings.findOne();
    if (settings) {
      Object.assign(settings, data);
      await settings.save();
    } else {
      await SiteSettings.create(data);
    }

    return NextResponse.json({ message: 'Site settings updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}