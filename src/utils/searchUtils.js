// Client-side product search. Catalog is small enough (tens to a couple hundred
// products) to fetch once and filter in the browser — no search backend needed.
const normalize = (s) => (s || "").toString().toLowerCase().trim();

export const matchesQuery = (product, query) => {
  const q = normalize(query);
  if (!q) return false;
  const haystack = normalize(
    [product?.name, product?.material, product?.shape, product?.description].join(" "),
  );
  return haystack.includes(q);
};

export const searchProducts = (products, query, limit) => {
  const q = normalize(query);
  if (!q || !Array.isArray(products)) return [];
  const results = products.filter((p) => matchesQuery(p, q));
  return typeof limit === "number" ? results.slice(0, limit) : results;
};
