
import { Link } from "react-router-dom";
import { Github, Mail, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="font-bold text-lg mb-4">Color Grid Logic</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A colorful puzzle challenge to exercise your brain and test your logical thinking skills.
            </p>
            
            <div className="mt-4">
              <h3 className="font-medium text-sm mb-2">Developer</h3>
              <div className="text-sm text-muted-foreground flex flex-col space-y-1">
                <a 
                  href="https://lovable.dev/@samsnow850" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary"
                >
                  <Github className="h-4 w-4 mr-2" />
                  <span>@samsnow850</span>
                  <ExternalLink className="h-3 w-3 ml-1 inline" />
                </a>
                <a 
                  href="https://samuelesnow.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span>samuelesnow.co</span>
                  <ExternalLink className="h-3 w-3 ml-1 inline" />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="font-bold text-lg mb-4">Links</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/game" className="text-muted-foreground hover:text-primary">
                  Play Game
                </Link>
              </li>
              <li>
                <Link to="/daily-puzzle" className="text-muted-foreground hover:text-primary">
                  Daily Challenge
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-muted-foreground hover:text-primary">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="font-bold text-lg mb-4">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-muted-foreground hover:text-primary">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-muted-foreground hover:text-primary">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Color Grid Logic. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a 
              href="mailto:contact@colorgridlogic.com" 
              className="text-muted-foreground hover:text-primary"
              aria-label="Email us"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com/samsnow850" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
