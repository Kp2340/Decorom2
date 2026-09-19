import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { getProducts } from "../api/products.api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import SEO from "../components/SEO";
import { FAQStructuredData, BreadcrumbStructuredData, CollectionPageStructuredData } from "../components/StructuredData";
import { CATEGORIES, CATEGORY_SEO_DATA, slugify } from "../constants/categories";

const PAGE_SIZE = 12;

const CategoryPage = () => {
  const { materialName } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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

  // Helper to sync filter state changes into URL searchParams
  const updateUrl = (overrides = {}) => {
    const nextParams = new URLSearchParams(searchParams);
    const newShape = overrides.shape !== undefined ? overrides.shape : selectedShape;
    const newMin = overrides.minPrice !== undefined ? overrides.minPrice : minPrice;
    const newMax = overrides.maxPrice !== undefined ? overrides.maxPrice : maxPrice;
    const newLed = overrides.ledOnly !== undefined ? overrides.ledOnly : ledOnly;

    nextParams.delete("page");

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

  const handleShapeChange = (newShape) => {
    setSelectedShapeState(newShape);
    updateUrl({ shape: newShape });
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

  // Sync state when URL searchParams change
  useEffect(() => {
    setSelectedShapeState(searchParams.get("shape") || "");
    setMinPriceState(searchParams.get("minPrice") || "");
    setMaxPriceState(searchParams.get("maxPrice") || "");
    setLedOnlyState(searchParams.get("ledOnly") === "true");
  }, [searchParams]);

  // Initial fetch: Load first 12 products when category or shape changes
  useEffect(() => {
    let cancelled = false;

    const fetchInitial = async () => {
      setError(null);
      setLoading(true);
      setPage(0);
      setHasMore(true);

      try {
        const data = await getProducts(0, PAGE_SIZE, currentCategory.id, selectedShape);
        if (cancelled) return;

        const content = data?.content || (Array.isArray(data) ? data : []);
        setProducts(content);

        const totalPgs = data?.page?.totalPages ?? data?.totalPages ?? 1;
        setHasMore(totalPgs > 1 && content.length === PAGE_SIZE);
      } catch {
        if (!cancelled) {
          setError("Failed to load category products");
          setProducts([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitial();

    return () => {
      cancelled = true;
    };
  }, [materialName, currentCategory.id, selectedShape]);

  // Fetch next batch of 12 products
  const loadMoreProducts = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const data = await getProducts(nextPage, PAGE_SIZE, currentCategory.id, selectedShape);
      const newItems = data?.content || (Array.isArray(data) ? data : []);

      if (newItems.length > 0) {
        setProducts((prev) => [...prev, ...newItems]);
        setPage(nextPage);
        const totalPgs = data?.page?.totalPages ?? data?.totalPages ?? 1;
        setHasMore(nextPage < totalPgs - 1 && newItems.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, page, currentCategory.id, selectedShape]);

  // Sentinel ref for infinite scroll observer
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreProducts();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMoreProducts, hasMore, loading, loadingMore]);

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

  const categorySlug = slugify(currentCategory.name);
  const seoConfig = CATEGORY_SEO_DATA[categorySlug] || {
    title: `${currentCategory.name} Nameplates in Ahmedabad | Decorom`,
    description: `Explore our handcrafted ${currentCategory.name} nameplates for home entrance. Weather-resistant designs made in Ahmedabad.`,
    keywords: `${currentCategory.name.toLowerCase()} name plate maker near me, custom ${currentCategory.name.toLowerCase()} nameplate ahmedabad`,
    faqs: [],
  };

  const canonicalUrl = `https://www.decorom.in/category/${categorySlug}`;
  const breadcrumbItems = [
    { name: "Home", url: "https://www.decorom.in" },
    { name: "Categories", url: "https://www.decorom.in/products" },
    { name: "Nameplates", url: canonicalUrl },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={seoConfig.title} 
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        url={canonicalUrl}
      />
      <FAQStructuredData faqs={seoConfig.faqs} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <CollectionPageStructuredData 
        name={currentCategory.name} 
        description={seoConfig.description} 
        url={canonicalUrl} 
        products={visibleProducts} 
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
                    ? "bg-[#E59500] text-white shadow-md shadow-amber-600/20"
                    : "bg-white text-gray-600 hover:bg-[#0F172A] hover:text-white"
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
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">
            {currentCategory.name} Nameplates
          </h1>
          <p className="text-gray-500">
            Handcrafted {currentCategory.name.toLowerCase()} door nameplates in Ahmedabad — weatherproof & customizable.
          </p>
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
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E59500]"
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
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E59500]"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ledOnly}
                onChange={(e) => handleLedOnlyChange(e.target.checked)}
                className="w-4 h-4 rounded text-[#E59500] focus:ring-[#E59500]"
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

            {/* Bottom Sentinel for Infinite Scroll (loads 12 at a time as user scrolls) */}
            {hasMore && (
              <div ref={sentinelRef} className="w-full flex flex-col items-center justify-center my-8 min-h-[48px]">
                {loadingMore && (
                  <div className="flex items-center gap-2.5 text-sm text-[#E59500] font-semibold bg-amber-50/80 px-5 py-2.5 rounded-full border border-amber-200/60 shadow-xs">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#E59500] border-t-transparent" />
                    <span>Loading more designs...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* On-Page FAQ Section for AEO (Answer Engine Optimization) */}
        {seoConfig.faqs && seoConfig.faqs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">
              Frequently Asked Questions — {currentCategory.name} Nameplates
            </h2>
            <div className="space-y-4 max-w-4xl">
              {seoConfig.faqs.map((faq, index) => (
                <div key={index} className="bg-[#FFFDD0]/40 p-5 rounded-2xl border border-amber-100">
                  <h3 className="font-semibold text-[#2C3E50] text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
