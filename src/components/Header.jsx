import { useState } from "react";
import { Link } from "react-router-dom"; // <-- Import Link

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Contact Us", path: "/contact" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <nav className="flex justify-between items-center px-4 py-3 md:px-8 lg:px-12 max-w-7xl mx-auto">
          {/* Mobile Toggle Button (Left) */}
          <button
            className="md:hidden flex flex-col justify-center items-center z-50 bg-white p-2 rounded"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
              }`}
            ></span>
            <span
              className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
              }`}
            ></span>
          </button>

          {/* Logo (Center) */}
          <div className="flex-1 flex justify-center md:justify-start z-50">
            <img src="logo/logo.png" alt="logo" className="h-14 w-auto" />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-pink-500 font-medium transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu Panel (Left Slide) */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50 transform transition-transform duration-300 ease-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo + Close */}
        <div className="flex items-center justify-center p-4 border-b relative">
          <img src="logo/logo.png" alt="logo" className="h-14 w-auto" />
          <button
            onClick={closeMenu}
            className="absolute right-4 p-2 md:hidden"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        <ul className="flex flex-col py-6 space-y-3 pl-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={closeMenu}
                className="block text-gray-700 hover:text-pink-500 font-medium text-lg transition-colors duration-300"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Header;
