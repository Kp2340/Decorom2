import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedProducts } from "../api/products.api";
import { BEST_SELLER_IDS } from "../config/bestSellers";
import SEO from "../components/SEO";

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

        // Sort by BEST_SELLER_IDS config order
        const sorted = [...BEST_SELLER_IDS]
          .map((id) => list.find((p) => p.id === id))
          .filter(Boolean);

        // Append any featured products not in the config (fallback)
        const configSet = new Set(BEST_SELLER_IDS);
        const extras = list.filter((p) => !configSet.has(p.id));

        setProducts([...sorted, ...extras]);
      } catch {
        setError("Could not load best sellers. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Best Selling Nameplates — Decorom"
        description="Explore Decorom's top-selling custom nameplates, handpicked and loved by hundreds of customers."
        keywords="Best Seller Nameplates, Popular Nameplates Ahmedabad, Top Nameplate Designs"
      />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-10 px-4 text-center">
        <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-2">Customer Favourites</p>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Our Best Sellers</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Handpicked by our customers — these are the most loved nameplates at Decorom.
        </p>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
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
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  {/* Image + Rank Badge */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    {product.thumbnailUrl ? (
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                    {/* Rank chip */}
                    <div className="absolute top-2 left-2 w-8 h-8 bg-black/80 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md">
                      #{index + 1}
                    </div>
                    {/* Best seller badge */}
                    <div className="absolute top-2 right-2 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wide">
                      Best Seller
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-pink-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.material && (
                      <p className="text-[11px] text-gray-400 font-medium mb-2">{product.material}</p>
                    )}
                    {product.basePrice > 0 && (
                      <p className="text-pink-600 font-black text-sm mb-3">
                        Starting ₹{product.basePrice.toLocaleString()}
                      </p>
                    )}
                    <button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-black py-2.5 rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all active:scale-95 shadow-sm shadow-pink-100">
                      Customise & Order →
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
