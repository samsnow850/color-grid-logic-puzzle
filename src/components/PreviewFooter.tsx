
import React from "react";
import { Link } from "react-router-dom";
import { Github, Mail, ExternalLink, Twitter, Linkedin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const PreviewFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-16 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and company info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-purple-600 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-sm"></div>
                  <div className="w-2 h-2 bg-purple-300 rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="font-bold text-xl">Color Grid Logic</span>
            </div>
            
            <p className="text-gray-600 mb-6">
              Challenging puzzles to exercise your brain and improve logical thinking skills.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gray-200 hover:bg-gray-300 transition-colors p-2 rounded-full"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="#" 
                className="bg-gray-200 hover:bg-gray-300 transition-colors p-2 rounded-full"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gray-700" />
              </a>
              <a 
                href="#" 
                className="bg-gray-200 hover:bg-gray-300 transition-colors p-2 rounded-full"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-700" />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/game" className="text-gray-600 hover:text-purple-700 transition-colors">
                  Play Game
                </Link>
              </li>
              <li>
                <Link to="/daily-puzzle" className="text-gray-600 hover:text-purple-700 transition-colors">
                  Daily Challenge
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-600 hover:text-purple-700 transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-purple-700 transition-colors">
                  About the Game
                </Link>
              </li>
              <li>
                <Link to="/about-dev" className="text-gray-600 hover:text-purple-700 transition-colors">
                  About the Developer
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-purple-700 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-gray-600 hover:text-purple-700 transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-600 hover:text-purple-700 transition-colors">
                  Sitemap
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-700 transition-colors flex items-center">
                  Developer API <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for game tips and updates
            </p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Color Grid Logic. All Rights Reserved.
            </p>
            
            <div className="flex items-center">
              <span className="text-gray-600 text-sm flex items-center">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by Samuel Snow
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PreviewFooter;
