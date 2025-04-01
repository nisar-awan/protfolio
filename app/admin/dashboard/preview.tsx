"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, Globe, Rocket } from "lucide-react";

export default function Preview() {
  const [projects, setProjects] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, menuRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/menu')
        ]);
        const projectsData = await projectsRes.json();
        const menuData = await menuRes.json();
        setProjects(projectsData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 bg-background">
      <h2 className="text-2xl font-semibold mb-6">Live Preview</h2>
      
      <div className="space-y-8">
        {/* Menu Preview */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Navigation Menu</h3>
          <div className="flex gap-4">
            {menuItems.map((item, index) => (
              <div key={index} className="px-4 py-2 bg-accent rounded-md">
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Projects Preview */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Card className="overflow-hidden">
                  {project.thumbnailUrl && (
                    <div className="relative h-48 w-full">
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <h4 className="text-lg font-semibold">{project.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}