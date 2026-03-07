import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const materials = [
  { id: "1", label: "Acrylic" },
  { id: "2", label: "ACP" },
  { id: "3", label: "Wooden" },
  { id: "4", label: "Stainless Steel" },
  { id: "5", label: "Mild Steel" },
  { id: "6", label: "Resine" },
];

const shapes = [
  { id: "1", label: "Circle" },
  { id: "2", label: "Square" },
  { id: "3", label: "Rectangle" },
  { id: "4", label: "Capsule" },
  { id: "5", label: "Unique" },
];

const FilterDropdown = ({
  label,
  options,
  selectedValue,
  onSelect,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === selectedValue);

  return (
    <div
      className="relative inline-block text-left w-full sm:w-48"
      ref={dropdownRef}
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
            selectedOption
              ? "bg-amber-50 border-amber-200 text-amber-900"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : label}
          </span>
          {selectedValue ? (
            <X
              className="w-4 h-4 ml-2 text-gray-400 hover:text-amber-900 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            />
          ) : (
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 origin-top-right bg-white border border-gray-200 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in duration-200">
          <div className="py-1 max-h-60 overflow-y-auto scrollbar-hide">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSelect(option.id);
                  setIsOpen(false);
                }}
                className={`block w-full px-4 py-2 text-sm text-left transition-colors ${
                  selectedValue === option.id
                    ? "bg-amber-100 text-amber-900 font-semibold"
                    : "text-gray-700 hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductFilters = ({
  selectedMaterial,
  setSelectedMaterial,
  selectedShape,
  setSelectedShape,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
      <FilterDropdown
        label="Select Material"
        options={materials}
        selectedValue={selectedMaterial}
        onSelect={setSelectedMaterial}
        onClear={() => setSelectedMaterial("")}
      />
      <FilterDropdown
        label="Select Shape"
        options={shapes}
        selectedValue={selectedShape}
        onSelect={setSelectedShape}
        onClear={() => setSelectedShape("")}
      />
    </div>
  );
};

export default ProductFilters;
