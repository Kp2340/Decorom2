import React from "react";
import { Link } from "react-router-dom";

// Dummy categories
const categories = [
  { id: 1, name: "NamePlate", image: "/images/category1.png", path: "/nameplate" },
  { id: 2, name: "Banner", image: "/images/category2.png", path: "/banner" },
  { id: 3, name: "Radium", image: "/images/category3.png", path: "/radium" },
  { id: 4, name: "Commercial", image: "/images/category4.png", path: "/commercial" },
  { id: 5, name: "Interior", image: "/images/category5.png", path: "/interior" },
  { id: 6, name: "Film", image: "/images/category6.png", path: "/film" },
  { id: 7, name: "Safety", image: "/images/category7.png", path: "/safety" },
];

const Categories = () => {
  return (
    <section id="categories" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Products</h2>

        {/* Top row - 4 images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mb-6">
          {categories.slice(0, 4).map((cat) => (
            <Link key={cat.id} to={cat.path}>
              <div className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="w-40 h-40 rounded-lg overflow-hidden mb-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-medium text-gray-700">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom row - 3 images centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center mx-auto">
          {categories.slice(4).map((cat) => (
            <Link key={cat.id} to={cat.path}>
              <div className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="w-40 h-40 rounded-lg overflow-hidden mb-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg font-medium text-gray-700">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
