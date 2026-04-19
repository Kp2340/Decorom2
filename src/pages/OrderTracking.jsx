import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/client";

import { ALL_STAGES, getStagesForTrack } from "../constants/orderStages";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateWhatsAppLink = (message) => {
    const phone = "919016707658";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    let isMounted = true;

    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
        try {
            const data = await apiClient.get(`/api/orders/public/${orderId}`);
            if (isMounted) {
                setOrderData(data);
                setLoading(false);
            }
        } catch (err) {
            if (isMounted) {
                setError(err.message || "Failed to load order. Please double check your Order ID.");
                setLoading(false);
            }
        }
    };

    fetchOrder();
    return () => { isMounted = false; };
  }, [orderId]);

  const renderContent = () => {
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

    const currentIdx = Math.max(0, ALL_STAGES.findIndex((s) => s.key === orderData?.status));
    const progress = orderData?.estimatedProgress ?? 0;
    const stages = getStagesForTrack(orderData?.orderType);
    const activeIdxInTrack = stages.findIndex(s => s.key === orderData?.status);
    const isAttentionNeeded = orderData?.orderType === 'OFFLINE' && (
        orderData?.advanceStatus === 'NEEDED' || 
       (orderData?.price > 0 && !orderData?.amountConfirmed) ||
       (orderData?.amountConfirmed && !orderData?.first50Paid) ||
       (orderData?.status === 'VIDEO_SENT' && !orderData?.second50Paid)
    );

    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans focus:outline-none">
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-full -mr-16 -mt-16 opacity-50" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                  <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl font-black text-gray-900">Track Order</h1>
                      <span className="text-[9px] bg-gray-900 text-white px-2 py-0.5 rounded font-black tracking-widest uppercase">
                          {orderData?.orderType === 'OFFLINE' ? 'OFFLINE' : 'ONLINE'} TRACK
                      </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono tracking-tighter">ID: {orderData?.orderId}</p>
              </div>
              <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1
                      ${orderData?.status === 'CANCELLED' ? 'bg-red-50 text-red-600 ring-red-100' : 'bg-pink-50 text-pink-700 ring-pink-100'}`}>
                      {orderData?.status ? orderData.status.replace(/_/g, " ") : "PENDING"}
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

          {/* NEXT STEP Milestones */}
          {isAttentionNeeded && (
            <div className={`mb-6 p-6 rounded-3xl border-2 animate-in zoom-in duration-700
              ${orderData?.advanceStatus === 'NEEDED' || !orderData?.amountConfirmed 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
                  ${orderData?.advanceStatus === 'NEEDED' || !orderData?.amountConfirmed ? 'bg-orange-500' : 'bg-blue-600'}`}>
                  {orderData?.advanceStatus === 'NEEDED' ? '🎯' : !orderData?.amountConfirmed ? '⚖️' : '💰'}
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-black ${orderData?.advanceStatus === 'NEEDED' || !orderData?.amountConfirmed ? 'text-orange-900' : 'text-blue-900'}`}>
                    {orderData?.advanceStatus === 'NEEDED' ? "Step 1: Design Advance" : 
                     !orderData?.amountConfirmed ? "Step 2: Quote Approval" : 
                     !orderData.first50Paid ? "Step 3: Manufacturing Deposit" :
                     "Final Step: Balance Payment"}
                  </h3>
                  
                  <div className="mt-2 text-sm leading-relaxed opacity-80">
                    {orderData?.advanceStatus === 'NEEDED' && (
                      <div className="space-y-4">
                         <p>To begin your custom design, a small advance of <strong>₹500</strong> is required (deductible from final bill).</p>
                         <a 
                           href={generateWhatsAppLink(`Hello! Requesting QR for ₹500 advance for order ${orderData.orderId}.`)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-orange-600/10 text-orange-700 px-4 py-3 rounded-xl border border-orange-200 text-xs font-bold flex items-center justify-between hover:bg-orange-600/20 transition-all cursor-pointer"
                         >
                            <span>Pay ₹500 via WhatsApp</span>
                            <span className="bg-white px-2 py-0.5 rounded text-[10px] shadow-sm">Chat Now</span>
                         </a>
                      </div>
                    )}

                    {orderData?.advanceStatus === 'PAID' && !orderData?.amountConfirmed && orderData?.price > 0 && (
                      <div className="space-y-4">
                         <p>Your custom quote is ready: <strong>₹{orderData?.price?.toLocaleString()}</strong>. Please confirm to proceed to manufacturing.</p>
                         <a 
                           href={generateWhatsAppLink(`Hello! I confirm the price of ₹${orderData.price} for order ${orderData.orderId}.`)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-green-600/10 text-green-700 px-4 py-3 rounded-xl border border-green-200 text-xs font-bold flex items-center justify-between hover:bg-green-600/20 transition-all cursor-pointer"
                         >
                            <span>Confirm Quote & Proceed</span>
                            <span className="bg-white px-2 py-0.5 rounded text-[10px] shadow-sm">Confirm Now</span>
                         </a>
                      </div>
                    )}

                    {orderData?.amountConfirmed && !orderData?.first50Paid && (
                      <div className="space-y-4">
                         <p>Please pay the 50% deposit to start the production work.</p>
                         <div className="p-3 bg-white/50 rounded-xl border border-blue-100 flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500">Deposit Due (50%)</span>
                            <span className="text-xl font-black text-blue-900">
                               ₹{Math.round((orderData.price - 500) / 2).toLocaleString()}
                            </span>
                         </div>
                         <a 
                           href={generateWhatsAppLink(`Hello! Requesting QR for first 50% payment (₹${Math.round((orderData.price - 500) / 2)}) for order ${orderData.orderId}.`)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-blue-600/10 text-blue-700 px-4 py-3 rounded-xl border border-blue-200 text-xs font-bold flex items-center justify-between hover:bg-blue-600/20 transition-all cursor-pointer"
                         >
                            <span>Request QR for Deposit</span>
                            <span className="bg-white px-2 py-0.5 rounded text-[10px] shadow-sm">Pay Deposit</span>
                         </a>
                      </div>
                    )}

                    {orderData?.status === 'VIDEO_SENT' && !orderData?.second50Paid && (
                      <div className="space-y-4">
                         <p>Your masterpiece is ready! Please pay the remaining balance for safe dispatch.</p>
                         <div className="p-3 bg-white/50 rounded-xl border border-blue-100 flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500">Balance Due</span>
                            <span className="text-xl font-black text-blue-900">
                               ₹{Math.round((orderData.price - 500) / 2).toLocaleString()}
                            </span>
                         </div>
                         <a 
                           href={generateWhatsAppLink(`Hello! Ready to pay the final balance of ₹${Math.round((orderData.price - 500) / 2)} for order ${orderData.orderId}.`)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-indigo-600/10 text-indigo-700 px-4 py-3 rounded-xl border border-indigo-200 text-xs font-bold flex items-center justify-between hover:bg-indigo-600/20 transition-all cursor-pointer"
                         >
                            <span>Pay Balance for Dispatch</span>
                            <span className="bg-white px-2 py-0.5 rounded text-[10px] shadow-sm">Dispatch Now</span>
                         </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                      : "Today"}
                  </p>
              </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-8 border-b pb-4">Production Timeline</h2>
            <div className="relative">
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100" />
              <div className="flex flex-col gap-8">
                {stages.map((stage, idx) => {
                  const isDone = idx <= activeIdxInTrack;
                  const isCurrent = idx === activeIdxInTrack;
                  return (
                    <div key={stage.key} className="flex items-start gap-6 relative group">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 z-10 transition-all duration-300
                        ${isCurrent ? "bg-pink-600 text-white shadow-xl shadow-pink-200 rotate-12 scale-110" :
                          isDone ? "bg-green-500 text-white" : "bg-gray-50 text-gray-300 border border-gray-100"}`}>
                        {isDone && !isCurrent ? "✓" : stage.icon}
                      </div>

                      <div className={`flex-1 pt-1 ${!isCurrent && !isDone ? "opacity-30" : ""}`}>
                        <p className={`font-black text-sm uppercase tracking-tight ${isCurrent ? "text-pink-700" : isDone ? "text-green-700" : "text-gray-400"}`}>
                          {stage.label}
                          {isCurrent && (
                            <span className="ml-3 text-[9px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-md font-black animate-pulse uppercase">
                              Active
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
            <h3 className="text-lg font-black mb-2">Need Assistance?</h3>
            <p className="text-sm text-indigo-50 leading-relaxed mb-6">
              For specialized design requests, chat with us directly on WhatsApp.
            </p>
            <div className="flex items-center gap-4">
                <a href="tel:+919016707658" className="px-6 py-2 bg-white text-indigo-700 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform">
                  Call Support
                </a>
                <button onClick={() => navigate("/")} className="text-xs text-indigo-100 underline font-medium">
                  Return to Home
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderContent();
};

export default OrderTracking;
