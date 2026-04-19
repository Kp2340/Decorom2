import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

import { STAGES } from "../constants/orderStages";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
        try {
            const data = await apiClient.get(`/api/orders/public/${orderId}`);
            setOrderData(data);
            setLoading(false);
        } catch (err) {
            setError(err.message || "Failed to load order. Please double check your Order ID.");
            setLoading(false);
        }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Tracking your masterpiece...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm">{error}</p>
          <button 
            onClick={() => navigate("/")} 
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-pink-200"
          >
            Back to Showroom
          </button>
        </div>
      </div>
    );
  }

  const currentIdx = Math.max(0, STAGES.findIndex((s) => s.key === orderData?.status));
  const progress = orderData?.estimatedProgress ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-1">Track Order</h1>
                <p className="text-xs text-gray-400 font-mono tracking-tighter">ID: {orderData?.orderId}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1
                    ${orderData?.status === 'CANCELLED' ? 'bg-red-50 text-red-600 ring-red-100' : 'bg-pink-50 text-pink-700 ring-pink-100'}`}>
                    {orderData?.status?.replace(/_/g, " ")}
                </span>
            </div>
          </div>

          {/* Large Progress Indicator */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-gray-500">Overall Progress</span>
              <span className="text-3xl font-black text-pink-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Product Size</p>
                <p className="font-bold text-gray-800">{orderData?.size ? `${orderData.size} Inch` : "N/A"}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Total Value</p>
                <p className="font-bold text-green-600">₹{orderData?.price?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Last Activity</p>
                <p className="font-bold text-gray-800">
                    {orderData?.lastUpdated
                    ? new Date(orderData.lastUpdated).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric",
                        })
                    : "Not available"}
                </p>
            </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-8 border-b pb-4">Production Timeline</h2>
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100" />

            <div className="flex flex-col gap-8">
              {STAGES.map((stage, idx) => {
                const isDone = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={stage.key} className="flex items-start gap-6 relative group">
                    {/* Status Circle */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 z-10 transition-all duration-300
                      ${isCurrent ? "bg-pink-600 text-white shadow-xl shadow-pink-200 rotate-12 scale-110" :
                        isDone ? "bg-green-500 text-white" : "bg-gray-50 text-gray-300 border border-gray-100"}`}>
                      {isDone && !isCurrent ? "✓" : stage.icon}
                    </div>

                    {/* Stage Info */}
                    <div className={`flex-1 pt-1 ${!isCurrent && !isDone ? "opacity-30" : ""}`}>
                      <p className={`font-black text-sm uppercase tracking-tight ${isCurrent ? "text-pink-700" : isDone ? "text-green-700" : "text-gray-400"}`}>
                        {stage.label}
                        {isCurrent && (
                          <span className="ml-3 text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md font-black animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </p>
                      {(isDone || isCurrent) && (
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{stage.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
          <h3 className="text-lg font-black mb-2 flex items-center gap-2">
            <span className="animate-bounce">💡</span> Need Assistance?
          </h3>
          <p className="text-sm text-indigo-50 leading-relaxed mb-6">
            For specialized design requests or address changes, reach out to our team at 
            <strong className="block text-white mt-1 underline">kppremium0002@gmail.com</strong>
          </p>
          <div className="flex items-center gap-4">
              <a href="tel:+919016707658" className="px-6 py-2 bg-white text-indigo-700 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform">
                Call Support
              </a>
              <button onClick={() => navigate("/")} className="text-xs text-indigo-100 underline font-medium">
                Return to Gallery
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
