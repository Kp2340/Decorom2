import React from "react";
import { useNavigate } from "react-router-dom";
import QuadImageTile from "./QuadImageTile";
import { CATEGORIES, slugify } from "../constants/categories";

const CategoryBrowse = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 bg-gray-50">
      <div className="container mx-auto px-4 mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse by Category</h2>
        <p className="text-gray-500 text-sm md:text-base">
          Choose your favourite material and explore custom designs.
        </p>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-8">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-2xl"
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
