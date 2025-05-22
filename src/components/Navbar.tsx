
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Trophy,
  Palette,
  Settings,
  LogIn,
  User,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for adding background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Play",
      path: "/game",
      icon: <Palette className="h-4 w-4" />,
    },
    {
      name: "Leaderboard",
      path: "/leaderboard",
      icon: <Trophy className="h-4 w-4" />,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 ${
        scrolled ? "bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60" : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex mx-6 items-center space-x-4 lg:space-x-6">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
              asChild
            >
              <Link to={item.path}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/account">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px]">
              <div className="flex flex-col space-y-4 py-4">
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className="justify-start gap-2"
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={item.path}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                ))}
                <div className="pt-4 border-t">
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start w-full gap-2"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/account">
                          <User className="h-4 w-4" /> Profile
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start w-full gap-2"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/settings">
                          <Settings className="h-4 w-4" /> Settings
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full gap-2 mt-2"
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to="/auth">
                        <LogIn className="h-4 w-4" /> Sign In
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
