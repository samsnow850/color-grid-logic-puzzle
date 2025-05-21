
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("There was a problem signing out");
    }
  };

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background z-10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold"
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="w-6 h-6 rounded bg-primary" />
          <span className="hidden sm:inline">Color Grid Logic</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-5">
          <Link 
            to="/" 
            onClick={() => window.scrollTo(0, 0)}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link 
            to="/game" 
            onClick={() => window.scrollTo(0, 0)}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Play Game
          </Link>
          <Link 
            to="/leaderboard" 
            onClick={() => window.scrollTo(0, 0)}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Leaderboard
          </Link>
          <Link
            to="/about"
            onClick={() => window.scrollTo(0, 0)}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  navigate("/account");
                  window.scrollTo(0, 0);
                }}>
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => {
              navigate("/auth");
              window.scrollTo(0, 0);
            }}>Sign In</Button>
          )}
          
          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button className="sm:hidden" variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle mobile menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="py-6">
              <div className="flex flex-col space-y-4 mt-4">
                <SheetClose asChild>
                  <Link to="/" className="text-lg font-medium py-2">Home</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/game" className="text-lg font-medium py-2">Play Game</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/leaderboard" className="text-lg font-medium py-2">Leaderboard</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/about" className="text-lg font-medium py-2">About</Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/sitemap" className="text-lg font-medium py-2">Sitemap</Link>
                </SheetClose>
                {user && (
                  <>
                    <SheetClose asChild>
                      <Link to="/account" className="text-lg font-medium py-2">Account</Link>
                    </SheetClose>
                    <Button 
                      variant="ghost" 
                      className="justify-start p-0 hover:bg-transparent"
                      onClick={() => {
                        handleSignOut();
                        closeMenu();
                      }}
                    >
                      <span className="text-lg font-medium py-2">Sign out</span>
                    </Button>
                  </>
                )}
                {!user && (
                  <SheetClose asChild>
                    <Link to="/auth" className="text-lg font-medium py-2">Sign In</Link>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="hidden sm:block">
            <Button asChild>
              <Link to="/game" onClick={() => window.scrollTo(0, 0)}>Play Game</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
