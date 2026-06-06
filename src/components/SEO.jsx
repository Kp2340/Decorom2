import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, image, url }) => {
  const siteName = "Decorom - Designer Nameplates";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Premium designer nameplates in Ahmedabad, Gujarat. Custom handcrafted nameplates for homes and offices. Best quality materials and modern designs.";
  const defaultKeywords = "Nameplates, Designer Nameplates, Ahmedabad Nameplates, Custom Nameplates, Home Decor, Gujarat Nameplates, Decorom";

  return (
    <Helmet>
      {/* Basic metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      {/* Local SEO for Ahmedabad/Gujarat */}
      <meta name="geo.region" content="IN-GJ" />
      <meta name="geo.placename" content="Ahmedabad" />
      <meta name="geo.position" content="23.0225;72.5714" />
      <meta name="ICBM" content="23.0225, 72.5714" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url || (typeof window !== "undefined" ? window.location.href : "")} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || (typeof window !== "undefined" ? window.location.href : "")} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {image && <meta name="twitter:image" content={image} />}

    </Helmet>
  );
};

export default SEO;
