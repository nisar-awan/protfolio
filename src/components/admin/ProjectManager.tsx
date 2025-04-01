'use client';

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'
import { Loader2 } from 'lucide-react'

// Helper function to format URLs
const formatUrl = (url: string): string => {
  if (!url) return url
  
  // If URL doesn't start with http:// or https://, add http://
  if (!url.match(/^https?:\/\//)) {
    return url.startsWith('www.') ? `http://${url}` : `http://${url}`
  }
  
  return url
}

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export function ProjectManager() {
  // Fetch projects with SWR for real-time updates
  const { data: projects = [], error, isLoading } = useSWR<Project[]>('/api/projects', fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds for real-time updates
  })

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [link, setLink] = useState('')

  // Show error toast if project fetch fails
  if (error) {
    toast.error('Failed to load projects')
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setImageUrl('')
    setLink('')
  }

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form fields
    if (!title.trim()) {
      toast.error('Please enter a project title')
      return
    }
    if (!description.trim()) {
      toast.error('Please enter a project description')
      return
    }
    if (!imageUrl) {
      toast.error('Please enter an image URL')
      return
    }
    if (!link) {
      toast.error('Please enter a project link')
      return
    }
    
    try {
      // Format URLs before submission
      const formattedProject = {
        title,
        description,
        imageUrl: formatUrl(imageUrl),
        link: formatUrl(link)
      }

      setIsSubmitting(true)
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedProject),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add project')
      }

      toast.success('Project added successfully')
      resetForm()
      mutate('/api/projects') // Refresh the projects list
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete project')
      }

      mutate('/api/projects') // Refresh the projects list
      toast.success('Project deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete project')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Add New Project</h2>
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Link</label>
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter project link"
              className="mt-1"
              disabled={isSubmitting}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Project...
              </>
            ) : (
              'Add Project'
            )}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Existing Projects</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-center text-gray-500">No projects found</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="mt-2 text-gray-600">{project.description}</p>
              <div className="mt-4 flex justify-between">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Project
                </a>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}