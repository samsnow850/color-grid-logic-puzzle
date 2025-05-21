
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
