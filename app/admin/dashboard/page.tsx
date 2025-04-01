"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Settings, LogOut, Image, Menu, FolderKanban, Globe } from "lucide-react";
import Preview from './preview';
import { mongodb } from "@/src/lib/mongodb";
import { About } from "@/src/models/About";
import ProfessionalJourneyManager from "@/src/components/admin/ProfessionalJourneyManager";
import useSWR from 'swr';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [logo, setLogo] = useState<File | null>(null);
  
  // SWR fetcher function
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('An error occurred while fetching the data.');
      throw error;
    }
    return res.json();
  };

  // SWR for about data
  const { data: aboutData, mutate: mutateAbout } = useSWR('/api/about', fetcher, {
    refreshInterval: 3000 // Poll every 3 seconds for real-time updates
  });
interface MenuItem {
    id: number;
    label: string;
    path: string;
  }

  interface Project {
    id: number;
    title: string;
    description: string;
    thumbnailUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    isNew?: boolean;
  }

  interface AboutData {
    title: string;
    description: string;
    teamMembers: {
      name: string;
      role: string;
      bio: string;
      imageUrl: string;
    }[];
    skills: {
      category: string;
      items: {
        name: string;
        proficiency: number;
      }[];
    }[];
  }

  interface ContactData {
    email: string;
    phone: string;
    address: string;
    socialLinks: {
      platform: string;
      url: string;
    }[];
  }

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
      }
    };
    fetchMenuItems();
  }, []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [contact, setContact] = useState<ContactData | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch('/api/about');
        const data = await response.json();
        setAbout(data);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      }
    };
    fetchAbout();
  }, []);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch('/api/contact');
        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error('Failed to fetch contact data:', error);
      }
    };
    fetchContact();
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
      // TODO: Implement logo upload to backend
    }
  };

  const handleMenuUpdate = async (id: number, field: string, value: string) => {
    try {
      const updatedMenuItem = menuItems.find((item: { id: number }) => item.id === id);
      if (!updatedMenuItem) return;

      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedMenuItem, [field]: value }),
      });

      if (response.ok) {
        setMenuItems(menuItems.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        ));
      }
    } catch (error) {
      console.error('Failed to update menu item:', error);
    }
  };

  const handleProjectUpdate = async (id: number, field: string, value: string) => {
    try {
      const updatedProject = projects.find(p => p.id === id);
      if (!updatedProject) return;

      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject ? { ...updatedProject, [field]: value } : { [field]: value }),
      });

      if (response.ok) {
        setProjects(projects.map((project: { id: number }) =>
          project.id === id ? { ...project, [field]: value } as const : project
        ));
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin");
  };

  if (!isAuthenticated) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "logo":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Update Logo</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">Upload New Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </div>
              {logo && (
                <div className="mt-4">
                  <p>Selected file: {logo.name}</p>
                  <Button className="mt-2">Upload Logo</Button>
                </div>
              )}
            </div>
          </Card>
        );
      case "menu":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Edit Menu Items</h2>
            <div className="space-y-4">
              {menuItems.map(item => (
                <div key={item.id} className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(e) => handleMenuUpdate(item.id, "label", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Path</Label>
                    <Input
                      value={item.path}
                      onChange={(e) => handleMenuUpdate(item.id, "path", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button className="mt-4">Save Menu Changes</Button>
            </div>
          </Card>
        );
      case "projects":
        return (
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Manage Projects</h2>
              <Button onClick={() => {
                setProjects([...projects, {
                  id: Date.now(),
                  title: "",
                  description: "",
                  thumbnailUrl: "",
                  githubUrl: "",
                  liveUrl: "",
                  isNew: true
                }]);
              }}>Add New Project</Button>
            </div>
            <div className="space-y-8">
              {projects.map(project => (
                <div key={project.id} className="space-y-4 pb-6 border-b">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={project.title}
                        onChange={(e) => handleProjectUpdate(project.id, "title", e.target.value)}
                        placeholder="Project Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Thumbnail (Recommended: 1200x630px)</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const formData = new FormData();
                            formData.append('id', project.id.toString());
                            formData.append('thumbnail', e.target.files[0]);
                            formData.append('title', project.title);
                            formData.append('description', project.description);
                            formData.append('githubUrl', project.githubUrl || "");
                            formData.append('liveUrl', project.liveUrl || "");

                            const response = await fetch('/api/projects', {
                              method: project.isNew ? 'POST' : 'PUT',
                              body: formData,
                            });

                            if (response.ok) {
                              const updatedProject = await response.json();
                              setProjects(projects.map(p =>
                                p.id === project.id ? { ...updatedProject, isNew: false, title: updatedProject.title || p.title, description: updatedProject.description || p.description, thumbnailUrl: updatedProject.thumbnailUrl || p.thumbnailUrl, githubUrl: updatedProject.githubUrl || p.githubUrl, liveUrl: updatedProject.liveUrl || p.liveUrl } as const : p
                              ));
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={project.description}
                      onChange={(e) => handleProjectUpdate(project.id, "description", e.target.value)}
                      placeholder="Project Description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>GitHub URL</Label>
                      <Input
                        value={project.githubUrl || ""}
                        onChange={(e) => handleProjectUpdate(project.id, "githubUrl", e.target.value)}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Live URL</Label>
                      <Input
                        value={project.liveUrl || ""}
                        onChange={(e) => handleProjectUpdate(project.id, "liveUrl", e.target.value)}
                        placeholder="https://your-project.com"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (project.isNew) {
                          setProjects(projects.filter(p => p.id !== project.id));
                        } else {
                          const response = await fetch(`/api/projects?id=${project.id}`, {
                            method: 'DELETE',
                          });
                          if (response.ok) {
                            setProjects(projects.filter(p => p.id !== project.id));
                          }
                        }
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!project.isNew) {
                          const formData = new FormData();
                          formData.append('id', project.id.toString());
                          formData.append('title', project.title);
                          formData.append('description', (project as { description: string }).description);
                          formData.append('githubUrl', (project as { githubUrl?: string }).githubUrl || "");
                          formData.append('liveUrl', (project as { liveUrl?: string }).liveUrl || "");

                          const response = await fetch('/api/projects', {
                            method: 'PUT',
                            body: formData,
                          });

                          if (response.ok) {
                            const updatedProject = await response.json();
                            setProjects(projects.map(p =>
                              p.id === project.id ? updatedProject : p
                            ));
                          }
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      case "journey":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Professional Journey</h2>
            <ProfessionalJourneyManager />
          </Card>
        );
      case "about":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">About Section</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch('/api/about', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(aboutData)
                });
                if (response.ok) {
                  mutateAbout();
                  toast.success('About section updated successfully');
                }
              } catch (error) {
                toast.error('Failed to update about section');
                console.error('Failed to update about section:', error);
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={aboutData?.title || ""}
                  onChange={(e) => mutateAbout({
                    ...aboutData,
                    title: e.target.value
                  }, false)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={aboutData?.description || ""}
                  onChange={(e) => mutateAbout({
                    ...aboutData,
                    description: e.target.value
                  }, false)}
                />
              </div>
              <Button type="submit" className="mt-4">
                Save Changes
              </Button>
            </form>
          </Card>
        );
      case "contact":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Section</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={contact?.email || ""}
                  onChange={(e) => {
                    if (contact) {
                      setContact({ ...contact, email: e.target.value });
                    } else {
                      setContact({
                        email: e.target.value,
                        phone: "",
                        address: "",
                        socialLinks: []
                      });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={contact?.phone || ""}
                  onChange={(e) => {
                    if (contact) {
                      setContact({ ...contact, phone: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={contact?.address || ""}
                  onChange={(e) => {
                    if (contact) {
                      setContact({ ...contact, address: e.target.value });
                    }
                  }}
                />
              </div>
              <Button className="mt-4" onClick={async () => {
                try {
                  const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contact)
                  });
                  if (response.ok) {
                    alert('Contact section updated successfully');
                  }
                } catch (error) {
                  console.error('Failed to update contact section:', error);
                }
              }}>
                Save Changes
              </Button>
            </div>
          </Card>
        );
      case "preview":
        return <Preview />;
      default:
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Total Projects</h3>
              <p className="text-3xl font-bold">{projects.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Menu Items</h3>
              <p className="text-3xl font-bold">{menuItems.length}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Last Updated</h3>
              <p className="text-xl">Today</p>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-card p-4 space-y-4">
          <div className="text-2xl font-bold pb-4 border-b">Admin Panel</div>
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "dashboard" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "logo" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("logo")}
            >
              <Image className="mr-2 h-4 w-4" />
              Logo
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "menu" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              <Menu className="mr-2 h-4 w-4" />
              Menu
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "projects" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("projects")}
            >
              <FolderKanban className="mr-2 h-4 w-4" />
              Projects
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "journey" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("journey")}
            >
              <Globe className="mr-2 h-4 w-4" />
              Professional Journey
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "about" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <Users className="mr-2 h-4 w-4" />
              About
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "contact" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "preview" ? "bg-accent" : ""}`}
              onClick={() => setActiveTab("preview")}
            >
              <Globe className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}