import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TrustBadges from "./TrustBadges";

const Hero = () => (
  <section className="-mt-12 relative w-full h-[100dvh] min-h-[560px] flex flex-col justify-between overflow-hidden bg-gray-900 pt-12">

    {/* Background — Optimized quality & responsive srcSet to accelerate LCP */}
    <img
      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=70&w=800"
      srcSet="
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=70&w=640 640w,
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=70&w=800 800w,
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=75&w=1200 1200w,
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=75&w=1600 1600w
      "
      sizes="100vw"
      alt="Modern Home Interior"
      className="absolute inset-0 w-full h-full object-cover opacity-40"
      fetchPriority="high"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-gray-900/40" />

    {/* Centered Content row (vertically centered in remaining space) */}
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center text-center my-auto py-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Rendered directly without opacity:0 initial delay for instant 0ms LCP paint */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-sm">
          Unique Nameplates for{" "}
          <span className="text-[#E59500]">Your Dream Home</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
          Handcrafted with passion, designed with precision. Elevate your
          entrance with our premium designer nameplates.
        </p>

        {/* Primary & Secondary Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/products"
            className="px-7 py-3.5 bg-white hover:bg-[#E59500] text-[#B45309] hover:text-white border border-[#B45309] text-xs sm:text-sm md:text-base font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#E59500]/30 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            to="/custom-design"
            className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs sm:text-sm md:text-base font-semibold rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:border-white/50 cursor-pointer"
          >
            Customize Yours
          </Link>
        </motion.div>
      </div>
    </div>

    {/* Trust Badges - bottom pinned */}
    <div className="relative z-10 w-full pb-6 sm:pb-8">
      <TrustBadges />
    </div>
  </section>
);

export default Hero;
