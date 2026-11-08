import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import { useWishlist } from "../wishlist/WishlistContext";
import { toImageUrls } from "../utils/imageUtils";

const MiniCartDrawer = () => {
  const { items, isDrawerOpen, closeDrawer, removeFromWishlist, count } = useWishlist();
  const navigate = useNavigate();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") closeDrawer();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleCheckoutItem = (item) => {
    closeDrawer();
    navigate(`/products/${item.id}/checkout`, {
      state: {
        product: item,
      },
    });
  };

  const handleExploreProducts = () => {
    closeDrawer();
    navigate("/products");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Saved Designs Cart">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide Drawer Panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full w-full sm:w-[400px]">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {/* Mobile Back Arrow */}
              <button
                onClick={closeDrawer}
                className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-[#2C3E50] transition-colors cursor-pointer sm:hidden"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#E59500]" />
                  Saved Designs
                </h2>
                <p className="text-xs text-[#334155]">
                  {count === 0 ? "No designs saved yet" : `${count} item${count > 1 ? "s" : ""} ready for checkout`}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeDrawer}
              className="p-2 rounded-full hover:bg-slate-100 text-[#334155] hover:text-[#2C3E50] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content / Item List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-slate-100">
            {count === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#FFFDD0] flex items-center justify-center text-[#E59500] mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-[#2C3E50] mb-1">
                  Your Design Tray is Empty
                </h3>
                <p className="text-xs text-[#334155] max-w-xs mb-6">
                  Explore our handcrafted custom nameplates and save your favorite styles to review or order.
                </p>
                <button
                  onClick={handleExploreProducts}
                  className="w-full py-3 px-6 rounded-lg bg-white text-[#E59500] border border-[#E59500] hover:bg-[#E59500] hover:text-white font-medium text-sm transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Explore Nameplates
                </button>
              </div>
            ) : (
              items.map((item) => {
                const imgUrls = toImageUrls(item);
                const thumbnail = imgUrls[0] || item.thumbnailUrl || "/logo/logo.png";
                const price = item.basePrice ?? item.price ?? 0;

                return (
                  <div key={item.id} className="py-4 flex gap-4 items-start group">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                      <img
                        src={thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#2C3E50] truncate group-hover:text-[#E59500] transition-colors">
                        {item.name}
                      </h4>
                      <div className="text-xs text-[#334155] mt-0.5 space-x-2">
                        {item.material && <span>{item.material}</span>}
                        {item.defaultSize && <span>• {item.defaultSize}"</span>}
                      </div>
                      <div className="mt-1.5 flex items-baseline gap-2">
                        <span className="text-base font-bold text-[#2C3E50]">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleCheckoutItem(item)}
                          className="flex-1 py-1.5 px-3 rounded-md bg-white text-[#E59500] border border-[#E59500] hover:bg-[#E59500] hover:text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-xs cursor-pointer"
                        >
                          Order Now
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label={`Remove ${item.name}`}
                          title="Remove design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Bar when items exist */}
          {count > 0 && (
            <div className="px-5 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between text-xs text-[#334155] mb-2">
                <span>Free delivery on orders above ₹2,000</span>
                <span className="font-semibold text-emerald-700">7-Day Delivery</span>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Each custom nameplate is made-to-order with dedicated design confirmation before production.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCartDrawer;
