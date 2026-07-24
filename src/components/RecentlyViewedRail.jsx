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
    <section className="py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recently Viewed</h2>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid auto-cols-[38vw] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid-flow-row sm:grid-cols-3 lg:grid-cols-5 sm:gap-4 sm:overflow-visible">
          {items.map((product) => {
            const { src } = responsiveImageProps(toImageUrls(product)[0] || PLACEHOLDER_IMAGE);
            return (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100">
                  <img
                    src={src}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-pink-600 text-xs sm:text-sm font-bold">
                    ₹{(product.basePrice || 0).toLocaleString()}
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
