'use client';

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface SiteSettings {
  logo: string
  siteTitle: string
  headerText: string
  footerText: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SiteSettings() {
  // Fetch settings with SWR for real-time updates
  const { data, error, isLoading } = useSWR<SiteSettings>('/api/settings', fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds for real-time updates
  })

  // Create local state for form fields
  const [formData, setFormData] = useState<SiteSettings>({
    logo: '',
    siteTitle: '',
    headerText: '',
    footerText: '',
  })
  
  // Update local state when SWR data changes
  useState(() => {
    if (data) {
      setFormData(data)
    }
  }, [data])

  const [loading, setLoading] = useState(false)

  // Show error toast if settings fetch fails
  if (error) {
    toast.error('Failed to load settings')
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof SiteSettings) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        mutate('/api/settings') // Refresh the settings data
        toast.success('Settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-bold">Site Settings</h2>
      <form onSubmit={handleSaveSettings} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Logo URL</label>
          <Input
            type="text"
            value={formData.logo}
            onChange={(e) => handleInputChange(e, 'logo')}
            className="mt-1"
            placeholder="Enter logo URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Title</label>
          <Input
            type="text"
            value={formData.siteTitle}
            onChange={(e) => handleInputChange(e, 'siteTitle')}
            className="mt-1"
            placeholder="Enter site title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Header Text</label>
          <Textarea
            value={formData.headerText}
            onChange={(e) => handleInputChange(e, 'headerText')}
            className="mt-1"
            placeholder="Enter header text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Footer Text</label>
          <Textarea
            value={formData.footerText}
            onChange={(e) => handleInputChange(e, 'footerText')}
            className="mt-1"
            placeholder="Enter footer text"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  )
}