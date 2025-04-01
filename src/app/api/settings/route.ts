import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import SiteSettings from '@/models/SiteSettings'

export async function GET() {
  try {
    await connectToDatabase()
    const settings = await SiteSettings.findOne({})
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()
    const settings = await SiteSettings.findOne({})
    
    if (settings) {
      Object.assign(settings, body)
      await settings.save()
    } else {
      await SiteSettings.create(body)
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
} 