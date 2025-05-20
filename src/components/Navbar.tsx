
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
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
          <Button variant="ghost" asChild>
            <Link to="/about">About</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/changelog">Changelog</Link>
          </Button>
        </div>
        
        <Button variant="outline" className="md:hidden">
          Menu
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
