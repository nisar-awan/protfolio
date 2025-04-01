'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import useSWR, { mutate } from 'swr';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

interface SkillItem {
  name: string;
  proficiency: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

interface AboutData {
  title: string;
  description: string;
  teamMembers: TeamMember[];
  skills: SkillCategory[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AboutManager() {
  // Fetch about data with SWR for real-time updates
  const { data, error, isLoading } = useSWR<AboutData>('/api/about', fetcher, {
    refreshInterval: 3000, // Poll every 3 seconds for real-time updates
  });

  // Local state for form data
  const [formData, setFormData] = useState<AboutData>({
    title: '',
    description: '',
    teamMembers: [],
    skills: []
  });

  // Update local state when SWR data changes
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Show error toast if about data fetch fails
  if (error) {
    toast.error('Failed to fetch about data');
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleTeamMemberAdd = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: '', role: '', bio: '', imageUrl: '' }]
    }));
  };

  const handleTeamMemberRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleSkillCategoryAdd = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: '', items: [] }]
    }));
  };

  const handleSkillAdd = (categoryIndex: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((category, i) => 
        i === categoryIndex
          ? { ...category, items: [...category.items, { name: '', proficiency: 0 }] }
          : category
      )
    }));
  };

  const handleSkillChange = (categoryIndex: number, skillIndex: number, field: keyof SkillItem, value: any) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[categoryIndex].items[skillIndex][field] = field === 'proficiency' ? parseInt(value) : value;
      return { ...prev, skills: newSkills };
    });
  };

  const handleCategoryChange = (categoryIndex: number, value: string) => {
    setFormData(prev => {
      const newSkills = [...prev.skills];
      newSkills[categoryIndex].category = value;
      return { ...prev, skills: newSkills };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        mutate('/api/about'); // Refresh the data
        toast.success('About section updated successfully');
      } else {
        throw new Error('Failed to update about section');
      }
    } catch (error) {
      toast.error('Failed to update about section');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          {formData.teamMembers.map((member, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={member.role}
                      onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      value={member.bio}
                      onChange={(e) => handleTeamMemberChange(index, 'bio', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      type="text"
                      value={member.imageUrl}
                      onChange={(e) => handleTeamMemberChange(index, 'imageUrl', e.target.value)}
                      placeholder="Enter image URL"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleTeamMemberRemove(index)}
                  >
                    Remove Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button type="button" onClick={handleTeamMemberAdd}>
            Add Team Member
          </Button>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          {formData.skills.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                      value={category.category}
                      onChange={(e) => handleCategoryChange(categoryIndex, e.target.value)}
                      required
                    />
                  </div>
                  {category.items.map((skill, skillIndex) => (
                    <div key={skillIndex} className="grid gap-4">
                      <div className="space-y-2">
                        <Label>Skill Name</Label>
                        <Input
                          value={skill.name}
                          onChange={(e) => handleSkillChange(categoryIndex, skillIndex, 'name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Proficiency (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={skill.proficiency}
                          onChange={(e) => handleSkillChange(categoryIndex, skillIndex, 'proficiency', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => handleSkillAdd(categoryIndex)}
                  >
                    Add Skill
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button type="button" onClick={handleSkillCategoryAdd}>
            Add Skill Category
          </Button>
        </TabsContent>
      </Tabs>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}