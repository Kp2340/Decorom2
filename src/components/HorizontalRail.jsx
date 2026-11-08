import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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

  const { data: products = [] } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      try {
        const res = await getFeaturedProducts();
        const data = res?.data ?? res;
        return Array.isArray(data) ? data : data?.content ?? [];
      } catch {
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
  });

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

    // 2. Append any extra live featured products returned by the API that weren't in config
    const configSet = new Set(BEST_SELLER_IDS);
    const extras = products
      .filter((p) => !configSet.has(p.id))
      .map((p) => ({
        id: p.id,
        name: p.name,
        image: p.thumbnailUrl,
        price: priceFor(p) || p.basePrice,
      }));

    return [...bestSellers, ...extras];
  }, [products]);

  const slides = [...items, ...items];

  const handleCardClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <section className="py-12 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Trending Designs
        </h2>
        <p className="text-gray-500 text-sm mt-1">Handpicked favourites from our master collection</p>
      </div>

      <div className="w-full">
        <Swiper
          modules={[Autoplay]}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={true}
          slidesPerView="auto"
          spaceBetween={16}
          className="horizontal-rail-swiper"
        >
          {slides.map((item, index) => (
            <SwiperSlide key={`${item.id}-${index}`} style={{ width: '220px' }}>
              <div
                onClick={() => handleCardClick(item.id)}
                className="group cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[280px]"
              >
                <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 flex flex-col justify-between flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {item.price}
                  </p>
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
