import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import HorizontalRail from "../components/HorizontalRail";
import CategoryBrowse from "../components/CategoryBrowse";
import VideoShowcase from "../components/VideoShowcase";
import CustomerReviews from "../components/CustomerReviews";
import SEO from "../components/SEO";

// Curated best-sellers — hardcoded for reliability and zero extra API calls
const BEST_SELLERS = [
  {
    id: "72cb2a6c-0fd7-44e8-8cfe-87477931aad1",
    name: "Premium House Shape Wooden Name Plate",
    material: "Wooden",
    shape: "Unique",
    defaultSize: "18*12",
    basePrice: 3240,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771698397/decorom/products/qmp4bdzdqyzckxukcdem.png", sortOrder: 0 }],
  },
  {
    id: "55c98480-8334-485b-8f99-3d51fb5b45de",
    name: "Premium Floral Round Name Plate",
    material: "Acrylic with Wooden",
    shape: "Circle",
    defaultSize: "18*18",
    basePrice: 4860,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771701050/decorom/products/orqh9c8rzllcnpguijtd.png", sortOrder: 0 }],
  },
  {
    id: "b622c8e3-845b-4ceb-a1d5-2884aa5423f6",
    name: "Premium Arch Acrylic Name Plate",
    material: "Acrylic",
    shape: "Unique",
    defaultSize: "48*24",
    basePrice: 11520,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771700200/decorom/products/vcinivkdfksqpvadghgt.png", sortOrder: 0 }],
  },
  {
    id: "dc1e94b8-c41e-45e6-91c5-8504f2bd2248",
    name: "Premium White Gold Rectangular Name Plate",
    material: "Acrylic",
    shape: "Rectangle",
    defaultSize: "12*18",
    basePrice: 2160,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771702880/decorom/products/brhqvafv6t6lp1zbxa4g.png", sortOrder: 0 }],
  },
  {
    id: "9f4dae97-283d-492c-a2cf-6d98370c4ed0",
    name: "Premium Wooden Hanging Name Plate",
    material: "ACP",
    shape: "Unique",
    defaultSize: "24*12",
    basePrice: 5760,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771702984/decorom/products/nfnkcwbv4qtnfrhogi8f.png", sortOrder: 0 }],
  },
  {
    id: "b5e09509-df97-40a7-94fd-9ece93c2f4f0",
    name: "Premium Gujarati Acrylic Name Plate",
    material: "Mild Steel with Stainless Steel",
    shape: "Unique",
    defaultSize: "12*24",
    basePrice: 5759,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771702489/decorom/products/g1dqnh0t9mafebyqgh2v.png", sortOrder: 0 }],
  },
  {
    id: "ef724b07-130c-452e-b648-3b9a43e504ec",
    name: "Premium Stainless Steel Office Name Plate",
    material: "Stainless Steel with Vinyl",
    shape: "Rectangle",
    defaultSize: "24*18",
    basePrice: 8638,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771702737/decorom/products/yigxjh2ez1m2eouosluc.png", sortOrder: 0 }],
  },
  {
    id: "8d50019e-7329-451d-a498-eb78a9353a3d",
    name: "Premium Tree Design Oval Name Plate",
    material: "Acrylic",
    shape: "Capsule",
    defaultSize: "18*12",
    basePrice: 3240,
    images: [{ imageUrl: "https://res.cloudinary.com/dowskut5u/image/upload/v1771703183/decorom/products/urhmhxkxtd8wmrpen3hm.png", sortOrder: 0 }],
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Premium Designer Nameplates in Ahmedabad"
        description="Discover the best designer nameplates in Ahmedabad, Gujarat. Handcrafted custom nameplates for your home and office. Shop our collection now."
        keywords="Designer Nameplates Ahmedabad, Custom Nameplates Gujarat, Home Entrance Decor, LED Nameplates Ahmedabad"
      />

      <Hero />

      <HorizontalRail />

      <CategoryBrowse />

      {/* Best Selling Products */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
            Our Best Selling Designs
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            Handpicked by our customers — the most loved nameplates from our collection.
          </p>
        </div>

        {/* Mobile: 2 visible + horizontal scroll | Desktop: 4-col grid */}
        <div className="grid auto-cols-[44vw] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid-flow-row sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0">
          {BEST_SELLERS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </div>
      </section>

      <VideoShowcase />

      <CustomerReviews />
    </div>
  );
};

export default Home;
