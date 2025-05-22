
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Github, Mail, Twitter } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Logo and Description */}
          <div className="flex flex-col mb-8 md:mb-0 md:max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-auto text-primary" />
              <span className="font-bold text-lg">Color Grid Logic</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              A colorful puzzle challenge where logic meets creativity. Fill the grid with colors following Sudoku-style rules.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <a href="mailto:contact@example.com" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h3 className="font-semibold text-sm mb-4 text-primary">Game</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/game" className="text-muted-foreground hover:text-foreground transition-colors">
                    Play Now
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    How to Play
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm mb-4 text-primary">Account</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                    Account Settings
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-sm mb-4 text-primary">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-use" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" className="hover:text-foreground transition-colors">
              Terms of Use
            </Link>
          </div>
          <p>© {currentYear} Color Grid Logic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
