
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

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
          <button
            onClick={() => {
              setShowAbout(true);
              window.scrollTo(0, 0);
            }}
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </button>
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
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  navigate("/settings");
                  window.scrollTo(0, 0);
                }}>
                  Settings
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
          
          <Button className="sm:hidden" variant="outline" size="icon" asChild>
            <Link to="/game" onClick={() => window.scrollTo(0, 0)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>
            </Link>
          </Button>
          
          <div className="hidden sm:block">
            <Button asChild>
              <Link to="/game" onClick={() => window.scrollTo(0, 0)}>Play Game</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
    </header>
  );
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutModal = ({ open, onOpenChange }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">About Color Grid Logic</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 text-muted-foreground">
        <p>
          Color Grid Logic is a puzzle game inspired by Sudoku, but with colors instead of numbers. 
          Fill the grid so that each row, column, and region contains each color exactly once.
        </p>
        <h3 className="font-semibold text-lg text-foreground">How to Play:</h3>
        <ol className="list-decimal pl-6">
          <li>Click on an empty cell to select it</li>
          <li>Click on a color from the palette or use number keys (1-4, 1-6, or 1-9 depending on grid size) to fill the cell</li>
          <li>Each row, column, and region must contain each color exactly once</li>
          <li>The puzzle is solved when all cells are filled correctly</li>
        </ol>
        <h3 className="font-semibold text-lg text-foreground">Difficulty Levels:</h3>
        <ul className="list-disc pl-6">
          <li><strong>Easy:</strong> 4×4 grid with more pre-filled cells</li>
          <li><strong>Medium:</strong> 6×6 grid with a moderate number of pre-filled cells</li>
          <li><strong>Hard:</strong> 9×9 grid with fewer pre-filled cells</li>
        </ul>
      </div>
    </DialogContent>
  </Dialog>
);

export default Navbar;
