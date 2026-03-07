// Utility helpers for working with product images
// Converts various backend shapes into an ordered string array of URLs.
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";
export const BLUR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='16'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E";

const addUrlIfValid = (urls, value) => {
  if (typeof value === "string" && value.trim().length > 0) {
    urls.push(value.trim());
  }
};

/**
 * Normalizes images coming from the backend.
 * Accepts either a full product object (with `images`/`link`) or the images array itself.
 * Returns a de-duplicated, sort-ordered array of URL strings ready for <img src="">.
 */
export const toImageUrls = (productOrImages) => {
  const urls = [];

  // 1) Pull images array if present
  const images = Array.isArray(productOrImages?.images)
    ? productOrImages.images
    : Array.isArray(productOrImages)
      ? productOrImages
      : [];

  // Sort by sortOrder when available to preserve backend ordering
  const sortedImages = [...images].sort(
    (a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0),
  );

  sortedImages.forEach((img) => {
    if (typeof img === "string") {
      addUrlIfValid(urls, img);
    } else {
      addUrlIfValid(urls, img?.imageUrl);
      addUrlIfValid(urls, img?.url);
      addUrlIfValid(urls, img?.secureUrl);
    }
  });

  // 2) Fallback to link / thumbnail fields (string or string[])
  const link = productOrImages?.link || productOrImages?.thumbnailUrl;
  if (Array.isArray(link)) {
    link.forEach((l) => addUrlIfValid(urls, l));
  } else {
    addUrlIfValid(urls, link);
  }

  // 3) Return unique URLs preserving first-seen order
  return Array.from(new Set(urls));
};

// --- Responsive image helpers ---
const isCloudinary = (url) =>
  typeof url === "string" && url.includes("/upload/");

const withCloudinaryTransform = (url, width) => {
  if (!isCloudinary(url)) return url;

  // 1. Normalize: Remove existing transformation segments if any
  // Transformation segments appear between /upload/ and either the version (/v1234/) or the public ID
  let normalizedUrl = url;

  // If there's a version string (e.g., /v1771698199/), strip everything between /upload/ and that version
  const versionMatch = url.match(/\/upload\/(?:.*)\/(v\d+)\//);
  if (versionMatch) {
    normalizedUrl = url.replace(/\/upload\/.*?\/(v\d+)\//, "/upload/$1/");
  } else {
    // Fallback: If no version, try to strip segments that look like transformations (no file extension dot)
    // and stop before the last part (file name/id)
    normalizedUrl = url.replace(/\/upload\/[^.]*?\//, "/upload/");
  }

  // 2. Inject our optimized transformation segment
  return normalizedUrl.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
};

/**
 * Returns src + srcSet + sizes for responsive <img> tags.
 * Falls back gracefully for non-cloudinary URLs.
 */
export const responsiveImageProps = (
  url,
  widths = [320, 480, 640, 960, 1280],
) => {
  if (typeof url !== "string" || url.length === 0) {
    return { src: PLACEHOLDER_IMAGE, srcSet: undefined, sizes: undefined };
  }

  const build = (w) => withCloudinaryTransform(url, w);
  const src = build(Math.max(...widths));
  const srcSet = widths.map((w) => `${build(w)} ${w}w`).join(", ");
  const sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

  return { src, srcSet, sizes };
};
