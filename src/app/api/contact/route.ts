import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    await connectToDatabase();
    const contactData = await Contact.findOne();
    
    if (!contactData) {
      // Return default structure if no data exists
      return NextResponse.json({
        title: 'Let\'s Connect',
        subtitle: 'Get in touch with me',
        email: 'example@example.com',
        contactMethods: []
      });
    }
    
    return NextResponse.json(contactData);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.subtitle || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update or insert contact data
    const contact = await Contact.findOne();
    if (contact) {
      Object.assign(contact, data);
      await contact.save();
    } else {
      await Contact.create(data);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { error: 'Failed to update contact data' },
      { status: 500 }
    );
  }
}