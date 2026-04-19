import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 15; // Increased slightly for slower webhooks

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    let isCancelled = false;
    let timerId = null;
    let attempts = 0;

    const fetchOrder = async () => {
      try {
        const res = await apiClient.get(`/api/orders/public/${orderId}`);
        if (isCancelled) return;
        
        const data = res?.data ?? res;

        // Poll if paymentStatus is PENDING or null (missing)
        if (!data?.paymentStatus || data?.paymentStatus === "PENDING") {
          attempts++;
          if (attempts >= POLL_MAX_ATTEMPTS) {
            setPaymentPending(true);
            setLoading(false);
            return;
          }
          timerId = setTimeout(fetchOrder, POLL_INTERVAL_MS);
          return;
        }

        // If payment explicitly FAILED
        if (data?.paymentStatus === "FAILED" || data?.status === "CANCELLED") {
            setPaymentFailed(true);
            setPaymentPending(false); 
            setLoading(false);
            return;
        }

        // Only show success if paymentStatus is explicitly SUCCESS
        if (data?.paymentStatus === "SUCCESS") {
            setOrderData(data);
            setLoading(false);
        } else {
            if (attempts < POLL_MAX_ATTEMPTS) {
                attempts++;
                timerId = setTimeout(fetchOrder, POLL_INTERVAL_MS);
            } else {
                setPaymentPending(true);
                setLoading(false);
            }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || "Failed to load order details");
          setLoading(false);
        }
      }
    };

    fetchOrder();
    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [searchParams]);

  const orderId = searchParams.get("orderId");
  const trackingUrl = `${window.location.origin}/track/${orderId}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 font-sans">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="mt-4 text-white text-xl font-semibold outline-none ring-0 border-none">
            Verifying payment...
          </p>
          <p className="text-white/70 text-sm mt-2">Wait for the confirmation!</p>
        </div>
      </div>
    );
  }

  // Payment explicitly failed case
  if (paymentFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-red-500">
          <div className="mb-6 text-6xl">🔴</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Unsuccessful</h2>
          <p className="text-gray-600 mb-6 text-sm">
            The transaction was declined by your bank or the payment gateway. 
            If money was deducted from your account, it will be refunded automatically by your bank within 5-7 working days.
          </p>
          <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center gap-2 mb-6">
              <span className="text-gray-500 font-mono text-xs italic">Ref: {orderId?.substring(0, 8)}...</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all active:scale-95"
          >
            Try buying again
          </button>
        </div>
      </div>
    );
  }

  // Payment not confirmed yet (Timeout case)
  if (paymentPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-orange-500">
          <div className="mb-6 text-6xl">🟠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Timeout</h2>
          <p className="text-gray-600 mb-4 text-sm">
            We haven't received confirmation from the payment gateway yet. 
            This usually happens due to slow internet or bank delays.
          </p>
          <p className="text-gray-500 text-[11px] mb-6">
            Your order will update automatically once we receive the confirmation. You can check the status on your tracking page in a few minutes.
          </p>
          <button
            onClick={() => navigate(`/track/${orderId}`)}
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-95"
          >
            Go to Tracking Page
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-t-8 border-red-500">
          <div className="mb-6 text-6xl">🔴</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Error</h2>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-red-600 transition-all active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border-t-8 border-green-500">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Payment Successful!</h1>
            <p className="text-green-50 text-lg opacity-90">Your order is now being processed.</p>
          </div>

          <div className="p-8">
            {/* Order Identity */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confirmation ID</p>
              <p className="text-lg font-bold text-gray-800 font-mono break-all leading-none">
                {orderData?.orderId}
              </p>
            </div>

            {/* Tracking Quick Access */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">📦</div>
                  <div>
                      <h4 className="font-black text-blue-900 leading-none">Track Progress</h4>
                      <p className="text-[10px] text-blue-600 mt-1">Bookmark this link to stay updated</p>
                  </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={trackingUrl}
                  className="flex-1 text-xs bg-white border border-blue-200 rounded-lg px-3 py-3 font-mono text-blue-800 outline-none shadow-inner"
                />
                <button
                  onClick={() => {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                          navigator.clipboard.writeText(trackingUrl)
                              .then(() => alert("Tracking link copied!"))
                              .catch(() => {
                                  // Fallback to execCommand
                                  const textArea = document.createElement("textarea");
                                  textArea.value = trackingUrl;
                                  document.body.appendChild(textArea);
                                  textArea.select();
                                  try {
                                      document.execCommand('copy');
                                      alert("Tracking link copied!");
                                  } catch (err) {
                                      alert("Failed to copy. Please copy the link manually.");
                                  }
                                  document.body.removeChild(textArea);
                              });
                      } else {
                          // Standard fallback
                          const textArea = document.createElement("textarea");
                          textArea.value = trackingUrl;
                          document.body.appendChild(textArea);
                          textArea.select();
                          try {
                              document.execCommand('copy');
                              alert("Tracking link copied!");
                          } catch (err) {
                              alert("Please copy the link manually: " + trackingUrl);
                          }
                          document.body.removeChild(textArea);
                      }
                  }}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-md"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="mb-10">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-pink-500 rounded-full"></span> Order Summary
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Item Info</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                      {orderData?.category || "Custom Nameplate"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Dimensions</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{orderData?.size} Inch</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 col-span-2">
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Final Amount Paid</p>
                  <p className="text-3xl font-black text-green-600">₹{orderData?.price?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(`/track/${orderData?.orderId}`)}
                className="flex-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >
                Track Status Page
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-100 text-gray-600 font-black py-4 px-6 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
              >
                Shop More
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
              <p className="text-[11px] text-gray-400 font-medium">
                  We've sent a detailed confirmation to your email address. 
                  Check your inbox for project timelines.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;