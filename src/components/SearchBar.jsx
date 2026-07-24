import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { getAllProductsForSearch } from "../api/products.api";
import { searchProducts } from "../utils/searchUtils";
import { toImageUrls, PLACEHOLDER_IMAGE } from "../utils/imageUtils";

/**
 * Instant search overlay: fetches the catalog once (cached 5 min via
 * TanStack Query, same as the rest of the app) and filters client-side.
 */
const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ["allProductsForSearch"],
    queryFn: getAllProductsForSearch,
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = searchProducts(products, query, 6);

  const goToResults = () => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose?.();
  };

  const goToProduct = (id) => {
    navigate(`/products/${id}`);
    onClose?.();
  };

  return (
    <div className="absolute inset-x-0 top-full bg-white border-b border-gray-200 shadow-xl z-40">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3 border border-gray-300 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-pink-400">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToResults()}
            placeholder="Search nameplates by name, material, shape…"
            className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {query.trim() && (
          <div className="mt-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No products match "{query}".
              </p>
            ) : (
              <>
                <ul className="divide-y divide-gray-100">
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        onClick={() => goToProduct(product.id)}
                        className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-gray-50 rounded-lg px-2 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          <img
                            src={toImageUrls(product)[0] || PLACEHOLDER_IMAGE}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.material} · ₹{(product.basePrice || 0).toLocaleString()}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={goToResults}
                  className="w-full text-center text-sm font-semibold text-pink-600 hover:text-pink-700 py-3"
                >
                  See all results for "{query}" →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
