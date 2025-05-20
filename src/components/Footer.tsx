
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-6 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {currentYear} Color Grid Logic. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-purple-600">Privacy Policy</Link>
            <Link to="/terms-of-use" className="text-sm text-gray-600 hover:text-purple-600">Terms of Use</Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-purple-600">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
