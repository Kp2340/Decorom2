import React from "react";
import { useNavigate } from "react-router-dom";
import QuadImageTile from "./QuadImageTile";
import { CATEGORIES, slugify } from "../constants/categories";

const CategoryBrowse = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 bg-gradient-to-b from-cyan-50/40 via-cyan-50/60 to-cyan-50/60 relative before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-200/70 before:to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-2">Browse by Category</h2>
        <p className="text-[#334155] text-sm md:text-base">
          Choose your favourite material and explore custom designs.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E59500] rounded-2xl"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/category/${slugify(cat.name)}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/category/${slugify(cat.name)}`);
              }
            }}
            aria-label={`View ${cat.name} nameplates`}
          >
            <QuadImageTile categoryName={cat.name} images={cat.images} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryBrowse;
