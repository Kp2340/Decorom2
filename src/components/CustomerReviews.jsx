import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { GOOGLE_MAPS_REVIEWS_URL } from "../constants/contact";

const GOOGLE_LOGO = (
  <svg viewBox="0 0 24 24" className="w-16 h-6 inline-block ml-1" aria-label="Google">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const StarRating = ({ rating, size = "w-4 h-4" }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} className={`${size} ${star <= rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const ALL_REVIEWS = [
  {
    id: 1,
    name: "Shah Jainam",
    rating: 5,
    text: "I recently ordered a customized black acrylic name plate from DECOROM, featuring a super-fine golden finished aesthetic round frame with a beautifully crafted Jain symbol. The final outcome was absolutely stunning. Highly recommend!",
  },
  {
    id: 2,
    name: "Devarsh Patel",
    rating: 5,
    text: "Great experience with Decorom! Professional service, clear communication, exceptional product quality, and timely delivery. Their attention to detail, commitment to excellence, and seamless coordination truly set them apart. Highly recommended for reliable, premium work.",
  },
  {
    id: 3,
    name: "Bhavin Bhavsar",
    rating: 5,
    text: "I had a great experience with Decorom! Their service was smooth and professional from start to finish. The team was very supportive, communicated clearly, and ensured everything was done perfectly. Beautifully finished and exactly as promised.",
  },
  {
    id: 4,
    name: "Macwan Alex",
    rating: 5,
    text: "Work so good and outstanding. I am so thrilled with my new black acrylic nameplate with the gold mirror finish. The contrast is sharp and elegant, and it genuinely looks fantastic on my door.",
  },
  {
    id: 5,
    name: "Vikram Shah",
    rating: 5,
    text: "We shifted to our new home and wanted a nameplate. Decorom delivered exactly what we needed — premium quality, great finish, and on time. Everyone who visits notices it immediately!",
  },
  {
    id: 6,
    name: "Hemant Meshram",
    rating: 5,
    text: "Was a nice experience to see a person having creative ideas to match and fit your requirement and equally good workmanship.",
  },
  {
    id: 7,
    name: "bariya Varun",
    rating: 5,
    text: "Had a great experience with Decorom. Their service was smooth from start to finish. The team was very supportive and ensured everything was done perfectly. Product quality was beautifully finished and exactly as promised.",
  },
];

// Sort best (highest rating) first, then alphabetically within same rating
const REVIEWS = [...ALL_REVIEWS].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));

// These reflect the actual Google listing — update when your review count changes
const GOOGLE_RATING = 5;
const GOOGLE_REVIEW_COUNT = 27;

const AVATAR_COLORS = [
  "bg-pink-500", "bg-blue-500", "bg-emerald-500",
  "bg-amber-500", "bg-violet-500", "bg-rose-500", "bg-cyan-500",
];

const ReviewCard = ({ review, colorClass, onReadMore }) => {
  const PREVIEW_LENGTH = 140;
  const isLong = review.text.length > PREVIEW_LENGTH;
  const preview = isLong ? review.text.slice(0, PREVIEW_LENGTH) + "…" : review.text;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow h-[260px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-tight">{review.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <GoogleIcon />
            <span className="text-xs text-gray-500">Google</span>
          </div>
        </div>
      </div>

      {/* Stars */}
      <StarRating rating={review.rating} />

      {/* Text */}
      <p className="text-gray-600 text-sm mt-3 flex-1 leading-relaxed">{preview}</p>

      {isLong && (
        <a
          href={GOOGLE_MAPS_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm mt-2 hover:underline"
        >
          Read more
        </a>
      )}
    </div>
  );
};

const CustomerReviews = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center flex-wrap gap-2">
              Reviews on {GOOGLE_LOGO}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold text-gray-900">{GOOGLE_RATING}.0</span>
              <StarRating rating={GOOGLE_RATING} size="w-5 h-5" />
              <span className="text-gray-500 text-sm">· {GOOGLE_REVIEW_COUNT} reviews</span>
            </div>
          </div>
          <a
            href={GOOGLE_MAPS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto px-5 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
          >
            View on Google
          </a>
        </div>

        {/* Carousel — 1 on mobile, up to 5 on desktop, slow autoplay */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          breakpoints={{
            640:  { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <SwiperSlide key={`${review.id}-${i}`}>
              <ReviewCard
                review={review}
                colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <a
            href={GOOGLE_MAPS_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <GoogleIcon />
            See all reviews on Google Maps
          </a>
        </div>
      </div>
    </section>
  );

export default CustomerReviews;
