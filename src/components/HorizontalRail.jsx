import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const HorizontalRail = () => {
  // Hardcoded best-selling nameplates as requested
  const bestSellers = [
    {
      id: "best-1",
      name: "Modern Acrylic Gold",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
      price: "Starting at ₹1,800",
      link: "/products/1"
    },
    {
      id: "best-2",
      name: "Vintage Wood Texture",
      image: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=600",
      price: "Starting at ₹1,800",
      link: "/products/2"
    },
    {
      id: "best-3",
      name: "Premium Stone Finish",
      image: "https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&q=80&w=600",
      price: "Starting at ₹2,200",
      link: "/products/3"
    },
    {
      id: "best-4",
      name: "Backlit LED Nameplate",
      image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=600",
      price: "Starting at ₹3,500",
      link: "/products/4"
    },
    {
      id: "best-5",
      name: "Minimalist Metal Plate",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600",
      price: "Starting at ₹4,000",
      link: "/products/5"
    }


  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Best Nameplates</h2>
        <p className="text-gray-500">Handpicked designs for your perfect home.</p>
      </div>

      <div className="px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1.2}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4.2 },
          }}
          className="pb-12"
        >
          {bestSellers.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="group relative bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-pink-400 font-semibold mb-3">{item.price}</p>
                  <Link
                    to={item.link}
                    className="inline-block bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    Buy Now
                  </Link>
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
