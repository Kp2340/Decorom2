import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 10;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentPending, setPaymentPending] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    let attempts = 0;

    const fetchOrder = async () => {
      try {
        // Use the correct public endpoint
        const res = await apiClient.get(`/api/orders/public/${orderId}`);
        const data = res?.data ?? res;

        // If payment is still PENDING (user hit back/timeout), poll until confirmed
        // We also check for FAILED if it was processed while we were waiting
        if (data?.paymentStatus === "PENDING") {
          attempts++;
          if (attempts >= POLL_MAX_ATTEMPTS) {
            setPaymentPending(true);
            setLoading(false);
            return;
          }
          // Poll again after interval
          setTimeout(fetchOrder, POLL_INTERVAL_MS);
          return;
        }

        if (data?.paymentStatus === "FAILED" || data?.status === "CANCELLED") {
            setPaymentPending(true); // Treat FAILED as "not confirmed" so we show the orange screen
            setLoading(false);
            return;
        }

        setOrderData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load order details");
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  const orderId = searchParams.get("orderId");
  const trackingUrl = `${window.location.origin}/track/${orderId}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 font-sans">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="mt-4 text-white text-xl font-semibold">
            Verifying payment...
          </p>
          <p className="text-white/70 text-sm mt-2">Please wait, do not refresh</p>
        </div>
      </div>
    );
  }

  // Payment not confirmed after polling
  if (paymentPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 px-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6 text-6xl">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Not Confirmed</h2>
          <p className="text-gray-600 mb-4">
            We could not confirm your payment yet. If money was deducted from your account, 
            it will be reflected here once confirmed, or refunded within 5-7 business days.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Order ID: <span className="font-mono font-bold">{orderId}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Contact us at <strong>kppremium0002@gmail.com</strong> with your Order ID if you need help.
          </p>
          <div className="flex gap-4">
            <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
                Retry
            </button>
            <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
                Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-600 to-purple-700 px-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6 text-6xl">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-50 text-lg">Your order has been placed successfully</p>
          </div>

          <div className="p-8">
            {/* Order ID */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-xl font-bold text-purple-700 font-mono break-all">
                {orderData?.orderId}
              </p>
            </div>

            {/* Tracking Link */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-blue-800 mb-2">📦 Track Your Order</p>
              <p className="text-xs text-blue-600 mb-3">
                Bookmark this link to track your order status anytime:
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={trackingUrl}
                  className="flex-1 text-xs bg-white border border-blue-300 rounded px-3 py-2 font-mono text-blue-700 outline-none"
                />
                <button
                  onClick={() => {
                      navigator.clipboard.writeText(trackingUrl);
                      alert("Link copied to clipboard!");
                  }}
                  className="text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition whitespace-nowrap active:scale-95"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-blue-500 mt-2">
                A copy of this link has been sent to your email.
              </p>
            </div>

            {/* Important Message */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
              <p className="text-sm text-yellow-700 font-semibold">
                We'll contact you soon to finalize your design and arrange delivery.
              </p>
            </div>

            {/* Order Details */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Order Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-lg font-semibold text-gray-800">{orderData?.category || "N/A"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Material</p>
                  <p className="text-lg font-semibold text-gray-800">{orderData?.material || "N/A"}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Size</p>
                  <p className="text-lg font-semibold text-gray-800">{orderData?.size} Inch</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{orderData?.price?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Order Progress</h3>
              <OrderStatusTracker status={orderData?.status} progress={orderData?.estimatedProgress} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/track/${orderData?.orderId}`)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
              >
                Go to Tracking Page
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl shadow hover:bg-gray-200 transition-all duration-300 active:scale-95"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order status stages (consistent with backend)
const STAGES = [
  { key: "PAYMENT_DONE", label: "Payment Received" },
  { key: "PAYMENT_DONE_500", label: "Advance Paid" },
  { key: "DESIGN_MAKING", label: "Design Process" },
  { key: "DESIGN_CONFIRMED", label: "Design Approved" },
  { key: "IN_MANUFACTURING", label: "Manufacturing" },
  { key: "MANUFACTURED", label: "Quality Check" },
  { key: "DISPATCHED", label: "Dispatched" },
  { key: "SHIPPED", label: "Delivered" },
];

const OrderStatusTracker = ({ status, progress }) => {
  const currentIdx = STAGES.findIndex((s) => s.key === status);

  return (
    <div className="relative">
      <div className="flex flex-col gap-4">
        {STAGES.map((stage, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={stage.key} className="flex items-center gap-4 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 transition-colors
                ${isCurrent ? "bg-blue-600 text-white ring-4 ring-blue-100" :
                  isDone ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                {isDone && !isCurrent ? "✓" : idx + 1}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${isCurrent ? "font-bold text-blue-700" : isDone ? "text-green-700" : "text-gray-400"}`}>
                    {stage.label}
                </p>
              </div>
              {isCurrent && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold animate-pulse">
                  STAY TUNED
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Visual Progress Bar */}
      {progress !== undefined && (
        <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
            <span>Overall Completion</span>
            <span className="text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-out shadow-inner"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;