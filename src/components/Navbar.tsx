
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Navbar = () => {
  const { user, signOut, loading } = useAuth();
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 md:px-12">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid grid-cols-2 grid-rows-2 gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-primary">Color Grid Logic</span>
        </Link>
        
        <div className="hidden md:flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/game">Play</Link>
          </Button>
          <Button variant="ghost" onClick={() => setShowAbout(true)}>
            About
          </Button>
          <Button variant="ghost" onClick={() => setShowChangelog(true)}>
            Changelog
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/leaderboard">Leaderboard</Link>
          </Button>
          {!loading && (
            user ? (
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">Menu</Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 pt-8">
              <Button variant="ghost" asChild>
                <Link to="/game">Play</Link>
              </Button>
              <Button variant="ghost" onClick={() => setShowAbout(true)}>
                About
              </Button>
              <Button variant="ghost" onClick={() => setShowChangelog(true)}>
                Changelog
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/leaderboard">Leaderboard</Link>
              </Button>
              {!loading && (
                user ? (
                  <Button variant="outline" onClick={signOut}>Sign Out</Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
      <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
    </nav>
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

const ChangelogModal = ({ open, onOpenChange }: ModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Changelog</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg">May 20, 2025 - Initial Release</h3>
          <ul className="list-disc pl-6 text-muted-foreground mt-2">
            <li>Launched Color Grid Logic with 3 difficulty levels</li>
            <li>Implemented core gameplay mechanics</li>
            <li>Added tutorial for new players</li>
            <li>Introduced responsive design for mobile and desktop</li>
            <li>Created puzzle generation algorithm</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default Navbar;
