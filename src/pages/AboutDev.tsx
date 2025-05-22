
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";

const AboutDevPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("about");

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <PageWrapper
      loadingTitle="About the Developer"
      loadingDescription="Loading developer information"
      loadingColor="indigo"
      animationSrc="/animations/dev-loading.lottie"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12 px-4 md:px-8 bg-gradient-to-b from-background to-indigo-50 dark:to-indigo-950/20">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start mb-10">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <img
                    src="https://avatars.githubusercontent.com/u/12345678?v=4"
                    alt="Developer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Samuel Snow</h1>
                  <p className="text-lg text-muted-foreground mb-4">Full Stack Developer & Creator of Color Grid Logic</p>
                  
                  <div className="flex justify-center md:justify-start gap-3 mb-4">
                    <Button size="icon" variant="outline" asChild>
                      <a href="https://github.com/samsnow850" target="_blank" rel="noreferrer">
                        <Github size={18} />
                        <span className="sr-only">GitHub</span>
                      </a>
                    </Button>

                    <Button size="icon" variant="outline" asChild>
                      <a href="https://twitter.com/samsnow850" target="_blank" rel="noreferrer">
                        <Twitter size={18} />
                        <span className="sr-only">Twitter</span>
                      </a>
                    </Button>

                    <Button size="icon" variant="outline" asChild>
                      <a href="https://linkedin.com/in/samuelsnow" target="_blank" rel="noreferrer">
                        <Linkedin size={18} />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>

                    <Button size="icon" variant="outline" asChild>
                      <a href="mailto:samuel@colorlogic.com" target="_blank" rel="noreferrer">
                        <Mail size={18} />
                        <span className="sr-only">Email</span>
                      </a>
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <a
                      href="https://samuelesnow.co"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                    >
                      Portfolio <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <Tabs
              value={currentTab}
              onValueChange={handleTabChange}
              className="mb-10"
            >
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="pt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">About Me</h2>
                      <p className="text-muted-foreground">
                        Hello! I'm Samuel Snow, a full stack developer with a passion for creating
                        interactive web experiences. I specialize in building applications with React,
                        TypeScript, and modern web technologies.
                      </p>
                      <p className="text-muted-foreground">
                        Color Grid Logic was born out of my love for puzzle games and my desire to
                        create something that challenges the mind while being visually appealing.
                        When I'm not coding, you can find me hiking, reading sci-fi novels, or trying
                        to beat my own high scores in puzzle games.
                      </p>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-xl font-medium mb-3">Experience</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between">
                              <h4 className="font-medium">Senior Frontend Developer</h4>
                              <span className="text-sm text-muted-foreground">2020 - Present</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Tech Innovations Inc.</p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between">
                              <h4 className="font-medium">Web Developer</h4>
                              <span className="text-sm text-muted-foreground">2017 - 2020</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Creative Solutions Agency</p>
                          </div>
                          
                          <div>
                            <div className="flex justify-between">
                              <h4 className="font-medium">Junior Developer</h4>
                              <span className="text-sm text-muted-foreground">2015 - 2017</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Digital Startups Co.</p>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-xl font-medium mb-3">Education</h3>
                        <div>
                          <div className="flex justify-between">
                            <h4 className="font-medium">Bachelor of Science in Computer Science</h4>
                            <span className="text-sm text-muted-foreground">2011 - 2015</span>
                          </div>
                          <p className="text-sm text-muted-foreground">University of Technology</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="pt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">Technical Skills</h2>
                      
                      <div>
                        <h3 className="text-xl font-medium mb-3">Frontend</h3>
                        <div className="flex flex-wrap gap-2">
                          {["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "GraphQL", "React Query"].map((skill) => (
                            <span key={skill} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-medium mb-3">Backend</h3>
                        <div className="flex flex-wrap gap-2">
                          {["Node.js", "Express", "PostgreSQL", "MongoDB", "Firebase", "AWS", "Docker"].map((skill) => (
                            <span key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-medium mb-3">Tools & Processes</h3>
                        <div className="flex flex-wrap gap-2">
                          {["Git", "GitHub Actions", "Jest", "Cypress", "Figma", "Webpack", "Agile"].map((skill) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="pt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">Featured Projects</h2>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="border rounded-lg overflow-hidden bg-card">
                          <div className="aspect-video bg-muted">
                            <img 
                              src="https://via.placeholder.com/600x400?text=Color+Grid+Logic" 
                              alt="Color Grid Logic" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold">Color Grid Logic</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              A colorful puzzle game built with React, TypeScript, and Tailwind CSS.
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {["React", "TypeScript", "Tailwind"].map((tech) => (
                                <span key={tech} className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <Button size="sm" variant="outline" asChild className="w-full">
                              <a href="https://github.com/samsnow850/color-grid-logic" target="_blank" rel="noreferrer">
                                View Project <ExternalLink size={14} className="ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden bg-card">
                          <div className="aspect-video bg-muted">
                            <img 
                              src="https://via.placeholder.com/600x400?text=Weather+Dashboard" 
                              alt="Weather Dashboard" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold">Weather Dashboard</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              A responsive weather app using OpenWeatherMap API and Chart.js.
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {["React", "API Integration", "Chart.js"].map((tech) => (
                                <span key={tech} className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <Button size="sm" variant="outline" asChild className="w-full">
                              <a href="https://github.com/samsnow850/weather-dashboard" target="_blank" rel="noreferrer">
                                View Project <ExternalLink size={14} className="ml-1" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default AboutDevPage;
