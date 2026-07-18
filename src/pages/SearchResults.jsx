import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProductsForSearch } from "../api/products.api";
import { searchProducts } from "../utils/searchUtils";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["allProductsForSearch"],
    queryFn: getAllProductsForSearch,
  });

  const results = searchProducts(products, query);

  return (
    <div className="min-h-screen bg-white pb-16">
      <SEO
        title={query ? `Search results for "${query}"` : "Search"}
        description="Search Decorom's designer nameplates by name, material, or shape."
      />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {query ? `Results for "${query}"` : "Search"}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              No products found{query ? ` for "${query}"` : ""}. Try a different material or shape.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-8">{results.length} product{results.length === 1 ? "" : "s"} found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
