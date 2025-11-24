import React from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";

const ProductCard = ({ product, onClick }) => {
    // Handle image: support both string and array
    const imageSrc = Array.isArray(product.link)
        ? product.link[0]
        : product.link;

    return (
        <div
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col cursor-pointer group"
            onClick={() => onClick(product)}
        >
            {/* Image Container */}
            <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                <LazyLoadImage
                    src={imageSrc}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                </h3>
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                    <p>Material: {product.material}</p>
                    <p>Shape: {product.shape}</p>
                    <p>Size: {product.size}</p>
                </div>

                <button
                    className="mt-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md transition-colors w-full"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
