import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { getProductById, getProducts } from "../api/products.api";
import ProductImageCarousel from "../components/ProductImageCarousel";
import ProductPriceCalculator from "../components/ProductPriceCalculator";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { ProductStructuredData, BreadcrumbStructuredData } from "../components/StructuredData";
import { CONTACT_WHATSAPP_URL, GOOGLE_MAPS_REVIEWS_URL } from "../constants/contact";
import { CATEGORIES } from "../constants/categories";
import { recordProductView } from "../utils/recentlyViewedUtils";
import { isFixedPrice, getDisplayPrice } from "../utils/productUtils";
import FreeDeliveryBanner from "../components/FreeDeliveryBanner";
import TrustBadges from "../components/TrustBadges";
import { useAuth } from "../auth/AuthContext";

const NameplateEditor = lazy(() => import("../editor/NameplateEditor"));

const WhatsAppIcon = ({ className = "w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110" }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#25D366"
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"
    />
    <path
      fill="#FFFFFF"
      d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"
    />
  </svg>
);

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for calculator values to pass to checkout
  const [config, setConfig] = useState(null);

  // Dimensions driven by the live nameplate editor (when the product supports it)
  const [editorDimensions, setEditorDimensions] = useState(null);
  const [editorValues, setEditorValues] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  // A shared design link (?name=...&flat=...&w=...&h=...) seeds the editor's
  // initial state — read once, the editor owns its state after that.
  const sharedName = searchParams.get("name");
  const sharedFlat = searchParams.get("flat");
  const sharedWidth = Number(searchParams.get("w"));
  const sharedHeight = Number(searchParams.get("h"));
  const initialEditorValues = sharedName || sharedFlat
    ? { familyName: sharedName || "", flatNumber: sharedFlat || "" }
    : undefined;
  // Shared ?w=&h= is ignored for fixed-price best sellers — their size is not negotiable, so a
  // link carrying dimensions must not be able to reseed the editor.
  const fixedPriceProduct = isFixedPrice(product);
  const initialEditorDimensions = !fixedPriceProduct && sharedWidth > 0 && sharedHeight > 0
    ? { width: sharedWidth, height: sharedHeight }
    : undefined;

  const [relatedProducts, setRelatedProducts] = useState([]);

  // The backend always sends editorConfig as a raw JSON string (never a
  // pre-parsed object) — must parse before reading .enabled/.textZones etc.
  const parsedEditorConfig = useMemo(() => {
    const raw = product?.editorConfig;
    if (!raw) return null;
    if (typeof raw !== "string") return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [product]);
  const editorProduct = useMemo(
    () => (product ? { ...product, editorConfig: parsedEditorConfig } : product),
    [product, parsedEditorConfig],
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
        recordProductView(data);
      } catch {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // "You may also like" — same material, excludes the current product.
  useEffect(() => {
    if (!product) return;
    const category = CATEGORIES.find(
      (c) => c.name.toLowerCase() === (product.material || "").toLowerCase(),
    );
    if (!category) {
      setRelatedProducts([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getProducts(0, 8, category.id);
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        if (!cancelled) setRelatedProducts(list.filter((p) => p.id !== product.id));
      } catch {
        if (!cancelled) setRelatedProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product]);

  const handlePriceChange = React.useCallback((newConfig) => {
    setConfig((prev) => {
      if (
        prev &&
        prev.width === newConfig.width &&
        prev.height === newConfig.height &&
        prev.price === newConfig.price &&
        prev.isValid === newConfig.isValid &&
        prev.material === newConfig.material &&
        prev.withLighting === newConfig.withLighting &&
        prev.withFitting === newConfig.withFitting &&
        prev.totalSqInch === newConfig.totalSqInch
      ) {
        return prev;
      }
      return newConfig;
    });
  }, []);

  const handleBuyNow = () => {
    if (!config || !config.isValid) {
      alert("Please select valid dimensions.");
      return;
    }

    navigate(`/products/${product.id}/checkout`, {
      state: { config, product },
    });
  };

  const handleWhatsAppCustomize = () => {
    const productUrl = typeof window !== "undefined" ? window.location.href : "";
    const imageUrl = product.images?.[0] || "";
    
    let message = `Hello Decorom Team, I am interested in personalizing a nameplate for my home. Below are the details of the design I found on your website:\n\n`;
    message += `*Product:* ${product.name}\n`;
    message += `*Material:* ${product.material || "Handcrafted Custom"}\n`;
    if (config && config.isValid) {
      message += `*Requested Size:* ${config.width}" x ${config.height}"\n`;
      message += `*Calculated Price:* ₹${config.price}\n`;
    } else {
      message += `*Standard Size:* ${product.defaultSize || "Custom"}\n`;
    }
    message += `\n*Product Link:* ${productUrl}\n`;
    if (imageUrl) message += `*Image Reference:* ${imageUrl}\n\n`;
    message += `I would like to discuss this further. Please let me know the next steps.`;


    window.open(CONTACT_WHATSAPP_URL(message), "_blank", "noopener,noreferrer");
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  const displayPrice = getDisplayPrice(product, config && config.isValid ? config.price : 0);

  const productUrl = `https://www.decorom.in/products/${product.id}`;
  const highCtrTitle = `${product.name} | Custom Door Nameplate in Ahmedabad`;
  const highCtrDesc = product.description 
    ? `${product.description.slice(0, 140)}... Handcrafted in Ahmedabad with free doorstep delivery across India.`
    : `Buy ${product.name} online at Decorom. Custom handcrafted designer nameplate with weather-resistant finish. Fast delivery in Ahmedabad & India.`;

  const breadcrumbs = [
    { name: "Home", url: "https://www.decorom.in" },
    { name: "Products", url: "https://www.decorom.in/products" },
    { name: product.name, url: productUrl },
  ];

  return (
    <div>
      <SEO
        title={highCtrTitle}
        description={highCtrDesc}
        image={product?.images?.[0] || ""}
        url={productUrl}
      />
      <ProductStructuredData product={product} />
      <BreadcrumbStructuredData items={breadcrumbs} />

      {/* Breadcrumb — Permanently sticky and flush below header */}
      <nav
        className="sticky top-12 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs"
        aria-label="Breadcrumb"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-1.5 text-xs sm:text-sm text-slate-500">
          <Link to="/" className="hover:text-[#E59500] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#E59500] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-[#2C3E50] font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>
      </nav>

      {/* Main Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-28 md:pb-8">
        {/* Admin Quick Action Bar */}
        {isAuthenticated && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium text-amber-900">
              <span>👑</span>
              <span>Admin Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/products/${product.id}/edit`}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition text-xs flex items-center gap-1 shadow-sm"
              >
                ✏️ Edit Product
              </Link>
              <Link
                to={`/products/${product.id}/delete`}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition text-xs flex items-center gap-1 shadow-sm"
              >
                🗑️ Delete Product
              </Link>
            </div>
          </div>
        )}

        <div id="product-detail-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
          <div className="md:sticky md:top-[109px]">
            {/* Video-First Product Media Carousel */}
            <ProductImageCarousel
              images={product.images}
              videoUrl={product.videoUrl || product.video}
            />
          </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] mb-2 leading-tight">
            {product.name}
          </h1>

          {/* Google rating badge — links to Maps so customers can verify */}
          <a
            href={GOOGLE_MAPS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-4 group"
            aria-label="See reviews on Google"
          >
            <span className="font-bold text-[#2C3E50] text-sm">4.8</span>
            <div className="flex gap-0.5 text-[#E59500]">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-slate-500">· 3 reviews on</span>
            <svg viewBox="0 0 24 24" className="w-10 h-4" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </a>

          <p className="text-[#334155] text-sm sm:text-base mb-6 leading-relaxed">{product.description}</p>

          <div className="mb-6 space-y-2 text-sm sm:text-base">
            <p className="text-[#2C3E50]">
              <span className="font-semibold text-slate-500">Material:</span>{" "}
              {product.material}
            </p>
            <p className="text-[#2C3E50]">
              <span className="font-semibold text-slate-500">Shape:</span> {product.shape}
            </p>
            <p className="text-[#2C3E50]">
              <span className="font-semibold text-slate-500">
                {fixedPriceProduct ? "Size:" : "Default Size:"}
              </span>{" "}
              {product.defaultSize || "Not specified"}
            </p>
            <div className="flex flex-col mt-4">
              <span className="text-slate-500 text-xs font-medium">
                {fixedPriceProduct ? "Price" : "Estimated Price"}
              </span>
              <p className="text-3xl font-bold text-[#2C3E50]">
                ₹{getDisplayPrice(
                  product,
                  config && config.isValid ? config.price : 0,
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {fixedPriceProduct && <FreeDeliveryBanner variant="inline" className="mb-6" />}


          {parsedEditorConfig?.enabled && (
            <Suspense fallback={<div className="h-40 bg-slate-100 skeleton-shimmer rounded-lg mb-6" />}>
              <div className="mb-3">
                <NameplateEditor
                  product={editorProduct}
                  onValuesChange={setEditorValues}
                  onDimensionsChange={setEditorDimensions}
                  initialValues={initialEditorValues}
                  initialDimensions={initialEditorDimensions}
                />
              </div>
              {editorValues?.familyName?.trim() && (
                <div className="mb-6">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set("name", editorValues.familyName.trim());
                      if (editorValues.flatNumber?.trim()) params.set("flat", editorValues.flatNumber.trim());
                      if (editorDimensions?.width) params.set("w", editorDimensions.width);
                      if (editorDimensions?.height) params.set("h", editorDimensions.height);
                      const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
                      navigator.clipboard?.writeText(shareUrl);
                      setShareCopied(true);
                      setTimeout(() => setShareCopied(false), 2000);
                    }}
                    className="text-sm font-semibold text-[#E59500] hover:text-[#CC8400] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {shareCopied ? "Link copied!" : "🔗 Copy link to this design"}
                  </button>
                </div>
              )}
            </Suspense>
          )}

          <div className="mb-6">
            <ProductPriceCalculator
              product={product}
              onChange={handlePriceChange}
              externalDimensions={parsedEditorConfig?.enabled ? editorDimensions : null}
            />
          </div>

          {/* Dedicated Visual Trust Banner near primary CTA */}
          <TrustBadges variant="compact" className="mb-6" />

          <div className="flex flex-col gap-3">
            <button
              onClick={handleBuyNow}
              className="w-full bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] font-bold py-4 px-6 rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 text-base cursor-pointer"
            >
              Order Now
            </button>
            <button
              onClick={handleWhatsAppCustomize}
              className="group w-full bg-[#0F172A] hover:bg-white text-white hover:text-[#0F172A] border border-[#0F172A] font-bold py-4 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <WhatsAppIcon />
              <span>Customize on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* You may also like — same material, excludes this product */}
      {relatedProducts.length > 0 && (
        <div className="mt-14 md:mt-20 border-t border-slate-200/80 pt-10">
          <h2 className="text-xl md:text-2xl font-bold text-[#2C3E50] mb-6">You May Also Like</h2>
          <div className="grid auto-cols-[44vw] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible">
            {relatedProducts.slice(0, 4).map((related) => (
              <ProductCard
                key={related.id}
                product={related}
                onClick={() => navigate(`/products/${related.id}`)}
              />
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Sticky mobile buy bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center gap-3">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
          <span className="text-lg font-bold text-[#2C3E50]">₹{displayPrice.toLocaleString("en-IN")}</span>
        </div>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] font-bold py-3 rounded-xl active:scale-95 transition-all text-sm cursor-pointer shadow-xs"
        >
          Order Now
        </button>
        <button
          onClick={handleWhatsAppCustomize}
          aria-label="Customize on WhatsApp"
          className="p-3 bg-[#0F172A] hover:bg-white text-white hover:text-[#0F172A] border border-[#0F172A] rounded-xl active:scale-95 transition-all duration-300 transform hover:scale-105 shadow-sm cursor-pointer group"
        >
          <WhatsAppIcon />
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

