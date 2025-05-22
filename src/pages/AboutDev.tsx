
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Linkedin, Globe, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const AboutDev = () => {
  return (
    <PageWrapper 
      loadingTitle="About the Developer" 
      loadingDescription="Loading developer information"
      loadingColor="indigo"
      animationSrc="/animations/dev-loading.lottie"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background to-blue-50 dark:to-blue-950/20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mb-8 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <CardTitle className="text-3xl font-bold">About the Developer</CardTitle>
                  <CardDescription className="text-lg text-blue-100">Samuel Snow</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                      <div className="rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 p-1">
                        <img 
                          src="https://framerusercontent.com/images/WlL1xpY2b8DKwa5RG4q8fKAiCY.png" 
                          alt="Samuel Snow" 
                          className="rounded-lg w-full aspect-square object-cover"
                        />
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <h3 className="font-semibold text-lg">Connect with me</h3>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" className="flex gap-2 items-center">
                            <GitHub className="h-4 w-4" />
                            <span>GitHub</span>
                          </Button>
                          <Button size="sm" variant="outline" className="flex gap-2 items-center">
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                          </Button>
                          <Button size="sm" variant="outline" className="flex gap-2 items-center">
                            <Globe className="h-4 w-4" />
                            <span>Website</span>
                          </Button>
                          <Button size="sm" variant="outline" className="flex gap-2 items-center">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-2 text-blue-700">My Story</h2>
                        <p className="text-gray-700">
                          I was born in Kazakhstan and now call San Francisco, CA, my home. With a strong passion 
                          for technology, I'm eager to dive into the world of coding and HTML, aiming to carve 
                          out a career in the tech industry.
                        </p>
                        
                        <p className="mt-3 text-gray-700">
                          My enthusiasm for self-driving cars, particularly Waymo One, drives my interest in their 
                          innovative advancements. Beyond tech, I love the outdoors and enjoy mountain biking, skiing, 
                          running, and sipping on boba.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-2 text-blue-700">Skills & Expertise</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium text-gray-800">Programming</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                              <li>HTML, CSS, JavaScript</li>
                              <li>React & TypeScript</li>
                              <li>UI/UX Design</li>
                              <li>Responsive Web Development</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">Other Skills</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                              <li>Problem Solving</li>
                              <li>Creative Thinking</li>
                              <li>Project Management</li>
                              <li>Team Collaboration</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-2 text-blue-700">About Color Grid Logic</h2>
                        <p className="text-gray-700">
                          Color Grid Logic is my passion project that combines my love for puzzles and 
                          web development. I wanted to create a game that challenges logical thinking while 
                          being visually appealing and accessible.
                        </p>
                        
                        <p className="mt-3 text-gray-700">
                          The game is built with React, TypeScript, and Tailwind CSS, with a focus on 
                          performance and user experience. I'm constantly working to improve it and add 
                          new features based on player feedback.
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h2 className="text-xl font-semibold mb-2 text-blue-700">Career Goals</h2>
                        <p className="text-gray-700">
                          My dream is to one day work for either Riot Games or Waymo One, where I can merge my 
                          passion for technology and innovation. I'm dedicated to continuous learning and 
                          improvement in my development skills to achieve these goals.
                        </p>
                        
                        <div className="mt-6">
                          <Button asChild className="bg-blue-600 hover:bg-blue-700">
                            <Link to="/contact">Get in Touch</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-blue-700">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold">Color Grid Logic</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        A puzzle game inspired by Sudoku but with colors instead of numbers.
                      </p>
                      <div className="mt-3">
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/game">Play Game</Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h3 className="font-semibold">Portfolio Website</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        My personal portfolio showcasing my projects and skills.
                      </p>
                      <div className="mt-3">
                        <Button size="sm" variant="outline">
                          <a href="https://samuelesnow.co" target="_blank" rel="noopener noreferrer">
                            Visit Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default AboutDev;
