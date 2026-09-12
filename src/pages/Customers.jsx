import React from "react";
import VideoShowcase from "../components/VideoShowcase";
import CustomerReviews from "../components/CustomerReviews";
import SEO from "../components/SEO";
import { CONTACT_WHATSAPP_URL } from "../constants/contact";

const Customers = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Happy Customers & Success Stories" 
        description="See what our customers have to say about Decorom. Real videos, reviews, and ratings from our clients across India."
      />

      <div className="relative h-[40vh] bg-gray-900 flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src="https://res.cloudinary.com/demo/video/upload/o_40/v1679000000/sea.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Happy Customers</h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Witness the joy of premium handcrafted nameplates through our customers' eyes.
          </p>
        </div>
      </div>

      <section className="py-16 md:py-20 bg-cyan-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">Video Testimonials</h2>
          <p className="text-gray-600">Real videos shared by our clients after their nameplate installation.</p>
        </div>
        <VideoShowcase />
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">Reviews & Ratings</h2>
          <p className="text-gray-600">Trusted by over 5,000+ homeowners across Gujarat and India.</p>
        </div>
        <CustomerReviews />
      </section>

      <section className="py-16 md:py-20 bg-cyan-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-6">Share Your Decorom Moment</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Already have a Decorom nameplate? Share a video or photo with us on WhatsApp and get featured on this page!
          </p>
          <a 
            href={CONTACT_WHATSAPP_URL("I want to share my Decorom experience!")}
            className="inline-flex items-center gap-2 bg-white text-[#E59500] border border-[#E59500] hover:bg-[#E59500] hover:text-white px-8 py-4 rounded-xl font-bold text-base shadow-sm transition-all duration-300"
          >
            Submit Review on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Customers;
