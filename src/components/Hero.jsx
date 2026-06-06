import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => (
  <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
    {/* Single lifestyle background — product images live in section 3, not here */}
    <img
      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
      alt="Modern Home Interior"
      className="absolute inset-0 w-full h-full object-cover opacity-50"
      fetchPriority="high"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/60" />

    {/* Content */}
    <div className="relative z-10 text-center px-4 max-w-4xl">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
      >
        Unique Nameplates for <br />
        <span className="text-pink-400">Your Dream Home</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
      >
        Handcrafted with passion, designed with precision. Elevate your entrance with our premium designer nameplates.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link to="/products" className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-pink-600/30">
          Explore Collection
        </Link>
        <Link to="/custom-design" className="px-8 py-4 bg-white/15 hover:bg-white/25 text-white font-bold rounded-full backdrop-blur-md transition-all border border-white/30">
          Custom Design
        </Link>
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 z-10"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </motion.div>
  </section>
);

export default Hero;
