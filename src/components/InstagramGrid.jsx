import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const INSTAGRAM_URL = "https://instagram.com/decorom.in";

// Client's latest Instagram reels — displayed via official embed
const REELS = [
  { id: "DYHrxwAJ_KJ", label: "Latest Design" },
  { id: "DWv3tVziYsQ", label: "Nameplate Reveal" },
  { id: "DWJDu5ADbWD", label: "Craftsmanship" },
  { id: "DZuKMr3JoN7", label: "Premium Finish" },
  { id: "DX2zqs6JCbW", label: "Custom Order" },
  { id: "DX2qTC8zoHP", label: "New Collection" },
];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const InstagramGrid = () => (
  <section className="py-10 md:py-14 bg-gray-50 overflow-hidden">
    <div className="container mx-auto px-4 mb-6 md:mb-10 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Latest from Instagram</h2>
        <p className="text-gray-500 text-sm md:text-base">Follow us for new designs every week.</p>
      </div>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md whitespace-nowrap"
      >
        <InstagramIcon />
        @decorom.in
      </a>
    </div>

    {/* Reel embeds in a Swiper carousel */}
    <div className="px-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={12}
        slidesPerView={1.4}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={false}
        breakpoints={{
          480:  { slidesPerView: 2.2, spaceBetween: 14 },
          768:  { slidesPerView: 3.2, spaceBetween: 16 },
          1024: { slidesPerView: 4,   spaceBetween: 20 },
          1280: { slidesPerView: 5,   spaceBetween: 20 },
        }}
      >
        {REELS.map((reel) => (
          <SwiperSlide key={reel.id}>
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 shadow-md"
                 style={{ aspectRatio: "9/16" }}>
              <iframe
                src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                allowFullScreen
                scrolling="no"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={`Decorom Reel — ${reel.label}`}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    <div className="text-center mt-8">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
      >
        <InstagramIcon />
        See all reels on Instagram
      </a>
    </div>
  </section>
);

export default InstagramGrid;
