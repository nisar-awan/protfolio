import { NextResponse } from 'next/server'
import { connectToDatabase, connectMongoose } from '@/lib/mongodb'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectMongoose()
    const projects = await Project.find({}).sort({ createdAt: -1 })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Project fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectMongoose()
    const project = await Project.create(body)
    return NextResponse.json(project)
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
} 