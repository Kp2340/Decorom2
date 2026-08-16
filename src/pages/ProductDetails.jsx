import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { getProductById, getProducts } from "../api/products.api";
import ProductImageCarousel from "../components/ProductImageCarousel";
import ProductPriceCalculator from "../components/ProductPriceCalculator";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";
import { CONTACT_WHATSAPP_URL, GOOGLE_MAPS_REVIEWS_URL } from "../constants/contact";
import { CATEGORIES } from "../constants/categories";
import { recordProductView } from "../utils/recentlyViewedUtils";
import { isFixedPrice, getDisplayPrice } from "../utils/productUtils";
import FreeDeliveryBanner from "../components/FreeDeliveryBanner";
import { useAuth } from "../auth/AuthContext";

const NameplateEditor = lazy(() => import("../editor/NameplateEditor"));

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

  return (
    <div className="container mx-auto px-4 py-8 pb-28 md:pb-8">
      <SEO
        title={product?.name || "Product Details"}
        description={product?.description || "High-quality designer nameplate from Decorom."}
        image={product?.images?.[0] || ""}
      />

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

      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-pink-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-pink-600 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductImageCarousel images={product.images} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
            <span className="font-bold text-gray-800 text-sm">4.8</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">· 3 reviews on</span>
            <svg viewBox="0 0 24 24" className="w-10 h-4" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </a>

          <p className="text-gray-500 mb-6">{product.description}</p>

          <div className="mb-6 space-y-2 text-sm sm:text-base">
            <p>
              <span className="font-semibold">Material:</span>{" "}
              {product.material}
            </p>
            <p>
              <span className="font-semibold">Shape:</span> {product.shape}
            </p>
            <p>
              <span className="font-semibold">
                {fixedPriceProduct ? "Size:" : "Default Size:"}
              </span>{" "}
              {product.defaultSize || "Not specified"}
            </p>
            <div className="flex flex-col mt-4">
              <span className="text-gray-500 text-xs">
                {fixedPriceProduct ? "Price" : "Estimated Price"}
              </span>
              <p className="text-3xl font-bold text-pink-600">
                ₹{getDisplayPrice(
                  product,
                  config && config.isValid ? config.price : 0,
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {fixedPriceProduct && <FreeDeliveryBanner variant="inline" className="mb-6" />}


          {parsedEditorConfig?.enabled && (
            <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-lg mb-6" />}>
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
                    className="text-sm font-semibold text-pink-600 hover:text-pink-700 inline-flex items-center gap-1.5"
                  >
                    {shareCopied ? "Link copied!" : "🔗 Copy link to this design"}
                  </button>
                </div>
              )}
            </Suspense>
          )}

          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <ProductPriceCalculator
              product={product}
              onChange={handlePriceChange}
              externalDimensions={parsedEditorConfig?.enabled ? editorDimensions : null}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleBuyNow}
              className="w-full bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-gray-800 transition transform hover:-translate-y-1 active:scale-95"
            >
              Order Now
            </button>
            <button
              onClick={handleWhatsAppCustomize}
              className="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-green-600 transition transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.093 0-4.113-.541-5.874-1.57l-6.119 1.688zm12.031-2.030c1.802 0 3.558-.482 5.071-1.392l.362-.218c1.517.898 3.73 1.048 5.602.193l.474-.214-1.464-5.353.111-.175c1.101-1.745 1.687-3.773 1.687-5.872 0-5.871-4.776-10.647-10.647-10.647-2.842 0-5.513 1.108-7.521 3.116-2.007 2.008-3.113 4.681-3.113 7.531 0 2.062.566 4.076 1.635 5.823l.131.214-1.541 5.629 5.761-1.514.22.131c1.512.894 3.253 1.365 5.045 1.365h.001zm5.69-8.121c-.312-.156-1.848-.912-2.138-1.017-.29-.106-.5-.156-.712.156-.213.312-.821 1.017-1.008 1.229-.188.212-.375.239-.687.083-.312-.155-1.316-.486-2.507-1.548-.927-.827-1.553-1.849-1.734-2.16-.181-.312-.019-.481.136-.636.141-.139.312-.364.468-.547.156-.182.209-.312.312-.52.105-.209.052-.39-.026-.547-.079-.156-.712-1.714-.975-2.345-.256-.615-.517-.532-.712-.542-.181-.01-.39-.01-.599-.01-.212 0-.555.079-.844.39-.29.312-1.107 1.083-1.107 2.641 0 1.558 1.133 3.064 1.29 3.273.156.212 2.23 3.404 5.402 4.774.754.325 1.343.518 1.802.663.757.241 1.446.207 1.99.125.607-.091 1.848-.755 2.11-1.484.262-.73.262-1.353.184-1.484-.078-.131-.29-.212-.605-.368z" />
              </svg>
              Customize on WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* You may also like — same material, excludes this product */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">You May Also Like</h2>
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

      {/* Sticky mobile buy bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] text-gray-400 uppercase">Price</span>
          <span className="text-lg font-bold text-pink-600">₹{displayPrice.toLocaleString()}</span>
        </div>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-black text-white font-bold py-3 rounded-xl active:scale-95 transition-transform"
        >
          Order Now
        </button>
        <button
          onClick={handleWhatsAppCustomize}
          aria-label="Customize on WhatsApp"
          className="p-3 bg-green-500 text-white rounded-xl active:scale-95 transition-transform"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.093 0-4.113-.541-5.874-1.57l-6.119 1.688zm12.031-2.030c1.802 0 3.558-.482 5.071-1.392l.362-.218c1.517.898 3.73 1.048 5.602.193l.474-.214-1.464-5.353.111-.175c1.101-1.745 1.687-3.773 1.687-5.872 0-5.871-4.776-10.647-10.647-10.647-2.842 0-5.513 1.108-7.521 3.116-2.007 2.008-3.113 4.681-3.113 7.531 0 2.062.566 4.076 1.635 5.823l.131.214-1.541 5.629 5.761-1.514.22.131c1.512.894 3.253 1.365 5.045 1.365h.001zm5.69-8.121c-.312-.156-1.848-.912-2.138-1.017-.29-.106-.5-.156-.712.156-.213.312-.821 1.017-1.008 1.229-.188.212-.375.239-.687.083-.312-.155-1.316-.486-2.507-1.548-.927-.827-1.553-1.849-1.734-2.16-.181-.312-.019-.481.136-.636.141-.139.312-.364.468-.547.156-.182.209-.312.312-.52.105-.209.052-.39-.026-.547-.079-.156-.712-1.714-.975-2.345-.256-.615-.517-.532-.712-.542-.181-.01-.39-.01-.599-.01-.212 0-.555.079-.844.39-.29.312-1.107 1.083-1.107 2.641 0 1.558 1.133 3.064 1.29 3.273.156.212 2.23 3.404 5.402 4.774.754.325 1.343.518 1.802.663.757.241 1.446.207 1.99.125.607-.091 1.848-.755 2.11-1.484.262-.73.262-1.353.184-1.484-.078-.131-.29-.212-.605-.368z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

