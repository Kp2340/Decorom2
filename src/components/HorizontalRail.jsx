import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts } from '../api/products.api';
import { BEST_SELLER_IDS } from '../config/bestSellers';
import { calculateFinalPrice } from '../utils/pricingUtils';
import { getDisplayPrice, isFixedPrice, parseDefaultSize } from '../utils/productUtils';

/**
 * Homepage best-seller rail.
 *
 * Previously this held a hardcoded copy of the eight product IDs alongside literal price strings
 * ("₹3,240", "₹11,520") and made no API call — so it was a fourth source of truth for prices and
 * the first one a visitor saw. It now reads the same /api/products/featured data as
 * /best-sellers, and honours fixed-price products, so all surfaces agree.
 *
 * FALLBACK contains images only, to keep the rail visually populated if the request fails.
 */
const FALLBACK = [
  { id: "72cb2a6c-0fd7-44e8-8cfe-87477931aad1", name: "Premium House Shape Wooden Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771698397/decorom/products/qmp4bdzdqyzckxukcdem.png" },
  { id: "55c98480-8334-485b-8f99-3d51fb5b45de", name: "Premium Floral Round Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771701050/decorom/products/orqh9c8rzllcnpguijtd.png" },
  { id: "b622c8e3-845b-4ceb-a1d5-2884aa5423f6", name: "Premium Arch Acrylic Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771700200/decorom/products/vcinivkdfksqpvadghgt.png" },
  { id: "dc1e94b8-c41e-45e6-91c5-8504f2bd2248", name: "Premium White Gold Rectangular Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771702880/decorom/products/brhqvafv6t6lp1zbxa4g.png" },
  { id: "9f4dae97-283d-492c-a2cf-6d98370c4ed0", name: "Premium Wooden Hanging Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771702984/decorom/products/nfnkcwbv4qtnfrhogi8f.png" },
  { id: "b5e09509-df97-40a7-94fd-9ece93c2f4f0", name: "Premium Gujarati Acrylic Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771702489/decorom/products/g1dqnh0t9mafebyqgh2v.png" },
  { id: "ef724b07-130c-452e-b648-3b9a43e504ec", name: "Premium Stainless Steel Office Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771702737/decorom/products/yigxjh2ez1m2eouosluc.png" },
  { id: "8d50019e-7329-451d-a498-eb78a9353a3d", name: "Premium Tree Design Oval Name Plate", image: "https://res.cloudinary.com/dowskut5u/image/upload/f_auto,q_auto,w_600/v1771703183/decorom/products/urhmhxkxtd8wmrpen3hm.png" },
];

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
        // Keep the image-only fallback.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Ordered by the shared BEST_SELLER_IDS config, same as /best-sellers.
  const items = useMemo(() => {
    if (products.length === 0) {
      return FALLBACK.map((f) => ({ ...f, price: null }));
    }

    const ordered = [
      ...BEST_SELLER_IDS.map((id) => products.find((p) => p.id === id)).filter(Boolean),
      ...products.filter((p) => !BEST_SELLER_IDS.includes(p.id)),
    ];

    return ordered.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.thumbnailUrl || FALLBACK.find((f) => f.id === p.id)?.image,
      price: priceFor(p),
    }));
  }, [products]);

  if (items.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Our Best Selling Nameplates</h2>
        <p className="text-gray-500 text-sm md:text-base">Handpicked by our customers — swipe to explore.</p>
      </div>
      <div className="px-4">
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
              <div className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate(`/products/${item.id}`)}>
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                  <h3 className="font-bold text-sm leading-snug line-clamp-2">{item.name}</h3>
                  {item.price > 0 && (
                    <p className="text-pink-400 font-semibold text-sm mt-1">₹{item.price.toLocaleString()}</p>
                  )}
                  <span className="inline-block mt-2 bg-white text-black px-3 py-1 rounded-lg text-xs font-bold group-hover:bg-pink-500 group-hover:text-white transition-colors">View Details →</span>
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
