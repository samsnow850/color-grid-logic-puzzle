
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const Sitemap = () => {
  const sitePages = [
    { title: "Home", path: "/", description: "Main landing page with game overview and quick access to features" },
    { title: "Play Game", path: "/game", description: "Play Color Grid Logic puzzles with various difficulty levels" },
    { title: "Leaderboard", path: "/leaderboard", description: "View top scores and rankings from other players" },
    { title: "About", path: "/about", description: "Learn about Color Grid Logic, how to play, and the developer" },
    { title: "Account", path: "/account", description: "Manage your player profile and personal information" },
    { title: "Settings", path: "/settings", description: "Configure your game preferences and account settings" },
    { title: "Authentication", path: "/auth", description: "Sign in or create a new account" },
    { title: "Privacy Policy", path: "/privacy-policy", description: "Our policies regarding user privacy and data" },
    { title: "Terms of Use", path: "/terms-of-use", description: "Legal terms and conditions for using the game" },
    { title: "Contact", path: "/contact", description: "Get in touch with the developer team" },
    { title: "Password Reset", path: "/forgot-password", description: "Reset your account password" },
    { title: "Sitemap", path: "/sitemap", description: "Overview of all pages on the site" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 md:px-8 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-primary">Sitemap</h1>
        
        <p className="text-lg mb-8">
          Welcome to the Color Grid Logic sitemap. This page provides an overview of all available pages on our website for easy navigation.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {sitePages.map((page) => (
            <div key={page.path} className="border rounded-lg p-4 hover:border-primary transition-colors">
              <h2 className="text-xl font-semibold mb-2">
                <Link to={page.path} className="hover:text-primary transition-colors">
                  {page.title}
                </Link>
              </h2>
              <p className="text-gray-600">{page.description}</p>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sitemap;
