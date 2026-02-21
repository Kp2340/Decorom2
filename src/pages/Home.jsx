import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products.api";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(page, pageSize);
        // data structure depends on backend. Assuming standard Spring Pageable or similar.
        // If array is returned directly:
        if (Array.isArray(data)) {
          setProducts(data);
          // If no total pages info, disable pagination or infer?
          // "Calls GET /api/products?page=0&size=12" implies pagination.
          // Typically returns { content: [], totalPages: 5, ... }
          // I'll assume standard page object wrapper, but fallback to array.
          setTotalPages(1); // Default if unknown
        } else if (data && data.content) {
          setProducts(data.content);
          setTotalPages(data.totalPages || 0);
        } else {
          // Fallback
          setProducts([]);
        }
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900">
        Our Collection
      </h1>

      <div
        className="grid mobile-four-fit scrollbar-hide sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[var(--grid-gap)] sm:gap-5"
        style={{ "--header-h": "80px", "--heading-h": "96px", "--grid-gap": "12px" }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Home;
