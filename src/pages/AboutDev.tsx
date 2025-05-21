
import React, { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import { 
  Book, 
  Brain, 
  Code, 
  ExternalLink, 
  Github, 
  GraduationCap, 
  Heart, 
  Laptop, 
  Linkedin, 
  Mail, 
  Map, 
  Mountain, 
  Navigation, 
  Twitter 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { animations } from "@/assets/animations";

// Feature component with animation
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const AboutDev = () => {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  const skills = [
    { 
      icon: <Code className="text-purple-600 dark:text-purple-400" />, 
      title: "Web Development", 
      description: "Passionate about creating intuitive, responsive web experiences with modern technologies." 
    },
    { 
      icon: <Mountain className="text-purple-600 dark:text-purple-400" />, 
      title: "Outdoor Enthusiast", 
      description: "Love mountain biking, skiing, and running in the beautiful outdoors." 
    },
    { 
      icon: <Brain className="text-purple-600 dark:text-purple-400" />, 
      title: "Tech Innovator", 
      description: "Enthusiastic about self-driving technology, particularly Waymo One's advancements." 
    },
    { 
      icon: <GraduationCap className="text-purple-600 dark:text-purple-400" />, 
      title: "Continual Learner", 
      description: "Always seeking to expand knowledge and skills in the ever-evolving tech landscape." 
    }
  ];

  return (
    <PageWrapper 
      loadingTitle="About the Developer" 
      loadingDescription="Loading developer information"
      loadingColor="indigo"
      animationSrc={animations.aboutDev}
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-background"
        >
          {/* Animated shapes in background */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-indigo-300 dark:bg-indigo-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-60 h-60 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/30">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400"></span> Developer Profile
                  </span>
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                  About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Developer</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  My passion lies in the intersection of art and technology, creating visually captivating 
                  interfaces and elevating overall user digital experiences.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* My Story Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Badge className="mb-3 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/30">
                  My Journey
                </Badge>
                <h2 className="text-3xl font-bold mb-6">From Kazakhstan <br />to San Francisco</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300">
                    I was born in Kazakhstan and now call San Francisco, CA, my home. With a strong passion 
                    for technology, I'm eager to dive into the world of coding and HTML, aiming to carve 
                    out a career in the tech industry.
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    My enthusiasm for self-driving cars, particularly Waymo One, drives my interest in their 
                    innovative advancements. Beyond tech, I love the outdoors and enjoy mountain biking, skiing, 
                    running, and sipping on boba.
                  </p>
                </div>
                
                <div className="flex items-center mt-8 space-x-4">
                  <div className="flex items-center">
                    <Map className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-200">San Francisco, CA</span>
                  </div>
                  <div className="flex items-center">
                    <Laptop className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-200">Web Developer</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-lg z-0"></div>
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg z-0"></div>
                  <img 
                    src="https://framerusercontent.com/images/Z3CluPcqcpgM9gYPhXlAA4kflM.jpg?scale-down-to=1024" 
                    alt="Samuel Snow" 
                    className="object-cover rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 relative z-10 w-full max-w-md"
                  />
                </div>
              </motion.div>
            </div>
            
            {/* Skills and Interests */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <Badge className="mb-3 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/30">
                  Skills & Interests
                </Badge>
                <h2 className="text-3xl font-bold mb-4">What Drives Me</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  A diverse set of skills and passions that shape my approach to technology and life.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {skills.map((skill, index) => (
                  <FeatureCard 
                    key={index}
                    icon={skill.icon}
                    title={skill.title}
                    description={skill.description}
                    delay={0.1 * index}
                  />
                ))}
              </div>
            </div>
            
            {/* Career Goals */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-xl p-8 md:p-12 mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-3xl font-bold mb-6 text-center">Career Goals</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
                  My dream is to one day work for either Riot Games or Waymo One, where I can merge my 
                  passion for technology and innovation. This space is where I share my journey, values, 
                  and aspirations, giving you a glimpse into who I am and what I strive to achieve.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                          <Navigation className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </span>
                        Waymo One
                      </CardTitle>
                      <CardDescription>Self-Driving Technology</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Contribute to the future of autonomous transportation technology and help create safer, more efficient mobility solutions.
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                          <Laptop className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </span>
                        Riot Games
                      </CardTitle>
                      <CardDescription>Game Development</CardDescription>
                    </CardHeader>
                    <CardContent>
                      Join a team that creates engaging, innovative gaming experiences that bring joy and connection to millions of players worldwide.
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
            
            {/* Connect */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Let's Connect</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                Feel free to reach out if you'd like to discuss technology, share outdoor adventure stories, or talk about career opportunities.
              </p>
              
              <div className="flex justify-center space-x-4">
                <Button variant="outline" className="rounded-full h-12 w-12 p-0 flex items-center justify-center">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="rounded-full h-12 w-12 p-0 flex items-center justify-center">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="rounded-full h-12 w-12 p-0 flex items-center justify-center">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="rounded-full h-12 w-12 p-0 flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default AboutDev;
