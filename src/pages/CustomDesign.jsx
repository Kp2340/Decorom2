import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

const CustomDesign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.post("/api/orders/custom-inquiry", formData);
      if (response && response.orderId) {
        navigate(`/track/${response.orderId}`);
      } else {
        throw new Error("Failed to generate Order ID. Please contact support.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setSubmitting(false); // Only reset on error; navigation handles success reset
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-pink-50 skew-x-12 translate-x-1/2 -z-10" />

      <div className="container mx-auto px-4 py-20 relative">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Content Side */}
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-xs font-black tracking-widest uppercase mb-4">
              ✨ Bespoke Service
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
              Dream it.<br/>We'll <span className="text-pink-600">Build it.</span>
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
              Can't find a design that fits your home? Share your vision with our master artisans. 
              From material selection to custom typography, we'll create a masterpiece just for you.
            </p>
            
            <div className="flex flex-wrap gap-8 py-8 border-t border-gray-100">
                <div>
                    <h4 className="font-black text-gray-900 text-2xl">48h</h4>
                    <p className="text-sm text-gray-400">Design Draft</p>
                </div>
                <div className="w-px h-12 bg-gray-100"/>
                <div>
                    <h4 className="font-black text-gray-900 text-2xl">100%</h4>
                    <p className="text-sm text-gray-400">Handcrafted</p>
                </div>
                <div className="w-px h-12 bg-gray-100"/>
                <div>
                    <h4 className="font-black text-gray-900 text-2xl">Life</h4>
                    <p className="text-sm text-gray-400">Time Support</p>
                </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-1/2 w-full max-w-xl">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-pink-100/50 p-10 border border-gray-50 relative">
              
              <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 bg-pink-600 text-white rounded-lg flex items-center justify-center text-sm">✦</span>
                Start Your Design
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Full Name</label>
                    <input
                      id="fullName"
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-bold text-gray-700"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Mobile Number</label>
                    <input
                      id="phone"
                      required
                      type="tel"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-bold text-gray-700"
                      placeholder="+91 00000 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Email (Optional)</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-bold text-gray-700"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-[10px] uppercase font-black text-gray-400 tracking-wider">City</label>
                    <input
                      id="city"
                      required
                      type="text"
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-bold text-gray-700"
                      placeholder="Your City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Share Your Idea</label>
                  <textarea
                    id="description"
                    required
                    rows="4"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 transition-all font-bold text-gray-700 resize-none"
                    placeholder="Tell us what you have in mind... (Material, Color, Script, etc.)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {submitting ? "SUBMITTING..." : "INITIATE CUSTOM DESIGN"}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest leading-loose">
                  * By submitting, you agree to have our designer contact you for a free consultation.
                </p>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesign;
