import React, { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

import { CATEGORIES, slugify } from "../constants/categories";

const Products = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      const results = {};
      await Promise.all(
        CATEGORIES.map(async (cat) => {
          try {
            const data = await getProducts(0, 4, cat.id);
            results[cat.id] = data?.content || (Array.isArray(data) ? data.slice(0, 4) : []);
          } catch (err) {
            results[cat.id] = [];
          }
        })
      );
      setSections(results);
      setLoading(false);
    };
    fetchAllCategories();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16">
      <SEO
        title="Our Full Range of Designer Nameplates"
        description="Browse all types of premium nameplates: Stainless Steel, Wooden, Acrylic, and more. Find the perfect design for your home."
      />

      {/* Hero */}
      <div className="bg-gray-900 text-white py-10 md:py-16 mb-8 md:mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-2 md:mb-4">Our Masterpieces</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg">
            Premium nameplates across 5 material categories — handcrafted in Ahmedabad.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600" />
        </div>
      ) : (
        <div className="container mx-auto px-4 space-y-12 md:space-y-20">
          {CATEGORIES.map((cat) => (
            <section key={cat.id}>

              {/* Section header */}
              <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-gray-100 pb-3 md:pb-4">
                <div>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {cat.name} Collection
                  </h2>
                  <p className="text-gray-500 text-xs md:text-base hidden sm:block">
                    The finest {cat.name.toLowerCase()} designs for your entrance.
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/category/${slugify(cat.name)}`)}
                  className="text-pink-600 font-bold text-sm md:text-base hover:text-pink-700 transition-colors whitespace-nowrap ml-4"
                >
                  View All →
                </button>
              </div>

              {/*
                Mobile  : horizontal grid-flow-col, each card = 44vw → 2 visible + scroll for rest
                Desktop : normal 2-col → 4-col grid
                No wrapper divs needed — auto-cols sets each grid item's width directly.
              */}
              <div className="grid auto-cols-[44vw] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:overflow-visible sm:pb-0">
                {sections[cat.id]?.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/products/${product.id}`)}
                  />
                ))}
                {(!sections[cat.id] || sections[cat.id].length === 0) && (
                  <p className="text-center text-gray-400 italic py-10 col-span-full">
                    Coming soon...
                  </p>
                )}
              </div>

            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
