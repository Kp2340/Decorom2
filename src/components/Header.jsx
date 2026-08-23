import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, Heart } from "lucide-react";
import SearchBar from "./SearchBar";
import { useWishlist } from "../wishlist/WishlistContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { count: wishlistCount } = useWishlist();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleSearch = () => setIsSearchOpen((v) => !v);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Best Sellers", path: "/best-sellers" },
    { name: "Customers", path: "/customers" },
    { name: "Custom Design", path: "/custom-design" },
    { name: "Contact Us", path: "/contact" },
    { name: "About Us", path: "/about" },
  ];

  const desktopLinkClass = ({ isActive }) =>
    `relative group py-2 px-1 transition-colors ${
      isActive ? "text-pink-600 font-semibold" : "hover:text-pink-600 text-gray-800"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block font-semibold text-base transition-colors py-1 ${
      isActive
        ? "text-pink-600 border-l-2 border-pink-500 pl-3"
        : "text-gray-900 hover:text-pink-600 pl-0"
    }`;

  return (
    <>
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-yellow-100 border-b border-yellow-200">
        <nav className="flex items-center justify-between h-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Mobile/Tablet Toggle Button (Left on screens < xl) */}
          <button
            className="xl:hidden flex flex-col justify-center items-center z-50 p-2 rounded-md hover:bg-yellow-200/50 transition cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
              }`}
            />
            <span
              className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`bg-black h-0.5 w-6 rounded-sm transition-all duration-300 ease-out ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
              }`}
            />
          </button>

          {/* Logo (Center on mobile/tablet < xl, left on desktop xl+) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 xl:relative xl:left-auto xl:top-auto xl:translate-x-0 xl:translate-y-0 xl:flex-1 xl:flex xl:justify-start z-40">
            <NavLink to="/" onClick={closeMenu} className="flex items-center">
              <img
                src="/logo/logo.png"
                alt="Decorom"
                className="h-10 sm:h-12 w-auto drop-shadow-sm shrink-0"
              />
            </NavLink>
          </div>

          {/* Desktop Menu (Visible on xl+ 1280px+) */}
          <ul className="hidden xl:flex items-center space-x-6 xl:space-x-8 text-sm font-medium">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} className={desktopLinkClass} end={item.path === "/"}>
                  {({ isActive }) => (
                    <>
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-pink-500 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Search + Wishlist — visible on all breakpoints */}
          <div className="flex items-center gap-1 z-40">
            <button
              onClick={toggleSearch}
              aria-label="Search"
              className="p-2 rounded-full hover:bg-yellow-200/60 text-gray-800 transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <NavLink
              to="/wishlist"
              onClick={closeMenu}
              aria-label="Wishlist"
              className="relative p-2 rounded-full hover:bg-yellow-200/60 text-gray-800 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-pink-600 text-white text-[10px] font-bold leading-none">
                  {wishlistCount}
                </span>
              )}
            </NavLink>
          </div>
        </nav>

        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      </header>

      {/* Mobile/Tablet Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 xl:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile/Tablet Menu Panel (Left Slide) */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-yellow-100 z-50 transform transition-transform duration-300 ease-out shadow-xl xl:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo + Close */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-200">
          <img src="/logo/logo.png" alt="Decorom" className="h-10 sm:h-12 w-auto" />
          <button
            onClick={closeMenu}
            className="p-2 xl:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        <ul className="flex flex-col py-6 space-y-2 px-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={closeMenu}
                className={mobileLinkClass}
                end={item.path === "/"}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Header;
