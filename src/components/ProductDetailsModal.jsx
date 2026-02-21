import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import Gallery from "./model/Gallery";
import ProductInfo from "./model/ProductInfo";
import ShippingForm, { validateShipping } from "./model/ShippingForm";
import CheckoutButton from "./model/CheckoutButton";
import ImageCarousel from "./ImageCarousel";
import { PLACEHOLDER_IMAGE, toImageUrls } from "../utils/imageUtils";

const PriceCalculator = lazy(() => import("./PriceCalculator"));
const NameplateEditor = lazy(() => import("../editor/NameplateEditor"));

/**
 * ProductDetailsModal - Main product modal.
 *
 * UX Features:
 * - Body scroll locked when open
 * - Close button always visible (sticky header)
 * - Internal scrolling only
 * - Clean separation: Gallery | Details
 */
const ProductDetailsModal = ({ product, onClose }) => {
  // Lock body scroll + handle Escape key + browser back button
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escape key handler
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Push history state for mobile back button
    window.history.pushState({ modal: true }, "");
    const handlePopState = () => {
      onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onClose]);

  if (!product) return null;

  // Gallery Logic: Normalize all available images (link + images array)
  const allImages = useMemo(() => {
    const urls = toImageUrls(product);
    return urls.length > 0 ? urls : [PLACEHOLDER_IMAGE];
  }, [product]);
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(allImages[0]);
  }, [allImages]);

  // Calculator State
  const [calculatedConfig, setCalculatedConfig] = useState(null);

  // Nameplate Editor State (for customizable products)
  const [editorDimensions, setEditorDimensions] = useState(null);

  // Checkout Form State - includes identity + address fields
  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    email: "",
    flatNo: "",
    society: "",
    area: "",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if product has light
  const productHasLight = product.hasLight || false;

  // Stable callbacks
  const handleSelectImage = useCallback((img) => {
    setSelectedImage(img);
  }, []);

  const handleAddressChange = useCallback((name, value) => {
    setAddress((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    // Validation
    if (!calculatedConfig || !calculatedConfig.isValid) {
      alert("Please ensure product configuration is valid.");
      return;
    }

    if (calculatedConfig.price <= 0) {
      alert("Price is calculating... please wait a moment.");
      return;
    }

    // Use validateShipping helper
    const validationError = validateShipping(address);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    const sizeString = `${calculatedConfig.height}x${calculatedConfig.width}`;

    const payload = {
      category: product.category || "General",
      material: calculatedConfig.material,
      size: sizeString,
      totalSqInch: calculatedConfig.totalSqInch,
      frontendPrice: calculatedConfig.price,
      lightingIncluded: calculatedConfig.withLighting,
      fittingIncluded: calculatedConfig.withFitting,
      customerAddress: {
        fullName: address.name,
        email: address.email,
        phone: address.mobile,
        street: `${address.flatNo}, ${address.society}, ${address.area}`,
        city: address.city,
        state: address.state,
        country: address.country,
        zipCode: address.pincode,
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Order Placed! ID:", data.id || data);
        alert("Order Placed!");
        onClose();
      } else if (response.status === 400) {
        const errorMsg = await response.text();
        alert(`Security Alert: ${errorMsg}`);
      } else {
        const errorMsg = await response.text();
        alert(`Order Failed: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred while placing the order.");
    } finally {
      setIsSubmitting(false);
    }
  }, [calculatedConfig, address, product, onClose]);

  return (
    /* Modal Overlay - fixed, handles backdrop click */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // Close on backdrop click only
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Container - positioned, contains header + body */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col animate-fadeIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close Button - ALWAYS visible */}
        <div className="sticky top-0 z-20 flex justify-end p-3 bg-white/95 backdrop-blur-sm rounded-t-xl border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div
          className="flex-1 overflow-y-auto flex flex-col md:flex-row"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Left: Gallery - mobile carousel first, desktop thumbs */}
          <div className="w-full md:w-1/2">
            <div className="md:hidden px-4 pt-2 pb-4">
              <ImageCarousel images={allImages} />
            </div>
            <div className="hidden md:block">
              <Gallery
                images={allImages}
                selectedImage={selectedImage}
                onSelectImage={handleSelectImage}
                productName={product.name}
              />
            </div>
          </div>

          {/* Right: Details, Calculator & Checkout */}
          <div className="w-full md:w-1/2 p-4 md:p-6 pb-24 md:pb-8 flex flex-col gap-4">
            <ProductInfo product={product} />

            {/* Nameplate Editor for customizable products */}
            {product.editorConfig?.enabled && (
              <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse rounded-lg" />}>
                <div className="mb-2">
                  <NameplateEditor
                    product={product}
                    onDimensionsChange={setEditorDimensions}
                  />
                </div>
              </Suspense>
            )}

            {/* Calculator */}
            <Suspense fallback={<div className="h-28 bg-gray-100 animate-pulse rounded-lg" />}>
              <PriceCalculator
                initialMaterial={product.material}
                initialSize={product.size}
                productHasLight={productHasLight}
                onPriceChange={setCalculatedConfig}
                externalDimensions={
                  product.editorConfig?.enabled ? editorDimensions : null
                }
              />
            </Suspense>

            {/* Shipping Form */}
            <ShippingForm
              address={address}
              onAddressChange={handleAddressChange}
            />

            {/* Checkout Button */}
            <div className="hidden md:block">
              <CheckoutButton
                isValid={calculatedConfig?.isValid}
                isSubmitting={isSubmitting}
                price={calculatedConfig?.price}
                onClick={handlePlaceOrder}
              />
            </div>
          </div>
        </div>

        {/* Sticky mobile checkout bar */}
        <div className="md:hidden sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur px-4 pt-3 pb-4 border-t border-gray-100">
          <CheckoutButton
            isValid={calculatedConfig?.isValid}
            isSubmitting={isSubmitting}
            price={calculatedConfig?.price}
            onClick={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
