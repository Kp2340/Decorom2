import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-pink-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title & Breadcrumb */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-800">About Us</h1>
        </div>

        {/* About Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          {/* Image */}
          <div>
            <img
              // src="/about-placeholder.jpg"
              src="public/logo/logo.png"
              alt="About Decorom"
              className="w-full rounded-lg shadow-md"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to Decorom Gallery
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Decorom Gallery, we believe every space tells a story. Our
              mission is to bring art, elegance, and creativity into homes and
              offices with our unique collection of décor products. From wall
              art to sculptures, we carefully curate pieces that transform your
              interiors into something truly special.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Since our inception, we’ve worked to create products that combine
              quality craftsmanship with timeless design. Whether you're
              decorating your first home or enhancing your office, we are here
              to inspire and support your journey.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-10">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                🎨
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Unique Designs
              </h3>
              <p className="text-gray-600 text-sm">
                Carefully crafted pieces that bring charm and character to your
                spaces.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                ⭐
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600 text-sm">
                Premium quality products that are built to last with timeless
                appeal.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                🚚
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Reliable Service
              </h3>
              <p className="text-gray-600 text-sm">
                Fast and secure delivery with customer support that you can
                trust.
              </p>
            </div>
          </div>
        </div>

        {/* Vision / Mission Highlight */}
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We aim to make art and décor accessible for everyone. By blending
            creativity with craftsmanship, our goal is to inspire individuals to
            create spaces that reflect their personality and lifestyle.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
