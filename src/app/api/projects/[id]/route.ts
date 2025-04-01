import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import Project from '@/models/Project'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    await Project.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
} 