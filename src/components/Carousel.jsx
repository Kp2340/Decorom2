import React, { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const images = [
  "/images/carousel1.jpg",
  "/images/carousel2.jpg",
  "/images/carousel3.jpg",
  "/images/carousel4.jpg",
  "/images/carousel5.jpg",
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const timeoutRef = useRef(null);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const nextSlide = () => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    };
    timeoutRef.current = setTimeout(nextSlide, 3000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, length]);

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <div className="relative w-full  mx-auto overflow-hidden">
      {/* Images */}
      <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {images.map((img, index) => (
          <div key={index} className="min-w-full flex-shrink-0">
            <img src={img} alt={`Slide ${index}`} className="w-full h-64 md:h-96 object-cover" />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100 transition"
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="h-6 w-6 text-black" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow hover:bg-opacity-100 transition"
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="h-6 w-6 text-black" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === current ? "bg-pink-500" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
