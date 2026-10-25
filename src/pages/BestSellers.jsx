import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedProducts } from "../api/products.api";
import { BEST_SELLER_IDS, BEST_SELLER_FALLBACKS } from "../config/bestSellers";
import SEO from "../components/SEO";
import FreeDeliveryBanner from "../components/FreeDeliveryBanner";
import { isFixedPrice } from "../utils/productUtils";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="aspect-[4/5] bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-8 bg-gray-200 rounded-xl mt-3" />
    </div>
  </div>
);

const BestSellers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFeaturedProducts();
        const data = res?.data ?? res;
        const list = Array.isArray(data) ? data : data?.content ?? [];

        // 1. Resolve BEST_SELLER_IDS, prioritizing live API with infallible fallback
        const bestSellers = BEST_SELLER_IDS.map((id) => {
          const live = list.find((p) => p.id === id);
          const fb = BEST_SELLER_FALLBACKS.find((f) => f.id === id);
          return live || fb;
        }).filter(Boolean);

        // 2. Append any extra featured products not in the config
        const configSet = new Set(BEST_SELLER_IDS);
        const extras = list.filter((p) => !configSet.has(p.id));

        setProducts([...bestSellers, ...extras]);
      } catch {
        setProducts(BEST_SELLER_FALLBACKS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Best Selling Nameplates — Decorom"
        description="Explore Decorom's top-selling custom nameplates, handpicked and loved by hundreds of customers."
        keywords="Best Seller Nameplates, Popular Nameplates Ahmedabad, Top Nameplate Designs"
      />

      {/* Page Header */}
      <div className="bg-slate-50/80 border-b border-slate-200/80 py-10 px-4 text-center">
        <p className="text-xs font-black text-[#E59500] uppercase tracking-widest mb-2">Customer Favourites</p>
        <h1 className="text-3xl md:text-4xl font-black text-[#2C3E50] mb-3">Our Best Sellers</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Handpicked by our customers — these are the most loved nameplates at Decorom.
        </p>
      </div>

      <FreeDeliveryBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="text-center py-12 text-red-500 font-semibold">{error}</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 product-card-lift cursor-pointer flex flex-col h-full"
                >
                  {/* Image + Rank Badge */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={product.thumbnailUrl || BEST_SELLER_FALLBACKS[0].thumbnailUrl}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = BEST_SELLER_FALLBACKS[0].thumbnailUrl;
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Rank chip */}
                    <div className="absolute top-2 left-2 w-8 h-8 bg-[#2C3E50]/80 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md">
                      #{index + 1}
                    </div>
                    {/* Best seller badge */}
                    <div className="absolute top-2 right-2 bg-[#E59500] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wide">
                      Best Seller
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-[#2C3E50] text-sm leading-snug line-clamp-2 min-h-[2.5rem] mb-1 group-hover:text-[#E59500] transition-colors">
                      {product.name}
                    </h3>
                    {product.material && (
                      <p className="text-[11px] text-gray-400 font-medium mb-2">{product.material}</p>
                    )}
                    {product.basePrice > 0 && (
                      <p className="text-[#E59500] font-black text-sm mb-3">
                        {isFixedPrice(product) ? "" : "Starting "}₹
                        {product.basePrice.toLocaleString()}
                      </p>
                    )}
                    <button className="w-full mt-auto bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] text-xs font-bold py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-xs cursor-pointer">
                      Order Now →
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-4">🏷️</p>
            <p className="font-semibold">No featured products yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellers;
