import React from "react";
import { useNavigate } from "react-router-dom";
import QuadImageTile from "./QuadImageTile";

import { CATEGORIES, slugify } from "../constants/categories";

const CategoryBrowse = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (name) => {
    navigate(`/category/${slugify(name)}`);
  };

  const handleKeyDown = (e, name) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCategoryClick(name);
    }
  };

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <p className="text-gray-500 max-w-xl">Choose your favorite material and explore hundreds of custom designs.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-8 px-4 scrollbar-hide gap-8 snap-x snap-mandatory lg:justify-center">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.name} 
            className="snap-center flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-2xl"
            role="button"
            tabIndex={0}
            onClick={() => handleCategoryClick(cat.name)}
            onKeyDown={(e) => handleKeyDown(e, cat.name)}
            aria-label={`View ${cat.name} category`}
          >
            <QuadImageTile categoryName={cat.name} images={cat.images} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryBrowse;
