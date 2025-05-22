
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}

const Logo = ({ size = "md", withText = true, className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };
  
  const logoSize = sizeClasses[size];
  
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className={`rounded-xl bg-purple-600 grid grid-cols-2 grid-rows-2 p-1.5 ${logoSize}`}>
        <div className="bg-white rounded-full"></div>
        <div className="bg-purple-300 rounded-full"></div>
        <div className="bg-purple-300 rounded-full"></div>
        <div className="bg-white rounded-full"></div>
      </div>
      
      {withText && (
        <span className="font-bold text-lg md:text-xl">Color Grid Logic</span>
      )}
    </Link>
  );
};

export default Logo;
