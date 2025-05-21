
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { scrollToTop } from "@/lib/utils";

const Sitemap = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 md:px-8 bg-gradient-to-b from-background to-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Sitemap</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Main Pages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/">Home</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/game">Game</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/daily-puzzle">Daily Puzzle</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/leaderboard">Leaderboard</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/about">About</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/about-dev">About Developer</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/preview">Preview</Link>
                </Button>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Account</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/auth">Login / Register</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/account">My Account</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/settings">Settings</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/forgot-password">Forgot Password</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/reset-password">Reset Password</Link>
                </Button>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Help & Legal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/terms-of-use">Terms of Use</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="justify-start" 
                  onClick={() => scrollToTop()}
                  asChild
                >
                  <Link to="/sitemap">Sitemap</Link>
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Recent Updates</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <ul className="list-disc pl-6 space-y-3">
                  <li>Enhanced preview page with advanced animations and interactive elements</li>
                  <li>Added custom loading screens with progress indicators for all pages</li>
                  <li>Improved navigation with scroll-responsive animated navbar</li>
                  <li>Added achievements system with multiple unlockable rewards</li>
                  <li>Implemented tutorial mode for new players</li>
                  <li>Added undo/redo functionality for gameplay moves</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sitemap;
