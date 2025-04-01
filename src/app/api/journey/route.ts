import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Journey from '@/models/Journey';

export async function GET() {
  try {
    await connectToDatabase();
    const journey = await Journey.findOne();
    return NextResponse.json(journey || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch journey data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const journey = await Journey.findOne();
    if (journey) {
      Object.assign(journey, data);
      await journey.save();
    } else {
      await Journey.create(data);
    }

    return NextResponse.json({ message: 'Journey data updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update journey data' },
      { status: 500 }
    );
  }
}