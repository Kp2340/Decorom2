import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";

const COOKIE_KEY = "decorom_cookie_consent";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type) => {
    localStorage.setItem(
      COOKIE_KEY,
      JSON.stringify({
        essential: true,
        analytics: type === "all",
        timestamp: new Date().toISOString(),
      })
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-3 left-3 right-3 md:left-auto md:right-4 md:bottom-4 md:max-w-sm z-50 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-3.5 md:p-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 bg-[#FFFDD0] text-[#E59500] rounded-lg shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs text-[#334155]">
          <p className="font-semibold text-[#2C3E50] mb-0.5 text-xs">We value your privacy</p>
          <p className="leading-relaxed text-xs">
            We use cookies to improve experience and analyze traffic. Read our{" "}
            <Link to="/privacy" className="text-[#E59500] underline font-medium hover:text-[#CC8400]">
              Privacy Policy
            </Link>.
          </p>
        </div>
        <button
          onClick={() => handleAccept("essential")}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E59500]"
          aria-label="Close cookie banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
        <button
          onClick={() => handleAccept("all")}
          className="flex-1 px-3 py-1.5 bg-[#E59500] hover:bg-[#CC8400] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          Accept All
        </button>
        <button
          onClick={() => handleAccept("essential")}
          className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
