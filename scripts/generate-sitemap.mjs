import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

async function generateSitemap() {
  const BASE_URL = "https://www.decorom.in";
  const today = new Date().toISOString().split("T")[0];

  // Import categories using file URL on Windows
  const categoriesUrl = pathToFileURL(
    path.join(rootDir, "src", "constants", "categories.js")
  ).href;
  const categoriesModule = await import(categoriesUrl);
  const { CATEGORIES, slugify } = categoriesModule;

  // Import verified products from bestSellers config using file URL on Windows
  const bestSellersUrl = pathToFileURL(
    path.join(rootDir, "src", "config", "bestSellers.js")
  ).href;
  const bestSellersModule = await import(bestSellersUrl);
  const { BEST_SELLER_FALLBACKS } = bestSellersModule;

  const urls = [];

  // 1. Core pages
  urls.push({
    loc: `${BASE_URL}/`,
    lastmod: today,
    changefreq: "daily",
    priority: "1.0",
  });
  urls.push({
    loc: `${BASE_URL}/products`,
    lastmod: today,
    changefreq: "daily",
    priority: "0.9",
  });
  urls.push({
    loc: `${BASE_URL}/best-sellers`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.85",
  });
  urls.push({
    loc: `${BASE_URL}/customers`,
    lastmod: today,
    changefreq: "weekly",
    priority: "0.8",
  });
  urls.push({
    loc: `${BASE_URL}/custom-design`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.75",
  });
  urls.push({
    loc: `${BASE_URL}/about`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.6",
  });
  urls.push({
    loc: `${BASE_URL}/contact`,
    lastmod: today,
    changefreq: "monthly",
    priority: "0.6",
  });
  urls.push({
    loc: `${BASE_URL}/privacy-policy`,
    lastmod: today,
    changefreq: "yearly",
    priority: "0.3",
  });
  urls.push({
    loc: `${BASE_URL}/terms`,
    lastmod: today,
    changefreq: "yearly",
    priority: "0.3",
  });
  urls.push({
    loc: `${BASE_URL}/refund-policy`,
    lastmod: today,
    changefreq: "yearly",
    priority: "0.3",
  });
  urls.push({
    loc: `${BASE_URL}/shipping-policy`,
    lastmod: today,
    changefreq: "yearly",
    priority: "0.3",
  });

  const staticCount = urls.length;

  // 2. Categories
  let categoryCount = 0;
  if (Array.isArray(CATEGORIES)) {
    for (const cat of CATEGORIES) {
      const slug = slugify ? slugify(cat.name) : cat.name.toLowerCase().replace(/\s+/g, "-");
      urls.push({
        loc: `${BASE_URL}/category/${slug}`,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.85",
      });
      categoryCount++;
    }
  }

  // 3. Products
  let productCount = 0;
  if (Array.isArray(BEST_SELLER_FALLBACKS)) {
    for (const prod of BEST_SELLER_FALLBACKS) {
      if (prod && prod.id) {
        urls.push({
          loc: `${BASE_URL}/products/${prod.id}`,
          lastmod: today,
          changefreq: "weekly",
          priority: "0.8",
        });
        productCount++;
      }
    }
  }

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const outputPath = path.join(rootDir, "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf-8");

  console.log(
    `[Sitemap Generator] Successfully generated public/sitemap.xml with ${urls.length} URLs:`
  );
  console.log(`  - ${staticCount} Core Static Pages`);
  console.log(`  - ${categoryCount} Material Category Pages`);
  console.log(`  - ${productCount} Individual Product Detail Pages`);
}

generateSitemap().catch((err) => {
  console.error("[Sitemap Generator] Failed:", err);
  process.exit(1);
});
