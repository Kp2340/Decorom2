import { motion } from "framer-motion";

// Cloudinary base — auto format (WebM for Chrome, MP4 for Safari) + auto quality + 720p max
const CLD = (name) =>
  `https://res.cloudinary.com/dowskut5u/video/upload/f_auto,q_auto:good,w_720/${name}`;

const VideoShowcase = () => {
  const videos = [
    {
      id: 1,
      title: "Premium Nameplate",
      url: CLD("nameplate-1_bgmqhe"),
      span: "md:col-span-2 md:row-span-2",
    },
    {
      id: 2,
      title: "Wooden Collection",
      url: CLD("nameplate-2_zzihkw"),
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: 3,
      title: "Acrylic Design",
      url: CLD("nameplate-3_bajgll"),
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: 4,
      title: "Stainless Steel",
      url: CLD("nameplate-4_qb69jf"),
      span: "md:col-span-1 md:row-span-1",
    },
    {
      id: 5,
      title: "Custom Design",
      url: CLD("nameplate-5_yhlkrn"),
      span: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Nameplates in Action</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">Watch the craftsmanship — real videos of our nameplates before delivery.</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl overflow-hidden shadow-lg group ${video.span}`}
            >
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
              <div className="absolute inset-0 bg-black/40 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-bold text-lg">{video.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
