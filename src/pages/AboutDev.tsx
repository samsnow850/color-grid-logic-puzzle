import React, { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import { 
  Github,
  Twitter,
  Linkedin,
  Mail,
  Calendar,
  Code,
  Coffee,
  FileCode2,
  HeartHandshake,
  Trophy,
  Lightbulb,
  Speaker,
  Cpu,
  GraduationCap,
  Briefcase,
  Hammer
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const AboutDev = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const fadeInAnimationVariants = {
    initial: { opacity: 0, y: 100 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  return (
    <PageWrapper 
      loadingTitle="About the Dev" 
      loadingDescription="Learn more about the developer behind this project"
      loadingColor="purple"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.h1 
              className="text-3xl font-bold mb-8"
              variants={fadeInAnimationVariants}
              initial="initial"
              animate={isInView ? "animate" : "initial"}
            >
              About the Developer
            </motion.h1>
            
            <motion.div 
              className="space-y-8"
              ref={ref}
              variants={fadeInAnimationVariants}
              initial="initial"
              animate={isInView ? "animate" : "initial"}
            >
              {/* Introduction */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Hello!</CardTitle>
                  <CardDescription>A bit about me and my journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    I'm Samuel Snow, a full-stack developer with a passion for creating engaging and user-friendly web applications. 
                    Color Grid Logic is a personal project born out of my love for puzzles and logical challenges. 
                    I enjoy turning complex ideas into simple, intuitive experiences.
                  </p>
                  <Separator className="my-4" />
                  <div className="flex items-center space-x-4">
                    <a 
                      href="https://lovable.dev/@samsnow850" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary flex items-center"
                    >
                      <Github className="h-5 w-5 mr-2" />
                      <span>GitHub</span>
                    </a>
                    <a 
                      href="https://twitter.com/samuelesnow" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary flex items-center"
                    >
                      <Twitter className="h-5 w-5 mr-2" />
                      <span>Twitter</span>
                    </a>
                    <a 
                      href="https://linkedin.com/in/samuel-snow-57981615a" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary flex items-center"
                    >
                      <Linkedin className="h-5 w-5 mr-2" />
                      <span>LinkedIn</span>
                    </a>
                    <a 
                      href="mailto:contact@colorgridlogic.com" 
                      className="text-muted-foreground hover:text-primary flex items-center"
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      <span>Email</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Education</CardTitle>
                  <CardDescription>Where I honed my skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-medium text-lg flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-purple-500" />
                      B.S. in Computer Science
                    </h3>
                    <p className="text-muted-foreground">University of Example, 2012 - 2016</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-medium text-lg flex items-center">
                      <Code className="h-5 w-5 mr-2 text-blue-500" />
                      Online Courses & Bootcamps
                    </h3>
                    <p className="text-muted-foreground">Udemy, Coursera, FreeCodeCamp</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Experience</CardTitle>
                  <CardDescription>A journey through the world of code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-medium text-lg flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-green-500" />
                      Full-Stack Developer
                    </h3>
                    <p className="text-muted-foreground">Acme Corp, 2018 - Present</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Developing and maintaining web applications using React, Node.js, and PostgreSQL.
                    </p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-medium text-lg flex items-center">
                      <Code className="h-5 w-5 mr-2 text-yellow-500" />
                      Freelance Web Developer
                    </h3>
                    <p className="text-muted-foreground">Self-Employed, 2016 - 2018</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Building custom websites and web applications for small businesses and startups.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Skills</CardTitle>
                  <CardDescription>Tools and technologies I'm proficient in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>JavaScript</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>TypeScript</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>React</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>Node.js</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>Express.js</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>PostgreSQL</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>HTML</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>CSS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>Tailwind CSS</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>Git</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span>RESTful APIs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Hobbies & Interests */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Hobbies & Interests</CardTitle>
                  <CardDescription>What I enjoy doing in my free time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Coffee className="h-4 w-4 text-orange-500" />
                      <span>Coding Challenges</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span>Problem Solving</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileCode2 className="h-4 w-4 text-green-500" />
                      <span>Open Source Contributions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Speaker className="h-4 w-4 text-teal-500" />
                      <span>Podcasts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-purple-500" />
                      <span>New Technologies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Why This Project? */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Why Color Grid Logic?</CardTitle>
                  <CardDescription>The motivation behind this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    I created Color Grid Logic as a way to combine my passion for web development with my love for brain-teasing puzzles. 
                    It's a project that allows me to experiment with new technologies, refine my skills, and provide a fun and challenging experience for users.
                  </p>
                  <Separator className="my-4" />
                  <div className="flex items-center space-x-4">
                    <HeartHandshake className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-gray-500">
                      I hope you enjoy playing Color Grid Logic as much as I enjoyed creating it!
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Future Plans */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Future Plans</CardTitle>
                  <CardDescription>What's next for Color Grid Logic</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Adding new puzzle variations and difficulty levels</li>
                    <li>Implementing user accounts and personalized profiles</li>
                    <li>Creating a mobile app version for iOS and Android</li>
                    <li>Integrating social features for sharing scores and challenging friends</li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Support & Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Support & Contact</CardTitle>
                  <CardDescription>Get in touch or support the project</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you have any questions, feedback, or suggestions, feel free to reach out. 
                    I'm always open to new ideas and collaborations.
                  </p>
                  <div className="flex items-center space-x-4">
                    <a 
                      href="mailto:contact@colorgridlogic.com" 
                      className="text-muted-foreground hover:text-primary flex items-center"
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      <span>Contact Me</span>
                    </a>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-sm text-gray-500">
                    If you'd like to support the project, you can:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
                    <li>Share the game with your friends and family</li>
                    <li>Provide feedback and suggestions for improvements</li>
                    <li>Contribute to the project on GitHub</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
};

export default AboutDev;
