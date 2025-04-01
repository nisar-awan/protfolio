import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/src/lib/mongodb';
import Contact from '@/src/models/Contact';

export async function GET() {
  try {
    await connectToDatabase();
    const contact = await Contact.findOne();
    return NextResponse.json(contact || {});
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();

    const contact = await Contact.findOne();
    if (contact) {
      Object.assign(contact, data);
      await contact.save();
    } else {
      await Contact.create(data);
    }

    return NextResponse.json({ message: 'Contact data updated successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update contact data' },
      { status: 500 }
    );
  }
}