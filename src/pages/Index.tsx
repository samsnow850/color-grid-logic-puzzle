
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-gradient-to-b from-background to-purple-50">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Color Grid Logic
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            A colorful puzzle challenge where logic meets creativity. Fill the grid with colors following Sudoku-style rules.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-3 max-w-md mx-auto">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6" asChild>
              <a href="/game">Play Game</a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowAbout(true)}
              className="border-purple-300 hover:bg-purple-100"
            >
              About
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowChangelog(true)}
              className="border-purple-300 hover:bg-purple-100"
            >
              Changelog
            </Button>
          </div>
        </div>

        {/* Game Preview Image */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
          <div className="aspect-ratio-4/3 bg-gray-100 rounded flex items-center justify-center">
            <div className="grid grid-cols-4 grid-rows-4 gap-2 p-4">
              {Array(16).fill(null).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-md ${
                    ['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-red-400', 
                     'bg-purple-400', 'bg-pink-400', 'bg-orange-400', 'bg-indigo-400'][i % 8]
                  }`}
                ></div>
              ))}
            </div>
          </div>
          <p className="text-center mt-4 text-sm text-gray-600">
            A preview of the Color Grid Logic puzzle game
          </p>
        </div>
      </main>
      
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
      <ChangelogModal open={showChangelog} onOpenChange={setShowChangelog} />
      
      <Footer />
    </div>
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

export default Index;
