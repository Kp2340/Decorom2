import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProducts } from "../api/products.api";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

import { CATEGORIES, slugify } from "../constants/categories";

const CategoryPage = () => {
  const { materialName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentCategory = CATEGORIES.find(c => slugify(c.name) === materialName) || CATEGORIES[0];

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setError(null);
      setProducts([]);
      setLoading(true);
      try {
        // Fetch 20 products for "Best Seller" experience as requested
        const data = await getProducts(0, 20, currentCategory.id);
        if (data && data.content) {
          setProducts(data.content);
        } else if (Array.isArray(data)) {
          setProducts(data.slice(0, 20));
        } else {
          setProducts([]);
        }
      } catch {
        setError("Failed to load category products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };


    fetchCategoryProducts();
    window.scrollTo(0, 0);
  }, [materialName, currentCategory.material]);


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
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Best Selling {currentCategory.name} Nameplates
          </h1>
          <p className="text-gray-500">Showing our top 20 picks for {currentCategory.name} designs.</p>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading best sellers...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">No products found in this category.</div>
        ) : (
          <div className="grid auto-cols-[44vw] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:overflow-visible sm:pb-0">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
