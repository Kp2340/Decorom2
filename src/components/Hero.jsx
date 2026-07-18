// `motion` is used only as JSX tag names (<motion.h1>, <motion.div>, ...) — no-unused-vars
// can't see that without eslint-plugin-react.
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CLD_THUMB = (id) =>
  `https://res.cloudinary.com/dowskut5u/video/upload/so_0,w_220,h_310,c_fill,f_jpg,q_auto/${id}.jpg`;

const PRODUCT_VISUALS = [
  { id: "nameplate-1_bgmqhe", label: "Premium" },
  { id: "nameplate-2_zzihkw", label: "Wooden" },
  { id: "nameplate-3_bajgll", label: "Acrylic" },
  { id: "nameplate-4_qb69jf", label: "Steel" },
  { id: "nameplate-5_yhlkrn", label: "Custom" },
];

const Hero = () => (
  <section className="relative w-full flex items-center justify-center overflow-hidden bg-gray-900"
    style={{ height: "calc(100vh - 64px)" }}>

    {/* Background */}
    <img
      src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600"
      alt="Modern Home Interior"
      className="absolute inset-0 w-full h-full object-cover opacity-40"
      fetchPriority="high"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/20" />

    {/* Content row */}
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8">

      {/* Left — text */}
      <div className="flex-1 text-center lg:text-left max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
        >
          Unique Nameplates for{" "}
          <span className="text-pink-400">Your Dream Home</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base md:text-lg text-gray-200 mb-8 max-w-lg mx-auto lg:mx-0"
        >
          Handcrafted with passion, designed with precision. Elevate your
          entrance with our premium designer nameplates.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
        >
          <Link
            to="/products"
            className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-pink-600/30"
          >
            Explore Collection
          </Link>
          <Link
            to="/custom-design"
            className="px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-full backdrop-blur-md transition-all border border-white/30"
          >
            Custom Design
          </Link>
        </motion.div>
      </div>

      {/* Right — product visuals (desktop only) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.3 }}
        className="hidden lg:flex gap-3 items-end shrink-0"
      >
        {PRODUCT_VISUALS.map((v, i) => (
          <div
            key={v.id}
            className="relative rounded-2xl overflow-hidden shadow-xl shrink-0 border border-white/10"
            style={{
              width: 100,
              height: i === 2 ? 280 : i % 2 === 0 ? 220 : 250,
            }}
          >
            <img
              src={CLD_THUMB(v.id)}
              alt={`${v.label} nameplate`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
              <p className="text-white text-xs font-semibold text-center">{v.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 z-10"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </motion.div>
  </section>
);

export default Hero;
