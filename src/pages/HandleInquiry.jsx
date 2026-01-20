import { useState, useEffect, useMemo, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetailsModal from "../components/ProductDetailsModal";
import { useParams } from "react-router-dom";

/**
 * HandleInquiry - Product gallery page with filtering and pagination.
 *
 * Optimizations:
 * - useMemo for filteredProducts to prevent recalculation on every render
 * - useCallback for setSelectedProduct to prevent ProductCard re-renders
 * - Pagination to reduce initial memory footprint (12 products at a time)
 */
const PRODUCTS_PER_PAGE = 12;

const HandleInquiry = () => {
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [material, setMaterial] = useState("");
  const [shape, setShape] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  // Load product data
  useEffect(() => {
    // Dynamic import based on type (currently hardcoded to nameplate)
    import(`../data/nameplate.js`)
      .then((module) => setProducts(module.types))
      .catch((error) => {
        console.error("Failed to load products:", error);
        setProducts([]);
      });
  }, [type]);

  // Memoized filtered products - only recalculates when products/material/shape change
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        (!material || p.material === material) && (!shape || p.shape === shape),
    );
  }, [products, material, shape]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [material, shape]);

  // Stable callback for product selection - prevents ProductCard re-renders
  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
  }, []);

  // Products to display (paginated)
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  if (!products.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section id="hero" className="text-center py-16 bg-gray-50">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Decorom Gallery
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Discover our unique collection of wall art and decorative pieces
        </p>
      </section>

      {/* Filters */}
      <section
        id="filters"
        className="py-8 bg-white sticky top-0 z-30 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-center items-center px-4">
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
          >
            <option value="">All Materials</option>
            <option value="Acrylic">Acrylic</option>
            <option value="Wood">Wood</option>
            <option value="Stainless Steel">Stainless Steel</option>
          </select>
          <select
            value={shape}
            onChange={(e) => setShape(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
          >
            <option value="">All Shapes</option>
            <option value="Square">Square</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Circle">Circle</option>
            <option value="Oval">Oval</option>
            <option value="Unique">Unique</option>
          </select>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Product count */}
          <p className="text-gray-500 text-sm mb-6 text-center">
            Showing {displayedProducts.length} of {filteredProducts.length}{" "}
            products
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-md transition-all"
              >
                Load More ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default HandleInquiry;
