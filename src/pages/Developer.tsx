
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const Developer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-purple-50 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 text-primary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Developer Profile
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              My passion lies in the intersection of art and technology, creating visually captivating interfaces and elevating overall user digital experiences.
            </motion.p>
          </div>
        </section>

        {/* My Journey Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">My Journey</h2>
                <div className="h-1 w-20 bg-primary mb-6"></div>
                <h3 className="text-xl font-semibold mb-4">From Kazakhstan<br />to San Francisco</h3>
                <p className="text-muted-foreground mb-6">
                  I was born in Kazakhstan and now call San Francisco, CA, my home. With a strong passion for technology, I'm eager to dive into the world of coding and HTML, aiming to carve out a career in the tech industry.
                </p>
                <p className="text-muted-foreground mb-6">
                  My enthusiasm for self-driving cars, particularly Waymo One, drives my interest in their innovative advancements. Beyond tech, I love the outdoors and enjoy mountain biking, skiing, running, and sipping on boba.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="bg-muted px-3 py-1 rounded-full">San Francisco, CA</div>
                  <div className="bg-muted px-3 py-1 rounded-full">Web Developer</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/10 to-purple-100 p-8 rounded-xl">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">Samuel Snow</h3>
                  <p className="text-muted-foreground">Web Developer & Tech Enthusiast</p>
                  <div className="h-0.5 w-full bg-gray-100 my-4"></div>
                  <div className="space-y-2">
                    <p className="flex justify-between"><span className="font-medium">Location:</span> <span>San Francisco, CA</span></p>
                    <p className="flex justify-between"><span className="font-medium">Focus:</span> <span>Web Development</span></p>
                    <p className="flex justify-between"><span className="font-medium">Interests:</span> <span>Waymo, Outdoor Sports</span></p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-2">Skills & Interests</h2>
              <p className="text-muted-foreground">What Drives Me</p>
              <div className="h-1 w-20 bg-primary mx-auto mt-4"></div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: "Web Development",
                  description: "Passionate about creating intuitive, responsive web experiences with modern technologies.",
                  icon: "💻" 
                },
                { 
                  title: "Outdoor Enthusiast",
                  description: "Love mountain biking, skiing, and running in the beautiful outdoors.",
                  icon: "🏔️" 
                },
                { 
                  title: "Tech Innovator",
                  description: "Enthusiastic about self-driving technology, particularly Waymo One's advancements.",
                  icon: "🚗" 
                },
                { 
                  title: "Continual Learner",
                  description: "Always seeking to expand knowledge and skills in the ever-evolving tech landscape.",
                  icon: "📚" 
                }
              ].map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-4">{skill.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{skill.title}</h3>
                  <p className="text-muted-foreground text-sm">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Career Goals */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Career Goals</h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                My dream is to one day work for either Riot Games or Waymo One, where I can merge my passion for technology and innovation. This space is where I share my journey, values, and aspirations, giving you a glimpse into who I am and what I strive to achieve.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-bold mb-3">Waymo One</h3>
                  <div className="text-sm font-medium text-blue-600 mb-4">Self-Driving Technology</div>
                  <p className="text-muted-foreground mb-4">
                    Contribute to the future of autonomous transportation technology and help create safer, more efficient mobility solutions.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1693585031482-26ea683a34e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Self-driving car" 
                    className="w-full h-40 object-cover rounded-lg" 
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-bold mb-3">Riot Games</h3>
                  <div className="text-sm font-medium text-red-600 mb-4">Game Development</div>
                  <p className="text-muted-foreground mb-4">
                    Join a team that creates engaging, innovative gaming experiences that bring joy and connection to millions of players worldwide.
                  </p>
                  <img 
                    src="https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Gaming setup" 
                    className="w-full h-40 object-cover rounded-lg" 
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-purple-50 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-6"
            >
              Let's Connect
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8"
            >
              Feel free to reach out if you'd like to discuss technology, share outdoor adventure stories, or talk about career opportunities.
            </motion.p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">Contact Me</Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Developer;
