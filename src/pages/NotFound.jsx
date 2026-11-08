import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const NotFound = () => (
  <>
    <SEO
      title="Page Not Found"
      description="The page you're looking for doesn't exist. Head back to browse Decorom's designer nameplates collection."
      noindex={true}
    />
    <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-amber-200 leading-none select-none">404</p>
        <h1 className="text-2xl font-bold text-[#2C3E50] mt-2 mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or may have moved. Head back to browse our designer nameplate collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] font-semibold text-sm rounded-xl transition-all shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#E59500]"
          >
            Browse Products
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-[#0F172A] hover:bg-white text-white hover:text-[#0F172A] border border-[#0F172A] font-semibold text-sm rounded-xl transition-colors focus:outline-none"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default NotFound;
