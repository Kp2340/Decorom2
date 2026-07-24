import { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "decorom_wishlist";

const WishlistContext = createContext(null);

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Wishlist — localStorage-backed, no backend. Stores a minimal snapshot of
 * each product (id, name, price, material, images) at the time it's added,
 * so the wishlist page never needs to re-fetch anything.
 */
export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(readStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable (private browsing / quota) — fail silently
    }
  }, [items]);

  const isWishlisted = useCallback(
    (id) => items.some((p) => p.id === id),
    [items],
  );

  const toggleWishlist = useCallback((product) => {
    if (!product?.id) return;
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      const snapshot = {
        id: product.id,
        name: product.name,
        basePrice: product.basePrice ?? product.price ?? 0,
        material: product.material,
        shape: product.shape,
        defaultSize: product.defaultSize ?? product.size,
        // List-view products carry a single `thumbnailUrl`, not an `images`
        // array — keep both so toImageUrls() finds whichever is present.
        images: product.images,
        thumbnailUrl: product.thumbnailUrl,
        link: product.link,
      };
      return [snapshot, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggleWishlist, removeFromWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
