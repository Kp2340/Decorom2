import { Helmet } from "react-helmet-async";

const DEFAULT_OG_IMAGE = "https://decorom.in/logo/logo.png";

const SEO = ({ title, description, keywords, image, url }) => {
  const siteName = "Decorom - Designer Nameplates";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription =
    "Premium designer nameplates in Ahmedabad, Gujarat. Custom handcrafted nameplates for homes and offices. Best quality materials and modern designs.";
  const defaultKeywords =
    "Nameplates, Designer Nameplates, Ahmedabad Nameplates, Custom Nameplates, Home Decor, Gujarat Nameplates, Decorom";
  const ogImage = image || DEFAULT_OG_IMAGE;
  const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "https://decorom.in");

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={pageUrl} />

      {/* Local SEO — Ahmedabad / Gujarat */}
      <meta name="geo.region" content="IN-GJ" />
      <meta name="geo.placename" content="Ahmedabad" />
      <meta name="geo.position" content="23.0225;72.5714" />
      <meta name="ICBM" content="23.0225, 72.5714" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Decorom" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
