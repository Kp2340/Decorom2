import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProducts } from "../api/products.api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import Pagination from "../components/Pagination";
import SEO from "../components/SEO";

import { CATEGORIES, slugify } from "../constants/categories";

const PAGE_SIZE = 12;

const CategoryPage = () => {
  const { materialName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refinements — shape is a server-supported filter param; price/LED are
  // applied client-side over the loaded page (no backend endpoint changes).
  const [selectedShape, setSelectedShape] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ledOnly, setLedOnly] = useState(false);

  const currentCategory = CATEGORIES.find(c => slugify(c.name) === materialName) || CATEGORIES[0];

  // Reset to page 0 whenever the category or shape filter changes
  useEffect(() => {
    setPage(0);
  }, [materialName, selectedShape]);

  useEffect(() => {
    // A separate effect resets `page` to 0 whenever materialName/selectedShape
    // change, which fires this effect once with the stale page and again once
    // the reset lands — guard against the stale (now out-of-range) response
    // overwriting the correct one if it happens to resolve second.
    let cancelled = false;

    const fetchCategoryProducts = async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await getProducts(page, PAGE_SIZE, currentCategory.id, selectedShape);
        if (cancelled) return;
        if (data && data.content) {
          setProducts(data.content);
          // Spring Boot 3's default Page JSON nests pagination metadata under "page"
          // (not a flat totalPages) — support both in case that ever changes.
          setTotalPages(data.page?.totalPages ?? data.totalPages ?? 1);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load category products");
          setProducts([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCategoryProducts();
    window.scrollTo(0, 0);

    return () => {
      cancelled = true;
    };
  }, [materialName, currentCategory.id, selectedShape, page]);

  // Client-side refinement over the currently loaded page — cheap, no extra requests.
  const visibleProducts = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    return products.filter((p) => {
      const price = p.basePrice ?? p.price ?? 0;
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;
      if (ledOnly && !p.hasLight) return false;
      return true;
    });
  }, [products, minPrice, maxPrice, ledOnly]);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${currentCategory.name} Nameplates`} 
        description={`Explore our best-selling ${currentCategory.name} nameplates. Custom designs handcrafted in Ahmedabad.`}
      />

      {/* Category Navigation Header */}
      <div className="bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 text-sm whitespace-nowrap">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${slugify(cat.name)}`}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  materialName === slugify(cat.name)
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                    : "bg-white text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {currentCategory.name} Nameplates
          </h1>
          <p className="text-gray-500">Browse our full range of {currentCategory.name} designs.</p>
        </div>

        {/* Refinements: shape (server-filtered) + price range / LED (client-filtered) */}
        <div className="mb-6 space-y-4">
          <ProductFilters
            hideMaterial
            selectedShape={selectedShape}
            setSelectedShape={setSelectedShape}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">₹ Min</label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">₹ Max</label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ledOnly}
                onChange={(e) => setLedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700 font-medium">LED available only</span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading products...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-20">No products match these filters.</div>
        ) : (
          <>
            <div className="grid auto-cols-[44vw] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:overflow-visible sm:pb-0">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
