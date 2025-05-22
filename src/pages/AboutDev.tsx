
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { animations } from "@/assets/animations";

const AboutDev = () => {
  return (
    <PageWrapper 
      loadingTitle="About the Developer" 
      loadingDescription="Loading developer information"
      loadingColor="indigo"
      animationSrc={animations.aboutDev}
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 md:p-12 bg-gradient-to-b from-background to-blue-50 dark:to-blue-950/20">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">About the Developer</CardTitle>
                <CardDescription className="text-lg">Where Art Meets Technology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg">
                    My passion lies in the intersection of art and technology, creating visually captivating 
                    interfaces and elevating overall user digital experiences.
                  </p>
                  
                  <Separator className="my-6" />
                  
                  <h2 className="text-2xl font-semibold mb-4 text-primary">My Story</h2>
                  <p>
                    I was born in Kazakhstan and now call San Francisco, CA, my home. With a strong passion 
                    for technology, I'm eager to dive into the world of coding and HTML, aiming to carve 
                    out a career in the tech industry.
                  </p>
                  
                  <p className="mt-4">
                    My enthusiasm for self-driving cars, particularly Waymo One, drives my interest in their 
                    innovative advancements. Beyond tech, I love the outdoors and enjoy mountain biking, skiing, 
                    running, and sipping on boba.
                  </p>
                  
                  <Separator className="my-6" />
                  
                  <h2 className="text-2xl font-semibold mb-4 text-primary">Career Goals</h2>
                  <p>
                    My dream is to one day work for either Riot Games or Waymo One, where I can merge my 
                    passion for technology and innovation.
                  </p>
                  
                  <p className="mt-4">
                    This space is where I share my journey, values, and aspirations, giving you a glimpse 
                    into who I am and what I strive to achieve. Feel free to connect and learn more about 
                    my story and professional goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default AboutDev;
