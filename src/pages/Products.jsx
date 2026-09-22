import React, { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import ProductCard from "../components/ProductCard";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SEO from "../components/SEO";

import { CATEGORIES, slugify } from "../constants/categories";

const Products = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      const results = {};
      await Promise.all(
        CATEGORIES.map(async (cat) => {
          try {
            const data = await getProducts(0, 4, cat.id);
            results[cat.id] = data?.content || (Array.isArray(data) ? data.slice(0, 4) : []);
          } catch {
            results[cat.id] = [];
          }
        })
      );
      setSections(results);
      setLoading(false);
    };
    fetchAllCategories();
  }, []);

  // Scroll to previous section if returning from product detail page
  useEffect(() => {
    if (!loading && location.state?.fromSection) {
      const sectionId = `section-${location.state.fromSection}`;
      const el = document.getElementById(sectionId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [loading, location.state]);

  return (
    <div className="min-h-screen bg-white pb-16">
      <SEO
        title="Our Full Range of Designer Nameplates"
        description="Browse all types of premium nameplates: Stainless Steel, Wooden, Acrylic, and more. Find the perfect design for your home."
      />

      {/* Hero */}
      <div className="bg-[#0F172A] text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4">Our Masterpieces</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-lg">
            Premium nameplates across 5 material categories — handcrafted in Ahmedabad.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E59500]" />
        </div>
      ) : (
        <div className="space-y-0">
          {CATEGORIES.map((cat, idx) => (
            <section
              key={cat.id}
              id={`section-${slugify(cat.name)}`}
              className={`py-10 md:py-14 ${
                idx % 2 === 0 ? "bg-cyan-50/60 border-b border-cyan-100/80" : "bg-white"
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="flex items-center justify-between mb-4 md:mb-8 border-b border-gray-200/60 pb-3 md:pb-4">
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-[#2C3E50] leading-tight">
                      {cat.name} Collection
                    </h2>
                    <p className="text-gray-500 text-xs md:text-base hidden sm:block">
                      The finest {cat.name.toLowerCase()} designs for your entrance.
                    </p>
                  </div>
                  <Link
                    to={`/category/${slugify(cat.name)}`}
                    className="text-[#E59500] font-bold text-sm md:text-base hover:text-[#CC8400] transition-colors whitespace-nowrap ml-4 inline-flex items-center cursor-pointer"
                  >
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 md:gap-8">
                  {sections[cat.id]?.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() =>
                        navigate(`/products/${product.id}`, {
                          state: { fromSection: slugify(cat.name) },
                        })
                      }
                    />
                  ))}
                  {(!sections[cat.id] || sections[cat.id].length === 0) && (
                    <p className="text-center text-gray-400 italic py-10 col-span-full">
                      Coming soon...
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
