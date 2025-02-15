
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Hide navigation on form pages and legal/support pages
  const shouldHideNav = [
    '/ucr', 
    '/mcs150', 
    '/terms',
    '/privacy',
    '/refund',
    '/contact'
  ].includes(location.pathname);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-[#517fa4]">
            DOT Hub
          </Link>

          {!shouldHideNav && (
            <>
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden text-gray-600 hover:text-[#517fa4] transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8 text-sm">
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
              </nav>

              {/* Mobile Navigation */}
              {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
                  <nav className="flex flex-col p-4 text-sm">
                    <Link
                      to="/filings"
                      className="py-2 text-gray-600 hover:text-[#517fa4] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Filings Directory
                    </Link>
                    <Link
                      to="/resources"
                      className="py-2 text-gray-600 hover:text-[#517fa4] transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Free Resources
                    </Link>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
