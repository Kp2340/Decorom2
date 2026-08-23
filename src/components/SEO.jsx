import { Helmet } from "react-helmet-async";

const DEFAULT_OG_IMAGE = "https://decorom.in/logo/logo.png";
const BASE_DOMAIN = "https://www.decorom.in";

const SEO = ({ title, description, keywords, image, url, noindex = false }) => {
  // Title formatting: strictly optimal character length for search engines
  const formattedTitle = title
    ? `${title} - Decorom`
    : "Designer Nameplates in Ahmedabad | Custom Home Decor - Decorom";

  const defaultDescription =
    "Shop premium designer nameplates in Ahmedabad, Gujarat. Custom acrylic, wooden, LED & steel nameplates handcrafted for modern homes and offices.";

  const defaultKeywords =
    "Designer Nameplates Ahmedabad, Custom Nameplates Gujarat, Home Entrance Decor, LED Nameplates, Wooden Nameplates, Acrylic Nameplates";

  const ogImage = image || DEFAULT_OG_IMAGE;

  // Clean canonical URL generation without tracking query parameters
  const canonicalUrl = url
    ? url.split("?")[0]
    : typeof window !== "undefined"
    ? `${BASE_DOMAIN}${window.location.pathname}`
    : BASE_DOMAIN;

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* Local SEO for Ahmedabad / Gujarat */}
      <meta name="geo.region" content="IN-GJ" />
      <meta name="geo.placename" content="Ahmedabad" />
      <meta name="geo.position" content="23.0693;72.5503" />
      <meta name="ICBM" content="23.0693, 72.5503" />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Decorom" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
