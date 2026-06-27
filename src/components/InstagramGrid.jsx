// Static Instagram-style grid using Cloudinary video thumbnails as product showcase images.
// Each thumbnail is generated from the product showcase videos at frame 0.
const CLD_THUMB = (id) =>
  `https://res.cloudinary.com/dowskut5u/video/upload/so_0,w_400,h_400,c_fill,f_jpg,q_auto/${id}.jpg`;

const INSTAGRAM_URL = "https://instagram.com/decorom.in";

const posts = [
  { id: "nameplate-1_bgmqhe", label: "Premium Nameplate" },
  { id: "nameplate-2_zzihkw", label: "Wooden Collection" },
  { id: "nameplate-3_bajgll", label: "Acrylic Design" },
  { id: "nameplate-4_qb69jf", label: "Stainless Steel" },
  { id: "nameplate-5_yhlkrn", label: "Custom Design" },
  { id: "nameplate-1_bgmqhe", label: "Handcrafted Finish" },
];

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const InstagramGrid = () => (
  <section className="py-14 bg-gray-50">
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">As Seen on Instagram</h2>
          <p className="text-gray-500 mt-1 text-sm">Follow us for daily inspiration and new designs.</p>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-sm whitespace-nowrap"
        >
          <InstagramIcon />
          @decorom.in
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {posts.map((post, i) => (
          <a
            key={i}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden rounded-xl bg-gray-200 aspect-square block"
            aria-label={`View ${post.label} on Instagram`}
          >
            <img
              src={CLD_THUMB(post.id)}
              alt={post.label}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <InstagramIcon />
              <span className="sr-only">View on Instagram</span>
            </div>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-8">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          <InstagramIcon />
          See More on Instagram
        </a>
      </div>
    </div>
  </section>
);

export default InstagramGrid;
