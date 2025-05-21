
import { Link } from "react-router-dom";
import { scrollToTop } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-2">Color Grid Logic</h3>
            <p className="text-sm text-gray-600">
              A colorful puzzle challenge where logic meets creativity. Fill the grid with colors following Sudoku-style rules.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Pages</h3>
            <ul className="space-y-1">
              <li><Link to="/" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Home</Link></li>
              <li><Link to="/game" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Play Game</Link></li>
              <li><Link to="/leaderboard" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Leaderboard</Link></li>
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>About</Link></li>
              <li><Link to="/sitemap" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Sitemap</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Resources</h3>
            <ul className="space-y-1">
              <li><Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Terms of Use</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Contact</Link></li>
              <li><Link to="/sitemap" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Sitemap</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {currentYear} Color Grid Logic. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Privacy Policy</Link>
              <Link to="/terms-of-use" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Terms of Use</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-purple-600" onClick={scrollToTop}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
