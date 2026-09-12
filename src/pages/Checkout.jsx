import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { processCheckout } from "../api/checkout.api";
import { getProductById } from "../api/products.api";
import { toImageUrls } from "../utils/imageUtils";
import { initFirstVisit, getEligiblePromo, calculateDiscount } from "../utils/promoUtils";
import PromoSection from "../components/PromoSection";
import FreeDeliveryBanner from "../components/FreeDeliveryBanner";
import useFreeDeliveryOffer from "../hooks/useFreeDeliveryOffer";
import { isFixedPrice, parseDefaultSize } from "../utils/productUtils";
import { getDeliveryLines, FREE_DELIVERY_CODE } from "../utils/deliveryUtils";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { config, product: passedProduct } = location.state || {};

  // Use product passed via navigation state; fetch from API only if missing (direct URL access)
  const [product, setProduct] = useState(passedProduct || null);

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "Ahmedabad", // Defaulting to city mentioned in contact
    pincode: "",
    phone: "",
    email: "",
  });

  const [customDetails, setCustomDetails] = useState({
    namePlateDetails: "",
    height: config?.height || 12,
    width: config?.width || 24,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [backendPrice, setBackendPrice] = useState(null); // Price returned from backend
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  // Promo state
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
  const [promoInfo, setPromoInfo] = useState(null); // Full response from /api/promo/validate

  // A fixed-price best seller: no size editing, no user-selectable promos, ₹150 delivery that
  // FREEDELIVERY waives automatically. Mirrors CheckoutController's fixedPrice branch.
  const fixedPrice = isFixedPrice(product);
  const offer = useFreeDeliveryOffer();
  const delivery = getDeliveryLines(product, config?.price ?? 0, offer.active);

  useEffect(() => {
    initFirstVisit();
    if (passedProduct) return; // Already have product from navigation state — skip fetch
    const loadProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch {
        setApiError("Failed to load product details for checkout.");
      }
    };
    loadProduct();
  }, [productId]);

  // Re-evaluate eligible promo when base price changes (e.g. user resizes)
  useEffect(() => {
    if (!config?.price) return;
    // Fixed-price best sellers carry no user-selectable promos. Without this guard the
    // client-side auto-apply below would silently attach NEW500 (−₹500 over a ₹2,500 order)
    // WITHOUT calling the backend, so the displayed total would not match what is charged.
    if (fixedPrice) {
      if (appliedPromoCode) handlePromoRemove();
      return;
    }
    const eligible = getEligiblePromo(config.price);
    // Only auto-apply if nothing is currently applied
    if (!appliedPromoCode && eligible) {
      setAppliedPromoCode(eligible);
      const { discountAmount, finalPrice } = calculateDiscount(eligible, config.price);
      setPromoInfo({
        code: eligible,
        deductionAmount: discountAmount,
        discountedTotal: finalPrice,
        message: discountAmount > 0 ? `₹${discountAmount} discount applied!` : null,
      });
    }
    // If applied code no longer passes minOrder after resize, clear it
    if (appliedPromoCode) {
      const { discountAmount: d } = calculateDiscount(appliedPromoCode, config.price);
      if (d === 0) handlePromoRemove();
    }
  }, [config?.price, fixedPrice]);

  const handlePromoApply = useCallback((code, data) => {
    setAppliedPromoCode(code);
    setPromoInfo(data);
  }, []);

  const handlePromoRemove = useCallback(() => {
    setAppliedPromoCode(null);
    setPromoInfo(null);
  }, []);

  // Redirect if user hit checkout directly without configuration
  useEffect(() => {
    if (!config) {
      navigate(`/products/${productId}`);
    }
  }, [config, navigate, productId]);

  if (!product || !config) return null;
  const productImages = toImageUrls(product);
  const productImageSrc =
    productImages[0] || "https://via.placeholder.com/64x64?text=No+Image";

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    if (name === "namePlateDetails") {
      const lines = value.split("\n");
      if (lines.length <= 5 && value.length <= 100) {
        setCustomDetails((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      const val = parseInt(value) || 0;
      setCustomDetails((prev) => ({ ...prev, [name]: val }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // A fixed SKU always ships at its configured size, whatever is in local state.
    const fixedDims = fixedPrice ? parseDefaultSize(product.defaultSize) : null;
    const orderHeight = fixedDims?.height || customDetails.height;
    const orderWidth = fixedDims?.width || customDetails.width;

    // Validate ALL fields together without early returning
    const newErrors = {};

    // 1. Name plate content
    if (!customDetails.namePlateDetails.trim()) {
      newErrors.namePlateDetails = "Please enter name plate text.";
    }

    // 2. Dimensions (for custom sizing)
    if (!fixedPrice) {
      if (!orderHeight || orderHeight < 1 || orderHeight > 96) {
        newErrors.height = "Height: 1 to 96 inches.";
      }
      if (!orderWidth || orderWidth < 1 || orderWidth > 96) {
        newErrors.width = "Width: 1 to 96 inches.";
      }
    }

    // 3. Full Name
    if (!shipping.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (shipping.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    }

    // 4. Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shipping.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailPattern.test(shipping.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // 5. Mobile Number (10 digits)
    const digits = shipping.phone.replace(/\D/g, "");
    const isValidPhone =
      (digits.length === 10 && /^[6-9]/.test(digits)) ||
      (digits.length === 12 && digits.startsWith("91") && /^[6-9]/.test(digits.slice(2))) ||
      (digits.length === 11 && digits.startsWith("0") && /^[6-9]/.test(digits.slice(1)));

    if (!shipping.phone.trim()) {
      newErrors.phone = "Mobile number is required.";
    } else if (!isValidPhone) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    // 6. Address
    if (!shipping.address.trim()) {
      newErrors.address = "Delivery address is required.";
    } else if (shipping.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
    } else if (shipping.address.length > 200) {
      newErrors.address = "Address must not exceed 200 characters.";
    }

    // 7. City
    if (!shipping.city.trim()) {
      newErrors.city = "City is required.";
    }

    // 8. Pincode
    if (!shipping.pincode.trim()) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(shipping.pincode.trim())) {
      newErrors.pincode = "Pincode must be exactly 6 digits.";
    }

    // If ANY validation errors exist, show ALL of them together
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      // Auto-scroll to first invalid element
      const firstField = Object.keys(newErrors)[0];
      const targetElement = document.querySelector(`[name="${firstField}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        targetElement.focus();
      }
      return;
    }

    setErrors({});
    setLoading(true);

    // Re-validate promo on submit to catch expired codes
    let finalPromoCode = appliedPromoCode || null;
    let discountedPrice = promoInfo?.discountedTotal ?? config.price ?? 0;

    if (fixedPrice) {
      finalPromoCode = null;
      discountedPrice = delivery.total;
    } else if (appliedPromoCode) {
      try {
        const { validatePromoCode } = await import("../api/promos.api");
        const recheck = await validatePromoCode(appliedPromoCode, config.price);
        const recheckData = recheck?.data ?? recheck;
        if (!recheckData.valid) {
          setApiError(`Promo code ${appliedPromoCode} is no longer valid: ${recheckData.message}`);
          handlePromoRemove();
          setLoading(false);
          return;
        }
        discountedPrice = recheckData.discountedTotal ?? discountedPrice;
      } catch {
        finalPromoCode = null;
        discountedPrice = config.price ?? 0;
      }
    }

    const payload = {
      productId: product.id,
      dimensions: {
        height: orderHeight,
        width: orderWidth,
        area: orderHeight * orderWidth,
      },
      namePlateDetails: customDetails.namePlateDetails,
      size: `${orderWidth}x${orderHeight}`,
      material: config.material,
      lightingIncluded: fixedPrice ? false : config.withLighting,
      fittingIncluded: fixedPrice ? false : config.withFitting,
      frontendPrice: discountedPrice,
      promoCode: finalPromoCode,
      shipping: {
        ...shipping,
        pincode: parseInt(shipping.pincode),
      },
    };

    try {
      const res = await processCheckout(payload);
      const response = res?.data ?? res;
      
      // 1. Check for payment redirect
      if (response && response.paymentUrl) {
        setLoading(true);
        window.location.href = response.paymentUrl;
        return;
      }

      // 2. Fallback to success UI (for mock mode or edge cases)
      if (response && response.orderId) {
        setBackendPrice(response.finalPrice || "CONFIRMED");
        setSuccess(true);
      } else {
        setSuccess(false);
        setApiError("Unable to complete checkout. Please check your details and try again.");
      }
    } catch (err) {
      setApiError(err.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-green-100 p-8 rounded-lg shadow-md inline-block max-w-md w-full">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            Order Placed!
          </h2>
          <p className="text-gray-700 mb-6">
            Thank you, {shipping.fullName}. Your order has been received.
          </p>

          <div className="bg-white p-4 rounded border border-green-200 mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
              Total Amount Paid
            </p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              ₹{backendPrice}
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-50/60 py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#2C3E50]">
          Checkout
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white border border-cyan-100 p-6 rounded-2xl shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4 text-[#2C3E50]">
              Order Summary
            </h2>
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={productImageSrc}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {config.height}" x {config.width}"
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Material</span>
              <span>{config.material}</span>
            </div>
            {/* Add-ons are not offered on a fixed SKU, so showing "No" twice is just noise. */}
            {!fixedPrice && (
              <>
                <div className="flex justify-between">
                  <span>Lighting</span>
                  <span>{config.withLighting ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fitting</span>
                  <span>{config.withFitting ? "Yes" : "No"}</span>
                </div>
              </>
            )}
          </div>

          {fixedPrice ? (
            <div className="mt-4 rounded-lg bg-[#FFFDD0]/60 border border-amber-100 p-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Product</span>
                  <span className="font-semibold">
                    ₹{delivery.goodsPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  {delivery.waived ? (
                    <span className="font-semibold">
                      <span className="mr-1.5 text-gray-400 line-through">
                        ₹{delivery.charge.toLocaleString()}
                      </span>
                      <span className="text-green-600">FREE</span>
                    </span>
                  ) : (
                    <span className="font-semibold">
                      ₹{delivery.charge.toLocaleString()}
                    </span>
                  )}
                </div>

                {delivery.waived && (
                  <div className="flex justify-between text-xs font-bold text-green-600">
                    <span>{FREE_DELIVERY_CODE}</span>
                    <span>− ₹{delivery.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-slate-200 pt-2">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-[#2C3E50]">
                    ₹{delivery.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <FreeDeliveryBanner variant="inline" className="mt-3" />

              <p className="mt-2 text-[10px] text-slate-400">
                ✓ Inclusive of all taxes & free delivery
              </p>
            </div>
          ) : (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            {promoInfo?.deductionAmount > 0 ? (
              <>
                <p className="text-xs text-slate-400 mb-0.5 font-semibold uppercase line-through">
                  ₹{config.price?.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-emerald-700 font-bold mb-0.5">
                  − ₹{promoInfo.deductionAmount?.toLocaleString("en-IN")} ({appliedPromoCode})
                </p>
                <p className="text-2xl font-bold text-[#2C3E50]">
                  ₹{promoInfo.discountedTotal?.toLocaleString("en-IN")}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">
                  Estimated Price
                </p>
                <p className="text-2xl font-bold text-[#2C3E50]">
                  ~ ₹{config.price?.toLocaleString("en-IN")}
                </p>
              </>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              ✓ Guaranteed final price upon order placement
            </p>
          </div>
          )}

          {/* Promo Section — hidden entirely for fixed-price best sellers: no other code is
              applicable to them, so offering or even displaying one would be misleading. */}
          {!fixedPrice && (
            <div className="mt-4">
              <PromoSection
                basePrice={config.price || 0}
                appliedCode={appliedPromoCode}
                discountInfo={promoInfo}
                onApply={handlePromoApply}
                onRemove={handlePromoRemove}
              />
            </div>
          )}
        </div>

        {/* Checkout Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

            {/* Section 1: Name Plate Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
                <span className="w-8 h-8 bg-[#FFFDD0] text-[#E59500] font-bold rounded-full flex items-center justify-center text-sm">1</span>
                Name Plate Content
              </h3>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Lines (Max 5) & Text (Max 100 chars)
                </label>
                <textarea
                  required
                  name="namePlateDetails"
                  rows={3}
                  value={customDetails.namePlateDetails}
                  onChange={handleCustomChange}
                  placeholder="Enter details as they should appear on the name plate..."
                  className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all resize-none font-medium"
                />
                <div className="flex justify-between mt-1 text-[10px] font-bold text-gray-400">
                    <span>{customDetails.namePlateDetails.split('\n').filter(l => l).length} / 5 Lines</span>
                    <span>{customDetails.namePlateDetails.length} / 100 Characters</span>
                </div>
              </div>
            </div>

            {/* Section 2: Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
                <span className="w-8 h-8 bg-[#FFFDD0] text-[#E59500] font-bold rounded-full flex items-center justify-center text-sm">2</span>
                Size (Inches)
              </h3>
              {/* Read-only for a fixed SKU. These inputs never recomputed the price anyway, so
                  editing them used to ship new dimensions with the old frontendPrice. */}
              {fixedPrice ? (
                <>
                  <div className="flex items-center justify-between rounded-xl border-2 border-gray-100 bg-gray-50 p-4">
                    <span className="font-bold text-gray-900">
                      {config.height}" × {config.width}"
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Standard size
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-gray-400">
                    * This best seller ships in one standard size.
                  </p>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Height</label>
                      <input
                        required
                        type="number"
                        name="height"
                        value={customDetails.height}
                        onChange={handleCustomChange}
                        className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all font-bold no-spinner"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Width</label>
                      <input
                        required
                        type="number"
                        name="width"
                        value={customDetails.width}
                        onChange={handleCustomChange}
                        className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all font-bold no-spinner"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">* Acceptable range: 1x1 to 96x96 inches</p>
                </>
              )}
            </div>

            {/* Section 3: Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#2C3E50] flex items-center gap-2">
                <span className="w-8 h-8 bg-[#FFFDD0] text-[#E59500] font-bold rounded-full flex items-center justify-center text-sm">3</span>
                Delivery Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input required type="text" name="fullName" value={shipping.fullName} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                  <input required type="email" name="email" value={shipping.email} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                  <input required type="tel" name="phone" value={shipping.phone} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all font-medium" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address</label>
                <textarea
                  required
                  name="address"
                  rows={2}
                  value={shipping.address}
                  onChange={handleShippingChange}
                  placeholder="Street, Landmark, Apartment..."
                  className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City</label>
                  <input required type="text" name="city" value={shipping.city} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pincode</label>
                  <input required type="text" name="pincode" value={shipping.pincode} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-[#E59500] focus:ring-1 focus:ring-[#E59500] outline-none transition-all font-medium" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-white text-[#E59500] border border-[#E59500] hover:bg-[#E59500] hover:text-white font-bold py-4 rounded-xl shadow-md transition-all duration-300 active:scale-95 text-base tracking-wide uppercase disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processing..." : "Checkout →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default Checkout;
