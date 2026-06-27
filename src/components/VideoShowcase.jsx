import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const CLD = (name) =>
  `https://res.cloudinary.com/dowskut5u/video/upload/f_auto,q_auto:good,w_720/${name}`;

const VIDEOS = [
  { id: 1, title: "Premium Nameplate",  url: CLD("nameplate-1_bgmqhe") },
  { id: 2, title: "Wooden Collection",  url: CLD("nameplate-2_zzihkw") },
  { id: 3, title: "Acrylic Design",     url: CLD("nameplate-3_bajgll") },
  { id: 4, title: "Stainless Steel",    url: CLD("nameplate-4_qb69jf") },
  { id: 5, title: "Custom Design",      url: CLD("nameplate-5_yhlkrn") },
];

const VideoShowcase = () => (
  <section className="py-10 md:py-16 bg-yellow-50 overflow-hidden">
    <div className="container mx-auto px-4 mb-6 md:mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Nameplates in Action</h2>
      <p className="text-gray-500 text-sm md:text-base">Watch the craftsmanship — real videos before delivery.</p>
    </div>

    <div className="px-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={12}
        slidesPerView={1.4}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        breakpoints={{
          480:  { slidesPerView: 2.2, spaceBetween: 14 },
          768:  { slidesPerView: 3.2, spaceBetween: 16 },
          1024: { slidesPerView: 4.2, spaceBetween: 20 },
          1280: { slidesPerView: 5,   spaceBetween: 20 },
        }}
      >
        {[...VIDEOS, ...VIDEOS].map((v, i) => (
          <SwiperSlide key={`${v.id}-${i}`}>
            <div className="relative rounded-2xl overflow-hidden bg-gray-800 group">
              <div className="aspect-[9/16]">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                >
                  <source src={v.url} type="video/mp4" />
                </video>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                <p className="text-white text-sm font-semibold">{v.title}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default VideoShowcase;
