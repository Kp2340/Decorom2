import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const length = images.length;

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-lg shadow-md bg-white">
      {/* Images */}
      <div className="relative h-64 md:h-96 w-full">
        <img
          src={images[current]}
          alt={`Slide ${current}`}
          className="w-full h-full object-contain"
        />
      </div>

      {length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white transition"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>

          {/* Thumbnails / Dots */}
          <div className="absolute bottom-4 w-full flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === current ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
