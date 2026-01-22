import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/products.api";
import ProductImageCarousel from "../components/ProductImageCarousel";
import ProductPriceCalculator from "../components/ProductPriceCalculator";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for calculator values to pass to checkout
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handlePriceChange = (newConfig) => {
    setConfig(newConfig);
  };

  const handleBuyNow = () => {
    if (!config || !config.isValid) {
      alert("Please select valid dimensions.");
      return;
    }

    navigate(`/products/${product.id}/checkout`, {
      state: { config },
    });
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!product)
    return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-600 hover:text-black flex items-center"
      >
        &larr; Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ProductImageCarousel images={product.images} />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-gray-500 mb-6">{product.description}</p>

          <div className="mb-6 space-y-2">
            <p>
              <span className="font-semibold">Material:</span>{" "}
              {product.material}
            </p>
            <p>
              <span className="font-semibold">Shape:</span> {product.shape}
            </p>
            <p>
              <span className="font-semibold">Default Size:</span>{" "}
              {product.defaultSize || "Not specified"}
            </p>
            <p>
              <span className="font-semibold">Base Price:</span> ₹
              {product.basePrice}
            </p>
            <p>
              <span className="font-semibold">Customizable:</span>{" "}
              {product.customizable ? "Yes" : "No"}
            </p>
          </div>

          <div className="mb-8">
            <ProductPriceCalculator product={product} onChange={handlePriceChange} />
          </div>

          <button
            onClick={handleBuyNow}
            className="w-full bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow hover:bg-pink-700 transition transform hover:-translate-y-0.5"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
