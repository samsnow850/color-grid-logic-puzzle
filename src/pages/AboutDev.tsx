
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Mail, MapPin, Heart, Code, Bike, BookOpen, Coffee, Gamepad2, Car } from "lucide-react";

const AboutDev = () => {
  const [activeSection, setActiveSection] = useState("bio");
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageWrapper 
      loadingTitle="About the Developer" 
      loadingDescription="Loading developer profile"
      loadingColor="blue"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-12 px-4 md:px-8 bg-gradient-to-b from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">About the Developer</h1>
              <p className="text-xl text-blue-700 max-w-2xl mx-auto">
                A journey through technology, art, and innovation
              </p>
            </motion.div>

            {/* Profile section */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-1"
              >
                <Card>
                  <CardContent className="pt-6 flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-6 flex items-center justify-center overflow-hidden shadow-lg">
                      <Code size={64} className="text-white" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-2">Developer</h2>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>San Francisco, CA</span>
                    </div>
                    
                    <div className="flex space-x-2 mb-6">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <GitHubLogoIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <LinkedInLogoIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="w-full space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Design</span>
                        <span className="text-sm text-muted-foreground">90%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Technology</span>
                        <span className="text-sm text-muted-foreground">85%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Creativity</span>
                        <span className="text-sm text-muted-foreground">95%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:col-span-2"
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex space-x-4 mb-4">
                      <Button 
                        variant={activeSection === "bio" ? "default" : "outline"} 
                        onClick={() => setActiveSection("bio")}
                      >
                        About Me
                      </Button>
                      <Button 
                        variant={activeSection === "passion" ? "default" : "outline"} 
                        onClick={() => setActiveSection("passion")}
                      >
                        Passion
                      </Button>
                      <Button 
                        variant={activeSection === "interests" ? "default" : "outline"} 
                        onClick={() => setActiveSection("interests")}
                      >
                        Interests
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {activeSection === "bio" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-lg mb-4">
                          I was born in Kazakhstan and now call San Francisco, CA, my home. With a strong passion for 
                          technology, I'm eager to dive into the world of coding and HTML, aiming to carve out a 
                          career in the tech industry.
                        </p>
                        <p className="text-lg">
                          This space is where I share my journey, values, and aspirations, giving you a glimpse into 
                          who I am and what I strive to achieve. Feel free to connect and learn more about my story 
                          and professional goals.
                        </p>
                      </motion.div>
                    )}
                    
                    {activeSection === "passion" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-lg mb-4">
                          My passion lies in the intersection of art and technology, creating visually captivating 
                          interfaces and elevating overall user digital experiences.
                        </p>
                        <p className="text-lg mb-4">
                          My enthusiasm for self-driving cars, particularly Waymo One, drives my interest in their 
                          innovative advancements.
                        </p>
                        <p className="text-lg">
                          My dream is to one day work for either Riot Games or Waymo One, where I can merge my passion 
                          for technology and innovation.
                        </p>
                      </motion.div>
                    )}
                    
                    {activeSection === "interests" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="text-lg mb-4">
                          Beyond tech, I love the outdoors and enjoy various activities:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Bike className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Mountain Biking</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <BookOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Skiing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Heart className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Running</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Coffee className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Sipping on Boba</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Gamepad2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Gaming</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <Car className="h-5 w-5 text-blue-600" />
                            </div>
                            <span>Self-driving Technology</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Journey and Goals */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Journey & Goals</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Code className="h-5 w-5 text-green-600" />
                        </div>
                        Professional Journey
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <span className="bg-green-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-green-500"></span>
                          </span>
                          <p>Diving into coding and HTML to build a foundation in web development</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-green-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-green-500"></span>
                          </span>
                          <p>Learning to create visually captivating interfaces</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-green-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-green-500"></span>
                          </span>
                          <p>Focusing on elevating user digital experiences</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-green-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-green-500"></span>
                          </span>
                          <p>Building projects that combine art and technology</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <Gamepad2 className="h-5 w-5 text-purple-600" />
                        </div>
                        Future Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-purple-500"></span>
                          </span>
                          <p>Work for Riot Games, contributing to innovative gaming experiences</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-purple-500"></span>
                          </span>
                          <p>Alternatively, join Waymo One to advance self-driving technology</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-purple-500"></span>
                          </span>
                          <p>Merge passion for technology and innovation in a meaningful career</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="bg-purple-100 p-1 rounded-full flex-shrink-0 mt-1">
                            <span className="block w-2 h-2 rounded-full bg-purple-500"></span>
                          </span>
                          <p>Continue developing skills at the intersection of art and technology</p>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-6">Connect With Me</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Feel free to reach out if you'd like to discuss technology, design, or share outdoor activity recommendations!
              </p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Button>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default AboutDev;
