import { useState } from "react";
import { Link } from "react-router-dom"; // <-- Import Link

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Customers", path: "/customers" },
    { name: "Custom Design", path: "/custom-design" },
    { name: "Contact Us", path: "/contact" },
    { name: "About Us", path: "/about" },
  ];


  return (
    <>
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-yellow-100 border-b border-yellow-200">
        <nav className="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          {/* Mobile Toggle Button (Left) */}
          <button
            className="md:hidden flex flex-col justify-center items-center z-50 p-2 rounded-md hover:bg-gray-100 transition"
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
          <div className="flex-1 flex justify-center md:justify-start z-40">
            <img
              src="/logo/logo.png"
              alt="Decorom"
              className="h-12 w-auto drop-shadow-sm"
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-800">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="relative group py-2 px-1 hover:text-pink-600 transition-colors"
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
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu Panel (Left Slide) */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-yellow-100 z-50 transform transition-transform duration-300 ease-out shadow-xl ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo + Close */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-200">
          <img src="/logo/logo.png" alt="Decorom" className="h-12 w-auto" />
          <button
            onClick={closeMenu}
            className="p-2 md:hidden"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-black"
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
        <ul className="flex flex-col py-6 space-y-3 px-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={closeMenu}
                className="block text-gray-900 hover:text-pink-600 font-semibold text-base transition-colors"
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
