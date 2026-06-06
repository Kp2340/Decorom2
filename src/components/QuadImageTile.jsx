import { PLACEHOLDER_IMAGE } from "../utils/imageUtils";

const QuadImageTile = ({ categoryName, images = [] }) => {
  // Use provided images or fallbacks
  const displayImages = images.slice(0, 4);
  while (displayImages.length < 4) {
    displayImages.push(PLACEHOLDER_IMAGE);
  }


  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 grid grid-cols-2 grid-rows-2 gap-1 bg-gray-200 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
        {displayImages.map((src, index) => (
          <div key={index} className="overflow-hidden bg-white">
            <img
              src={src}
              alt={`${categoryName} sample ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
        {/* Overlay for better text legibility if needed, but here we want to see images */}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors capitalize">
        {categoryName}
      </h3>
    </div>
  );
};

export default QuadImageTile;
