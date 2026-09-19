// `motion` is used only as JSX tag names (<motion.h1>, <motion.div>, ...) — no-unused-vars
// can't see that without eslint-plugin-react.
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import TrustBadges from "./TrustBadges";

const Hero = () => (
  <section className="-mt-12 relative w-full h-[100dvh] min-h-[560px] flex flex-col justify-between overflow-hidden bg-gray-900 pt-12">

    {/* Background */}
    <img
      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
      srcSet="
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800 800w,
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200 1200w,
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600 1600w,
        https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2400 2400w
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
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-sm"
        >
          Unique Nameplates for{" "}
          <span className="text-[#E59500]">Your Dream Home</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed"
        >
          Handcrafted with passion, designed with precision. Elevate your
          entrance with our premium designer nameplates.
        </motion.p>

        {/* Primary & Secondary Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/products"
            className="px-7 py-3.5 bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] text-xs sm:text-sm md:text-base font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#E59500]/30 cursor-pointer inline-flex items-center gap-2"
          >
            Explore Collection
          </Link>
          <Link
            to="/custom-design"
            className="px-7 py-3.5 bg-[#0F172A] hover:bg-white text-white hover:text-[#0F172A] border border-[#0F172A] text-xs sm:text-sm md:text-base font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            Custom Design
          </Link>
        </motion.div>
      </div>
    </div>

    {/* All Features pinned at the bottom of the 100vh container */}
    <div className="relative z-20 w-full shrink-0">
      <TrustBadges />
    </div>
  </section>
);

export default Hero;
