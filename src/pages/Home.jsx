import React from "react";
import Hero from "../components/Hero";
import HorizontalRail from "../components/HorizontalRail";
import CategoryBrowse from "../components/CategoryBrowse";
import VideoShowcase from "../components/VideoShowcase";
import CustomerReviews from "../components/CustomerReviews";
import SEO from "../components/SEO";

const Home = () => (
  <div className="flex flex-col min-h-screen">
    <SEO
      title="Premium Designer Nameplates in Ahmedabad"
      description="Discover the best designer nameplates in Ahmedabad, Gujarat. Handcrafted custom nameplates for your home and office. Shop our collection now."
      keywords="Designer Nameplates Ahmedabad, Custom Nameplates Gujarat, Home Entrance Decor, LED Nameplates Ahmedabad"
    />

    {/* 1. Hero / Main Carousel */}
    <Hero />

    {/* 2. Best Selling Nameplates — auto-scrolling Swiper with real products */}
    <HorizontalRail />

    {/* 3. Browse by Category */}
    <CategoryBrowse />

    {/* 4. Video showcase */}
    <VideoShowcase />

    {/* 5. Google Reviews */}
    <CustomerReviews />
  </div>
);

export default Home;
