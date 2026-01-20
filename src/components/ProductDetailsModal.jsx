import React, { useState, useEffect, useCallback, useMemo } from "react";
import PriceCalculator from "./PriceCalculator";
import NameplateEditor from "../editor/NameplateEditor";
import Gallery from "./model/Gallery";
import ProductInfo from "./model/ProductInfo";
import ShippingForm, { validateShipping } from "./model/ShippingForm";
import CheckoutButton from "./model/CheckoutButton";

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

  // Gallery Logic: Main image + extra images
  const allImages = useMemo(
    () => [product.link, ...(product.images || [])],
    [product.link, product.images],
  );
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        // Close on backdrop click only
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Container - positioned, contains header + body */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fadeIn"
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
          {/* Left: Gallery */}
          <Gallery
            images={allImages}
            selectedImage={selectedImage}
            onSelectImage={handleSelectImage}
            productName={product.name}
          />

          {/* Right: Details, Calculator & Checkout */}
          <div className="w-full md:w-1/2 p-6 pb-8 flex flex-col">
            <ProductInfo product={product} />

            {/* Nameplate Editor for customizable products */}
            {product.editorConfig?.enabled && (
              <div className="mb-4">
                <NameplateEditor
                  product={product}
                  onDimensionsChange={setEditorDimensions}
                />
              </div>
            )}

            {/* Calculator */}
            <PriceCalculator
              initialMaterial={product.material}
              initialSize={product.size}
              productHasLight={productHasLight}
              onPriceChange={setCalculatedConfig}
              externalDimensions={
                product.editorConfig?.enabled ? editorDimensions : null
              }
            />

            {/* Shipping Form */}
            <ShippingForm
              address={address}
              onAddressChange={handleAddressChange}
            />

            {/* Checkout Button */}
            <CheckoutButton
              isValid={calculatedConfig?.isValid}
              isSubmitting={isSubmitting}
              price={calculatedConfig?.price}
              onClick={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
