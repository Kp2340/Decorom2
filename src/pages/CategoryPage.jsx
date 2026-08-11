import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter & page values from URL search parameters
  const getPageFromUrl = () => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) ? 0 : Math.max(0, p - 1);
  };

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPageState] = useState(getPageFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedShape, setSelectedShapeState] = useState(
    searchParams.get("shape") || ""
  );
  const [minPrice, setMinPriceState] = useState(
    searchParams.get("minPrice") || ""
  );
  const [maxPrice, setMaxPriceState] = useState(
    searchParams.get("maxPrice") || ""
  );
  const [ledOnly, setLedOnlyState] = useState(
    searchParams.get("ledOnly") === "true"
  );

  const currentCategory =
    CATEGORIES.find((c) => slugify(c.name) === materialName) || CATEGORIES[0];

  // Helper to sync state changes into URL searchParams
  const updateUrl = (overrides = {}) => {
    const nextParams = new URLSearchParams(searchParams);
    const newPage = overrides.page !== undefined ? overrides.page : page;
    const newShape = overrides.shape !== undefined ? overrides.shape : selectedShape;
    const newMin = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
    const newMax = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
    const newLed = overrides.ledOnly !== undefined ? overrides.ledOnly : ledOnly;

    if (newPage > 0) nextParams.set("page", String(newPage + 1));
    else nextParams.delete("page");

    if (newShape) nextParams.set("shape", newShape);
    else nextParams.delete("shape");

    if (newMin !== "") nextParams.set("minPrice", String(newMin));
    else nextParams.delete("minPrice");

    if (newMax !== "") nextParams.set("maxPrice", String(newMax));
    else nextParams.delete("maxPrice");

    if (newLed) nextParams.set("ledOnly", "true");
    else nextParams.delete("ledOnly");

    setSearchParams(nextParams, { replace: true });
  };

  const handlePageChange = (newPage) => {
    setPageState(newPage);
    updateUrl({ page: newPage });
  };

  const handleShapeChange = (newShape) => {
    setSelectedShapeState(newShape);
    setPageState(0);
    updateUrl({ shape: newShape, page: 0 });
  };

  const handleMinPriceChange = (val) => {
    setMinPriceState(val);
    updateUrl({ minPrice: val });
  };

  const handleMaxPriceChange = (val) => {
    setMaxPriceState(val);
    updateUrl({ maxPrice: val });
  };

  const handleLedOnlyChange = (val) => {
    setLedOnlyState(val);
    updateUrl({ ledOnly: val });
  };

  // Sync state when URL searchParams change (e.g. back/forward navigation)
  useEffect(() => {
    setPageState(getPageFromUrl());
    setSelectedShapeState(searchParams.get("shape") || "");
    setMinPriceState(searchParams.get("minPrice") || "");
    setMaxPriceState(searchParams.get("maxPrice") || "");
    setLedOnlyState(searchParams.get("ledOnly") === "true");
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const fetchCategoryProducts = async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await getProducts(page, PAGE_SIZE, currentCategory.id, selectedShape);
        if (cancelled) return;
        if (data && data.content) {
          setProducts(data.content);
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
            setSelectedShape={handleShapeChange}
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">₹ Min</label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
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
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                placeholder="Any"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ledOnly}
                onChange={(e) => handleLedOnlyChange(e.target.checked)}
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8">
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
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
