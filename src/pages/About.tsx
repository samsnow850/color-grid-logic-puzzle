import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";

const About = () => {
  return (
    <PageWrapper 
      loadingTitle="About" 
      loadingDescription="Loading game information"
      loadingColor="orange"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-12 px-4 md:px-8 max-w-5xl mx-auto">
          <section className="mb-12">
            <h1 className="text-4xl font-bold mb-6 text-primary">About Color Grid Logic</h1>
            
            <div className="prose max-w-none">
              <p className="text-lg mb-4">
                Color Grid Logic is a puzzle game inspired by Sudoku but with a colorful twist. Instead of 
                using numbers, players fill a grid with colors according to specific rules.
              </p>
              
              <p className="mb-6">
                Each puzzle consists of a grid divided into regions. The goal is to fill the grid 
                so that each row, column, and region contains each color exactly once.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">How to Play</h2>
              
              <ol className="list-decimal pl-6 space-y-2 mb-6">
                <li>Click on an empty cell to select it.</li>
                <li>Click on a color from the palette or use number keys (1-4, 1-6, or 1-9 depending on grid size) to fill the cell.</li>
                <li>Each row, column, and region must contain each color exactly once.</li>
                <li>The puzzle is solved when all cells are filled correctly according to these rules.</li>
              </ol>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Difficulty Levels</h2>
              
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li><strong>Easy:</strong> 4×4 grid with more pre-filled cells for a gentle introduction to the game.</li>
                <li><strong>Medium:</strong> 6×6 grid with a moderate number of pre-filled cells, offering a balanced challenge.</li>
                <li><strong>Hard:</strong> 9×9 grid with fewer pre-filled cells, designed for experienced puzzle solvers.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Game Features</h2>
              
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Intuitive interface with color selection palette</li>
                <li>Multiple difficulty levels to suit all players</li>
                <li>Ability to save progress and continue later</li>
                <li>Leaderboard to compete with other players</li>
                <li>Daily puzzles that refresh every 24 hours</li>
              </ul>
            </div>
          </section>
          
          <section className="border-t pt-10">
            <h2 className="text-2xl font-semibold mb-4">About the Developer</h2>
            
            <div className="prose max-w-none">
              <p className="mb-4">
                Color Grid Logic was created as a passion project combining the logic of Sudoku puzzles with 
                a colorful, accessible interface. The game concept was inspired by ChatGPT, developed using 
                Lovable's powerful web application platform, and customized with personal touches to create 
                an engaging puzzle experience.
              </p>
              
              <p>
                The developer continues to improve the game based on player feedback, adding new features 
                and refining the gameplay experience. If you have suggestions or encounter any issues, 
                please use the contact page to reach out!
              </p>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </PageWrapper>
  );
};

export default About;
