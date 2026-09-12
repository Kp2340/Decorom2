import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentlyViewed } from "../utils/recentlyViewedUtils";
import { toImageUrls, responsiveImageProps, PLACEHOLDER_IMAGE } from "../utils/imageUtils";

/**
 * Shows the last few products the visitor viewed (localStorage only).
 * Renders nothing if there's no history yet.
 */
const RecentlyViewedRail = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getRecentlyViewed());
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-8 md:py-10 bg-cyan-50/60 border-t border-cyan-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#2C3E50]">Recently Viewed</h2>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid auto-cols-[38vw] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid-flow-row sm:grid-cols-3 lg:grid-cols-5 sm:gap-4 sm:overflow-visible">
          {items.map((product) => {
            const { src } = responsiveImageProps(toImageUrls(product)[0] || PLACEHOLDER_IMAGE);
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group cursor-pointer bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow product-card-lift"
              >
                <div className="aspect-square bg-slate-100">
                  <img
                    src={src}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-xs sm:text-sm font-semibold text-[#2C3E50] truncate">{product.name}</p>
                  <p className="text-[#2C3E50] text-xs sm:text-sm font-bold mt-0.5">
                    ₹{(product.basePrice || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewedRail;
