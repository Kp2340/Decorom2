import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import SearchBar from "./SearchBar";
import MiniCartDrawer from "./MiniCartDrawer";
import { useWishlist } from "../wishlist/WishlistContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count: wishlistCount, toggleDrawer } = useWishlist();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Simplified navigation items per agreed design strategy
  const menuItems = [
    { name: "Products", path: "/products" },
    { name: "Best Sellers", path: "/best-sellers" },
    { name: "Custom Design", path: "/custom-design" },
    { name: "Customers", path: "/customers" },
    { name: "Contact", path: "/contact" },
  ];

  const desktopLinkClass = ({ isActive }) =>
    `py-1 px-2.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
      isActive
        ? "text-[#E59500] font-semibold"
        : isTransparent
        ? "text-white hover:text-[#E59500]"
        : "text-slate-200 hover:text-[#E59500]"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block font-semibold text-base transition-colors duration-200 py-2 ${
      isActive
        ? "text-[#E59500] border-l-2 border-[#E59500] pl-3"
        : "text-slate-300 hover:text-[#E59500] pl-3"
    }`;

  const headerBtnClass = `w-8 h-8 p-[4px] rounded-[88px] transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center shrink-0 ${
    isTransparent
      ? "border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-[#E59500] hover:text-white hover:border-[#E59500]"
      : "border border-transparent bg-white text-[#E59500] hover:bg-[#E59500] hover:text-white"
  }`;

  return (
    <>
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-b border-white/10"
            : "bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 shadow-md"
        }`}
      >
        <nav className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Mobile/Tablet Toggle Button (Left on screens < xl) */}
          <button
            className={`xl:hidden flex flex-col justify-center items-center z-50 ${headerBtnClass}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-4 rounded-sm bg-current transition-all duration-300 ease-out ${
                isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-sm bg-current transition-all duration-300 ease-out ${
                isMenuOpen ? "opacity-0" : "opacity-100 my-0.5"
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-sm bg-current transition-all duration-300 ease-out ${
                isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
              }`}
            />
          </button>

          {/* Left: Logo (Center on mobile/tablet < xl, left on desktop xl+) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 xl:relative xl:left-auto xl:top-auto xl:translate-x-0 xl:translate-y-0 xl:flex-1 xl:flex xl:justify-start z-40">
            <NavLink to="/" onClick={closeMenu} className="flex items-center">
              <img
                src="/logo/logo.png"
                alt="Decorom"
                className="h-8 sm:h-9 w-auto drop-shadow-xs shrink-0 brightness-0 invert"
              />
            </NavLink>
          </div>

          {/* Center: Desktop Menu (Visible on xl+ 1280px+) — centered */}
          <div className="hidden xl:flex items-center justify-center flex-1">
            <ul className="flex items-center space-x-6 xl:space-x-8 text-sm font-medium">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <NavLink to={item.path} className={desktopLinkClass}>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Search + Mini-Cart Drawer Trigger — right aligned */}
          <div className="flex items-center justify-end gap-2 xl:flex-1 z-40">
            <SearchBar
              isTransparent={isTransparent}
              headerBtnClass={headerBtnClass}
            />
            <button
              onClick={toggleDrawer}
              aria-label="Saved Designs Cart"
              className={`relative ${headerBtnClass}`}
              title="View saved designs"
            >
              <ShoppingBag className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-4 px-1 flex items-center justify-center rounded-full bg-[#E59500] text-white text-[10px] font-bold leading-none shadow-xs border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Global Mini-Cart Drawer */}
      <MiniCartDrawer />

      {/* Mobile/Tablet Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs z-40 xl:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Mobile/Tablet Menu Panel (Left Slide) */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-[#0F172A] border-r border-slate-800 z-50 transform transition-transform duration-300 ease-out shadow-2xl xl:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Logo + Close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <img src="/logo/logo.png" alt="Decorom" className="h-9 w-auto brightness-0 invert" />
          <button
            onClick={closeMenu}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

