import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const [error, setError] = useState("");

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
        setError("Failed to load product details for checkout.");
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
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    if (name === "namePlateDetails") {
      const lines = value.split("\n");
      if (lines.length <= 5 && value.length <= 100) {
        setCustomDetails({ ...customDetails, [name]: value });
      }
    } else {
      // For height and width
      const val = parseInt(value) || 0;
      setCustomDetails({ ...customDetails, [name]: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // A fixed SKU always ships at its configured size, whatever is in local state.
    const fixedDims = fixedPrice ? parseDefaultSize(product.defaultSize) : null;
    const orderHeight = fixedDims?.height || customDetails.height;
    const orderWidth = fixedDims?.width || customDetails.width;

    // Basic Validation
    if (orderHeight < 1 || orderHeight > 96 || orderWidth < 1 || orderWidth > 96) {
      setError("Size must be between 1x1 and 96x96 inches.");
      setLoading(false);
      return;
    }

    if (shipping.address.trim().length < 5 || shipping.address.length > 200) {
        setError("Address must be between 5 and 200 characters.");
        setLoading(false);
        return;
    }

    if (!/^\d{6}$/.test(shipping.pincode)) {
        setError("Pincode must be exactly 6 digits.");
        setLoading(false);
        return;
    }

    // Re-validate promo on submit to catch expired codes
    let finalPromoCode = appliedPromoCode || null;
    let discountedPrice = promoInfo?.discountedTotal ?? config.price ?? 0;

    if (fixedPrice) {
      // The server owns this decision: it recomputes the waiver from its own IST clock and
      // ignores any promoCode we send. We only need frontendPrice to match the total the
      // customer was shown, so the server's ±₹1 tolerance check passes.
      finalPromoCode = null;
      discountedPrice = delivery.total;
    } else if (appliedPromoCode) {
      try {
        const { validatePromoCode } = await import("../api/promos.api");
        const recheck = await validatePromoCode(appliedPromoCode, config.price);
        const recheckData = recheck?.data ?? recheck;
        if (!recheckData.valid) {
          setError(`Promo code ${appliedPromoCode} is no longer valid: ${recheckData.message}`);
          handlePromoRemove();
          setLoading(false);
          return;
        }
        discountedPrice = recheckData.discountedTotal ?? discountedPrice;
      } catch {
        // If re-validation call fails, proceed without promo to avoid blocking checkout
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
          pincode: parseInt(shipping.pincode)
      },
    };

    try {
      const res = await processCheckout(payload);
      // Handle both axios response wrapper and direct data
      const response = res?.data ?? res;
      
      // 1. Check for payment redirect
      if (response && response.paymentUrl) {
        setLoading(true); // Keep loading state until we leave the page
        window.location.href = response.paymentUrl;
        return;
      }

      // 2. Fallback to success UI (for mock mode or edge cases)
      if (response && response.orderId) {
        setBackendPrice(response.finalPrice || "CONFIRMED");
        setSuccess(true);
      } else {
        // Response exists but has no actionable data — surface a visible error
        setSuccess(false);
        setError("Unable to complete checkout. Please check your details and try again.");
      }
    } catch (err) {
      setError(err.message || "Checkout failed. Please try again.");
    } finally {
      // Only unset loading if we're NOT redirecting
      // If we are redirecting, we want the button to stay disabled/loading
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
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
            <div className="mt-4 rounded-lg bg-pink-50 p-3">
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

                <div className="flex items-center justify-between border-t border-pink-200 pt-2">
                  <span className="text-xs font-semibold uppercase text-pink-600">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-pink-700">
                    ₹{delivery.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <FreeDeliveryBanner variant="inline" className="mt-3" />

              <p className="mt-2 text-[10px] text-gray-500">
                ✓ Inclusive of all taxes & free delivery
              </p>
            </div>
          ) : (
          <div className="mt-4 p-3 bg-pink-50 rounded text-center">
            {promoInfo?.deductionAmount > 0 ? (
              <>
                <p className="text-xs text-gray-400 mb-0.5 font-semibold uppercase line-through">
                  ₹{config.price?.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 font-bold mb-0.5">
                  − ₹{promoInfo.deductionAmount?.toLocaleString()} ({appliedPromoCode})
                </p>
                <p className="text-2xl font-bold text-pink-700">
                  ₹{promoInfo.discountedTotal?.toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-pink-600 mb-1 font-semibold uppercase">
                  Estimated Price
                </p>
                <p className="text-2xl font-bold text-pink-700">
                  ~ ₹{config.price?.toLocaleString()}
                </p>
              </>
            )}
            <p className="text-[10px] text-gray-500 mt-1">
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
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm">1</span>
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
                  className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-pink-500 outline-none transition-all resize-none font-medium"
                />
                <div className="flex justify-between mt-1 text-[10px] font-bold text-gray-400">
                    <span>{customDetails.namePlateDetails.split('\n').filter(l => l).length} / 5 Lines</span>
                    <span>{customDetails.namePlateDetails.length} / 100 Characters</span>
                </div>
              </div>
            </div>

            {/* Section 2: Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm">2</span>
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
                        className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-pink-500 outline-none transition-all font-bold no-spinner"
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
                        className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-pink-500 outline-none transition-all font-bold no-spinner"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">* Acceptable range: 1x1 to 96x96 inches</p>
                </>
              )}
            </div>

            {/* Section 3: Delivery Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm">3</span>
                Delivery Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input required type="text" name="fullName" value={shipping.fullName} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-pink-500 outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                  <input required type="email" name="email" value={shipping.email} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-pink-500 outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                  <input required type="tel" name="phone" value={shipping.phone} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-pink-500 outline-none transition-all font-medium" />
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
                  className="w-full border-2 border-gray-100 rounded-xl p-4 focus:border-pink-500 outline-none transition-all resize-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">City</label>
                  <input required type="text" name="city" value={shipping.city} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-pink-500 outline-none transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pincode</label>
                  <input required type="text" name="pincode" value={shipping.pincode} onChange={handleShippingChange} className="w-full border-2 border-gray-100 rounded-xl p-3 focus:border-pink-500 outline-none transition-all font-medium" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black py-5 rounded-2xl hover:from-pink-700 hover:to-rose-700 transition-all shadow-xl shadow-pink-200 disabled:opacity-50 transform active:scale-95 text-lg uppercase tracking-widest"
            >
              {loading ? "Processing..." : "Checkout →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
