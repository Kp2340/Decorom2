// Recently viewed products — localStorage only, no backend/account needed.
const STORAGE_KEY = "decorom_recently_viewed";
const MAX_ITEMS = 10;

export const getRecentlyViewed = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const recordProductView = (product) => {
  if (!product?.id) return;
  try {
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
    const existing = getRecentlyViewed().filter((p) => p.id !== product.id);
    const next = [snapshot, ...existing].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — fail silently, this is a nice-to-have
  }
};
