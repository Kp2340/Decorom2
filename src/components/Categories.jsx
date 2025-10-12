import React from "react";
import {Link} from "react-router-dom";

const categories = [
  { id: 1, name: "NamePlate", image: "category/1.png", path: "/products/nameplate" },
  { id: 2, name: "Banner", image: "category/2.png", path: "/products/banner" },
  { id: 3, name: "Radium", image: "category/3.png", path: "/products/radium" },
  { id: 4, name: "Commercial", image: "category/4.png", path: "/products/commercial" },
  { id: 5, name: "Interior", image: "category/5.png", path: "/products/interior" },
  { id: 6, name: "Film", image: "category/6.png", path: "/products/film" },
  { id: 7, name: "Safety", image: "category/7.png", path: "/products/safety" },
  { id: 8, name: "Offer", image: "category/7.png", path: "/products/offer" },
];

const Categories = () => {
  // const navigate = useNavigate();

  return (
    <section id="categories" className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Products</h2>

        {/* Top row - 4 images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mb-6">
          {categories.slice(0, 8).map((cat) => (
            <Link key={cat.id}
                  // to={cat.path}
                  to={"/productss/"+cat.name.toLowerCase()} >
                  {/*onClick={() => navigate("/productss"+cat.name.toLowerCase())} >*/}
              <div className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="w-64 h-64 sm:w-52 sm:h-52 rounded-lg overflow-hidden mb-2">
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

        {/*/!* Bottom row - 3 images centered *!/*/}
        {/*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center mb-6">*/}
        {/*/!*<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center mx-auto">*!/*/}
        {/*  {categories.slice(4).map((cat) => (*/}
        {/*    <Link key={cat.id} to={cat.path}>*/}
        {/*      <div className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer">*/}
        {/*        <div className="w-64 h-64 sm:w-52 sm:h-52 rounded-lg overflow-hidden mb-2">*/}
        {/*          <img*/}
        {/*            src={cat.image}*/}
        {/*            alt={cat.name}*/}
        {/*            className="w-full h-full object-cover"*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*        <p className="text-lg font-medium text-gray-700">{cat.name}</p>*/}
        {/*      </div>*/}
        {/*    </Link>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>
    </section>
  );
};

export default Categories;