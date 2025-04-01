"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Code, Feather, ChevronDown, Github, Linkedin, Mail, MoonStar, Sun, Globe, Rocket, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "next-themes";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const projects = [
    {
      title: "AI Content Generator",
      description: "Advanced NLP-powered platform for generating high-quality content",
      tech: ["Next.js", "OpenAI", "TailwindCSS"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60",
      link: "#"
    },
    {
      title: "Smart Analytics Dashboard",
      description: "Real-time data visualization with AI-driven insights",
      tech: ["React", "D3.js", "Machine Learning"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
      link: "#"
    },
    {
      title: "Neural Network Visualizer",
      description: "Interactive tool for visualizing deep learning architectures",
      tech: ["TypeScript", "Three.js", "Python"],
      image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&auto=format&fit=crop&q=60",
      link: "#"
    }
  ];

  const experiences = [
    {
      title: "Senior AI Developer",
      company: "TechCorp Inc.",
      period: "2022 - Present",
      description: "Leading AI integration projects and developing innovative solutions",
      icon: <Rocket className="w-6 h-6" />
    },
    {
      title: "Full Stack Developer",
      company: "WebSolutions Ltd",
      period: "2020 - 2022",
      description: "Built scalable web applications and implemented ML models",
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "AI Research Assistant",
      company: "AI Research Lab",
      period: "2018 - 2020",
      description: "Conducted research in NLP and computer vision",
      icon: <Brain className="w-6 h-6" />
    }
  ];

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div
          className="relative w-20 h-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Brain className="w-full h-full text-primary" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{
              scale: [1, 1.5],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors z-50"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? <Sun className="w-6 h-6" /> : <MoonStar className="w-6 h-6" />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-40 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Brain className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">MindSculpt AI</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex space-x-8"
            >
              {["About", "Projects", "Experience", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-20" />
              <Brain className="w-24 h-24 text-primary relative z-10" />
            </motion.div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          Unlocking the
            <br />
            Art of AI
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Crafting Tomorrow’s Content Today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              Explore Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary hover:bg-primary/10"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact Me
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-8"
        >
          <ChevronDown className="w-8 h-8 text-muted-foreground" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-muted/50" id="about">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            About Me
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold mb-4">Passionate About AI & Development</h3>
              <p className="text-muted-foreground mb-6">
                With over 5 years of experience in AI and web development, I specialize in creating
                innovative solutions that bridge the gap between artificial intelligence and user experience.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">5+</h4>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">50+</h4>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop&q=60"
                  alt="AI Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-lg shadow-xl">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4" id="skills">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Core Expertise
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12 text-blue-500" />,
                title: "AI Integration",
                description: "Leveraging cutting-edge AI technologies to create intelligent solutions",
              },
              {
                icon: <Code className="w-12 h-12 text-purple-500" />,
                title: "Web Development",
                description: "Building modern, responsive, and scalable web applications",
              },
              {
                icon: <Feather className="w-12 h-12 text-pink-500" />,
                title: "Content Creation",
                description: "Crafting engaging, AI-powered content that resonates with audiences",
              },
            ].map((skill, index) => (
              <Card
                key={index}
                className="p-6 bg-card/50 hover:bg-card/80 transition-all duration-300"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-4 flex justify-center">{skill.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground">{skill.description}</p>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 bg-muted/50" id="projects">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Featured Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setActiveProject(index)}
                onHoverEnd={() => setActiveProject(null)}
                className="relative group"
              >
                <Card className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      className="group/button"
                      asChild
                    >
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/button:translate-x-1" />
                      </a>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4" id="experience">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Professional Journey
          </motion.h2>
          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:bg-card/80 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {experience.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{experience.title}</h3>
                      <p className="text-muted-foreground mb-2">{experience.company} • {experience.period}</p>
                      <p className="text-muted-foreground">{experience.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-muted/50" id="contact">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
            <p className="text-muted-foreground">
              Interested in collaboration? Let's discuss your next project.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <a href="mailto:your.email@example.com" className="text-muted-foreground hover:text-primary transition-colors">
                      your.email@example.com
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      LinkedIn Profile
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <Github className="w-5 h-5 text-muted-foreground" />
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      GitHub Profile
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Send a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Your message"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground mb-4 md:mb-0">
              © 2024 MindSculpt AI All Rights Reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}