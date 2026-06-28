import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import TrustBadges from "../components/TrustBadges";
import HorizontalRail from "../components/HorizontalRail";
import CategoryBrowse from "../components/CategoryBrowse";
import VideoShowcase from "../components/VideoShowcase";
import FAQ from "../components/FAQ";
import CustomerReviews from "../components/CustomerReviews";
import InstagramGrid from "../components/InstagramGrid";
import SEO from "../components/SEO";

const LOCAL_BUSINESS_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Decorom",
  image: "https://decorom.in/logo/logo.png",
  telephone: "+91-9016707658",
  email: "decorom213@gmail.com",
  url: "https://decorom.in",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Shop A/7, Second Floor, Shreekunj Shopping Centre, Near HDFC Bank, K.K. Nagar, Ghatlodiya",
    addressLocality: "Ahmedabad",
    postalCode: "380061",
    addressCountry: "IN",
  },
  openingHours: "Mo-Sa 09:00-19:00",
  priceRange: "₹₹",
  servesCuisine: undefined,
  hasMap:
    "https://www.google.com/maps/place/Decorom/@23.067602,72.5427599,17z",
});

const Home = () => (
  <div className="flex flex-col min-h-screen">
    <SEO
      title="Premium Designer Nameplates in Ahmedabad"
      description="Discover the best designer nameplates in Ahmedabad, Gujarat. Handcrafted custom nameplates for your home and office. Shop our collection now."
      keywords="Designer Nameplates Ahmedabad, Custom Nameplates Gujarat, Home Entrance Decor, LED Nameplates Ahmedabad"
    />

    {/* LocalBusiness structured data for Google */}
    <Helmet>
      <script type="application/ld+json">{LOCAL_BUSINESS_JSON_LD}</script>
    </Helmet>

    {/* 1. Hero */}
    <Hero />

    {/* 2. Trust badges strip */}
    <TrustBadges />

    {/* 3. Best Selling Nameplates */}
    <HorizontalRail />

    {/* 3b. View All Best Sellers CTA */}
    <div className="bg-white pb-6 flex justify-center">
      <Link
        to="/best-sellers"
        className="inline-flex items-center gap-2 text-sm font-black text-pink-600 hover:text-pink-700 border border-pink-200 hover:border-pink-400 px-6 py-3 rounded-2xl transition-all hover:shadow-md"
      >
        View All Best Sellers →
      </Link>
    </div>

    {/* 4. Browse by Category */}
    <CategoryBrowse />

    {/* 5. Video showcase */}
    <VideoShowcase />

    {/* 6. FAQ */}
    <FAQ />

    {/* 7. Google Reviews */}
    <CustomerReviews />

    {/* 8. Instagram grid */}
    <InstagramGrid />
  </div>
);

export default Home;
