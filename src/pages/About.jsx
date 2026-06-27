import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { CONTACT_ADDRESS } from "../constants/contact";

const AboutUs = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Decorom — 5 years of crafting premium custom nameplates in Ahmedabad. Handcrafted with acrylic, wood, steel, and laser-cut finishes. Your home's first impression, perfected."
        keywords="About Decorom, Custom Nameplates Ahmedabad, Nameplate Maker Gujarat, Handcrafted Nameplates"
      />
      <section className="bg-pink-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4">

          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold text-gray-800">About Us</h1>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
              Ahmedabad's trusted nameplate specialists — crafting bespoke pieces since 2019.
            </p>
          </div>

          {/* About Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div>
              <img
                src="https://res.cloudinary.com/dowskut5u/image/upload/Shubh_Bhavsar_ms9xcl.jpg"
                alt="Shubh Bhavsar — Founder, Decorom"
                className="w-full rounded-xl shadow-md object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Welcome to Decorom
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                Nestled in the heart of Ahmedabad, Decorom stands as a beacon of elegance and innovation in the home décor industry. With a remarkable five-year track record, we have redefined the art of custom nameplates — cementing our status as a trusted local favourite.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4 text-justify">
                We specialise in creating bespoke solutions that reflect your personal style and enhance the aesthetic appeal of your space. Whether you're looking to personalise your home with a custom nameplate or add a touch of sophistication with unique décor items, Decorom delivers unmatched quality and craftsmanship.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                Our skilled artisans combine modern technology with traditional techniques to create nameplates that are visually stunning, durable, and weather-resistant — crafted from premium acrylic, wood, steel, and laser-cut designs.
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-10">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                  🪧
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Custom Name Plates</h3>
                <p className="text-gray-600 text-sm">
                  Precision-crafted nameplates designed to reflect your personality and style. Each piece is durable, elegant, and made to last.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                  ✏️
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalised Name &amp; Number Plates</h3>
                <p className="text-gray-600 text-sm">
                  Endless customisation — modern acrylic designs, warm wooden textures, or premium metallic finishes. We work closely with you to match your vision.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                  🏡
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Home Décor Products</h3>
                <p className="text-gray-600 text-sm">
                  From decorative wall hangings to elegant centrepieces, our curated collection adds charm and sophistication to any living space.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-10">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                  🎨
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Bespoke Designs</h3>
                <p className="text-gray-600 text-sm">
                  Never templated, always personal. Every nameplate begins with a consultation to understand your style and home aesthetics.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                  ⭐
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm">
                  Acrylic, wood, steel, and laser-cut designs — all weather-resistant and built to maintain a pristine appearance for years.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
                <div className="w-14 h-14 mx-auto bg-yellow-200 flex items-center justify-center rounded-full mb-4 text-2xl">
                  ♻️
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Eco-Friendly &amp; Reliable</h3>
                <p className="text-gray-600 text-sm">
                  Sustainably sourced materials, eco-friendly production, and on-time delivery from our Ghatlodiya studio.
                </p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white shadow-md rounded-lg p-8 text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We aim to make art and personalised décor accessible to every home. By blending craftsmanship with modern design innovation, our goal is to inspire individuals to create spaces that reflect their unique personality. Sustainable materials, innovative finishes, and a customer-first approach have made Decorom the preferred choice for discerning homeowners across Ahmedabad and beyond.
            </p>
          </div>

          {/* Studio Address */}
          <div className="text-center text-gray-500 text-sm">
            <p className="font-medium text-gray-700 mb-1">Visit our studio</p>
            <p>{CONTACT_ADDRESS}</p>
            <Link to="/contact" className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition">
              Get Directions
            </Link>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutUs;
