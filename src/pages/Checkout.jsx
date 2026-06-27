import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { processCheckout } from "../api/checkout.api";
import { getProductById } from "../api/products.api";
import { toImageUrls } from "../utils/imageUtils";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { config } = location.state || {}; // Config from ProductDetails (dimensions, price)

  const [product, setProduct] = useState(null);

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

  useEffect(() => {
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

    // Basic Validation
    if (customDetails.height < 1 || customDetails.height > 96 || customDetails.width < 1 || customDetails.width > 96) {
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

    const payload = {
      productId: product.id,
      dimensions: {
        height: customDetails.height,
        width: customDetails.width,
        area: customDetails.height * customDetails.width,
      },
      namePlateDetails: customDetails.namePlateDetails,
      size: `${customDetails.width}x${customDetails.height}`,
      material: config.material,
      lightingIncluded: config.withLighting,
      fittingIncluded: config.withFitting,
      frontendPrice: config.price || 0,
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
        setError("Checkout failed: unexpected server response. Please try again.");
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
              Final Price (Confirmed)
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
            <div className="flex justify-between">
              <span>Lighting</span>
              <span>{config.withLighting ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span>Fitting</span>
              <span>{config.withFitting ? "Yes" : "No"}</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-pink-50 rounded text-center">
            <p className="text-xs text-pink-600 mb-1 font-semibold uppercase">
              Estimated Frontend Price
            </p>
            <p className="text-2xl font-bold text-pink-700">
              ~ ₹{config.price}
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              * Final price will be confirmed by backend.
            </p>
          </div>
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
              {loading ? "Processing..." : "Secure Checkout"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
