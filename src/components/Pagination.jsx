import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        className={`p-2 rounded-full border ${
          currentPage === 0
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <span className="text-gray-700 font-medium">
        Page {currentPage + 1} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages - 1}
        className={`p-2 rounded-full border ${
          currentPage >= totalPages - 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-gray-600 hover:bg-gray-50"
        }`}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
