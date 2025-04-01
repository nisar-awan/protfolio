import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import About from '@/src/models/About';
import type { Document } from 'mongoose';

interface AboutDocument extends Document {
  // Add your About document properties here
}

export async function GET() {
  try {
    await connectToDatabase();
    const about: AboutDocument | null = await About.findOne();
    return NextResponse.json(about || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const about: AboutDocument | null = await About.findOne();
    if (about) {
      Object.assign(about, data);
      await about.save();
    } else {
      await About.create(data);
    }

    return NextResponse.json({ message: 'About data updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    );
  }
}