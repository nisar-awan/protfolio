'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';

interface JourneyItem {
  title: string;
  organization: string;
  period: string;
  description: string;
  technologies?: string[];
}

interface ProfessionalJourneyData {
  title: string;
  subtitle: string;
  items: JourneyItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfessionalJourneyManager() {
  // Fetch journey data with SWR for real-time updates
  const { data, error, isLoading } = useSWR<ProfessionalJourneyData>('/api/journey', fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  // Local state for form data
  const [formData, setFormData] = useState<ProfessionalJourneyData>({
    title: '',
    subtitle: '',
    items: []
  });

  // Update local state when SWR data changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const [loading, setLoading] = useState(false);

  // Show error toast if journey data fetch fails
  if (error) {
    toast.error('Failed to fetch professional journey data');
  }

  const handleJourneyItemAdd = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { title: '', organization: '', period: '', description: '', technologies: [] }]
    }));
  };

  const handleJourneyItemRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleJourneyItemChange = (index: number, field: keyof JourneyItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleTechnologiesChange = (index: number, value: string) => {
    const technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    handleJourneyItemChange(index, 'technologies', technologies);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        mutate('/api/journey'); // Refresh the data
        toast.success('Professional journey updated successfully');
      } else {
        throw new Error('Failed to update professional journey');
      }
    } catch (error) {
      toast.error('Failed to update professional journey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Section Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Section Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Journey Items</h3>
        {formData.items.map((item, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => handleJourneyItemChange(index, 'title', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input
                    value={item.organization}
                    onChange={(e) => handleJourneyItemChange(index, 'organization', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Input
                    value={item.period}
                    onChange={(e) => handleJourneyItemChange(index, 'period', e.target.value)}
                    placeholder="e.g., Jan 2020 - Present"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => handleJourneyItemChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies (comma-separated)</Label>
                  <Input
                    value={item.technologies?.join(', ') || ''}
                    onChange={(e) => handleTechnologiesChange(index, e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleJourneyItemRemove(index)}
                >
                  Remove Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button type="button" onClick={handleJourneyItemAdd}>
          Add Journey Item
        </Button>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}