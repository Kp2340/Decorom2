import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { getAllProductsForSearch } from "../api/products.api";
import { searchProducts } from "../utils/searchUtils";
import { toImageUrls, PLACEHOLDER_IMAGE } from "../utils/imageUtils";

/**
 * Animated Morphing Search Bar:
 * - Collapsed: circular 32px search icon button matching header theme
 * - Expanded: smoothly morphs into an inline input field with live floating dropdown
 * - Dismisses on Escape, outside click, or X button
 */
const SearchBar = ({ isTransparent, headerBtnClass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ["allProductsForSearch"],
    queryFn: getAllProductsForSearch,
  });

  // Auto-focus input on expand
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Close only if nothing is typed
        if (!query.trim()) {
          setIsOpen(false);
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (query) {
          setQuery("");
        } else {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, query]);

  const results = searchProducts(products, query, 5);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  const goToResults = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  const goToProduct = (id) => {
    navigate(`/products/${id}`);
    handleClose();
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Morphing Search Container */}
      <div
        className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${
          isOpen
            ? "w-44 sm:w-[250px] md:w-[250px] max-w-[250px] h-8 rounded-full bg-white text-[#2C3E50] border border-slate-200/90 shadow-md px-2.5 gap-2"
            : "w-8 h-8 rounded-full bg-transparent"
        }`}
      >
        {isOpen ? (
          <>
            <Search className="w-4 h-4 text-[#E59500] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToResults()}
              className="w-full bg-transparent text-xs sm:text-sm text-[#2C3E50] outline-none"
              aria-label="Search nameplates"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search text"
                className="p-1 rounded-full text-slate-400 hover:text-[#2C3E50] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Clear text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <button
            onClick={handleOpen}
            aria-label="Search"
            className={headerBtnClass}
            title="Search nameplates"
          >
            <Search className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Floating Live Results Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-72 sm:w-84 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50">
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
            {results.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No products match "{query}".
              </p>
            ) : (
              <>
                <ul className="space-y-1">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        onClick={() => goToProduct(product.id)}
                        className="w-full flex items-center gap-2.5 p-2 text-left hover:bg-amber-50/60 rounded-xl transition-colors cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={toImageUrls(product)[0] || PLACEHOLDER_IMAGE}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#2C3E50] truncate group-hover:text-[#E59500] transition-colors">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {product.material} ·{" "}
                            <span className="font-bold text-[#E59500]">
                              ₹{(product.basePrice || 0).toLocaleString("en-IN")}
                            </span>
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 pb-1">
                  <button
                    onClick={goToResults}
                    className="w-full text-center text-xs font-bold text-[#E59500] hover:text-[#CC8400] transition-colors cursor-pointer block py-1"
                  >
                    See all results for "{query}" →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
