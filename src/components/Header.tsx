
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-[#517fa4]">
            DOT Hub
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/filings"
              className="text-gray-600 hover:text-[#517fa4] transition-colors"
            >
              Filings Directory
            </Link>
            <Link
              to="/resources"
              className="text-gray-600 hover:text-[#517fa4] transition-colors"
            >
              Free Resources
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-[#517fa4] transition-colors"
            >
              Contact Support
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
