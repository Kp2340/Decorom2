import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../api/products.api';
import { BEST_SELLER_IDS, BEST_SELLER_FALLBACKS } from '../config/bestSellers';
import { calculateFinalPrice } from '../utils/pricingUtils';
import { getDisplayPrice, isFixedPrice, parseDefaultSize } from '../utils/productUtils';

const priceFor = (product) => {
  if (isFixedPrice(product)) return getDisplayPrice(product);
  const { width, height } = parseDefaultSize(product.defaultSize || product.size);
  return getDisplayPrice(product, calculateFinalPrice(product.material, width, height));
};

const HorizontalRail = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await getFeaturedProducts();
        const data = res?.data ?? res;
        const list = Array.isArray(data) ? data : data?.content ?? [];
        if (!cancelled) setProducts(list);
      } catch {
        // Fallback handles gracefully
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Ordered by the shared BEST_SELLER_IDS config, guaranteed to never 404 or show broken images
  const items = useMemo(() => {
    // 1. Build list for BEST_SELLER_IDS, prioritizing live API with BEST_SELLER_FALLBACKS as infallible guarantee
    const bestSellers = BEST_SELLER_IDS.map((id) => {
      const live = products.find((p) => p.id === id);
      const fb = BEST_SELLER_FALLBACKS.find((f) => f.id === id);
      if (live) {
        return {
          id: live.id,
          name: live.name,
          image: live.thumbnailUrl || fb?.thumbnailUrl,
          price: priceFor(live) || live.basePrice || fb?.basePrice,
        };
      }
      if (fb) {
        return {
          id: fb.id,
          name: fb.name,
          image: fb.thumbnailUrl,
          price: fb.basePrice,
        };
      }
      return null;
    }).filter(Boolean);

    // 2. Append any extra featured products from API
    const extras = products
      .filter((p) => !BEST_SELLER_IDS.includes(p.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        image: p.thumbnailUrl,
        price: priceFor(p) || p.basePrice,
      }));

    return [...bestSellers, ...extras];
  }, [products]);

  if (items.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-white overflow-hidden relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-slate-200 before:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-1">Our Best Selling Nameplates</h2>
        <p className="text-[#334155] text-sm md:text-base">Handpicked by our customers — swipe to explore.</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1.3}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          breakpoints={{ 480: { slidesPerView: 2.2 }, 768: { slidesPerView: 3.2 }, 1024: { slidesPerView: 4.2 } }}
        >
          {/* Duplicate for seamless loop */}
          {[...items, ...items].map((item, i) => (
            <SwiperSlide key={`${item.id}-${i}`}>
              <div className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer product-card-lift" onClick={() => navigate(`/products/${item.id}`)}>
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = BEST_SELLER_FALLBACKS[0].thumbnailUrl;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 text-white">
                  <h3 className="font-bold text-sm leading-snug line-clamp-2">{item.name}</h3>
                  {item.price > 0 && (
                    <p className="text-[#E59500] font-bold text-base mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                  )}
                  <span className="inline-block mt-2 bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs">
                    Order Now →
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HorizontalRail;
