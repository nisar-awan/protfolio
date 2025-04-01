'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';

interface ContactMethod {
  type: string;
  value: string;
  icon?: string;
}

interface ContactData {
  title: string;
  subtitle: string;
  email: string;
  phone?: string;
  address?: string;
  contactMethods: ContactMethod[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContactManager() {
  // Fetch contact data with SWR for real-time updates
  const { data, error, isLoading } = useSWR<ContactData>('/api/contact', fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  // Local state for form data
  const [formData, setFormData] = useState<ContactData>({
    title: '',
    subtitle: '',
    email: '',
    phone: '',
    address: '',
    contactMethods: []
  });

  // Update local state when SWR data changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const [loading, setLoading] = useState(false);

  // Show error toast if contact data fetch fails
  if (error) {
    toast.error('Failed to fetch contact data');
  }

  const handleContactMethodAdd = () => {
    setFormData(prev => ({
      ...prev,
      contactMethods: [...prev.contactMethods, { type: '', value: '', icon: '' }]
    }));
  };

  const handleContactMethodRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.filter((_, i) => i !== index)
    }));
  };

  const handleContactMethodChange = (index: number, field: keyof ContactMethod, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.map((method, i) => 
        i === index ? { ...method, [field]: value } : method
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        mutate('/api/contact'); // Refresh the data
        toast.success('Contact section updated successfully');
      } else {
        throw new Error('Failed to update contact section');
      }
    } catch (error) {
      toast.error('Failed to update contact section');
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
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Contact Methods</h3>
        {formData.contactMethods.map((method, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input
                    value={method.type}
                    onChange={(e) => handleContactMethodChange(index, 'type', e.target.value)}
                    placeholder="e.g., LinkedIn, Twitter, GitHub"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    value={method.value}
                    onChange={(e) => handleContactMethodChange(index, 'value', e.target.value)}
                    placeholder="URL or username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon (optional)</Label>
                  <Input
                    value={method.icon || ''}
                    onChange={(e) => handleContactMethodChange(index, 'icon', e.target.value)}
                    placeholder="Icon name or URL"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleContactMethodRemove(index)}
                >
                  Remove Contact Method
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button type="button" onClick={handleContactMethodAdd}>
          Add Contact Method
        </Button>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}