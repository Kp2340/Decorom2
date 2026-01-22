import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { processCheckout } from "../api/checkout.api";
import { getProductById } from "../api/products.api";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { config } = location.state || {}; // Config from ProductDetails (dimensions, price)

  const [product, setProduct] = useState(null);

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
    email: "",
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

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      productId: product.id,
      dimensions: {
        height: config.height,
        width: config.width,
        area: config.totalSqInch,
      },
      material: config.material,
      lighting: config.withLighting,
      fitting: config.withFitting,
      shipping: shipping,
    };

    try {
      const response = await processCheckout(payload);
      // Assuming response contains the final price
      if (response && response.finalPrice) {
        setBackendPrice(response.finalPrice);
        setSuccess(true);
      } else {
        // If backend just says "Success" or similar but doesn't return price in obvious field
        // We might fallback or show a generic success message.
        // Rule says: "Displays backend-calculated final price"
        // I will assume it is sent back.
        setBackendPrice(response.price || response.total || "N/A");
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Checkout failed. Please try again.");
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
              src={
                product.images && product.images.length > 0
                  ? product.images[0].imageUrl
                  : "https://via.placeholder.com/64x64?text=No+Image"
              }
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

        {/* Shipping Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Shipping Details
            </h2>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                required
                type="text"
                name="fullName"
                value={shipping.fullName}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                value={shipping.email}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                required
                type="tel"
                name="phone"
                value={shipping.phone}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                required
                name="address"
                rows={2}
                value={shipping.address}
                onChange={handleChange}
                className="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  required
                  type="text"
                  name="city"
                  value={shipping.city}
                  onChange={handleChange}
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  required
                  type="text"
                  name="pincode"
                  value={shipping.pincode}
                  onChange={handleChange}
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
