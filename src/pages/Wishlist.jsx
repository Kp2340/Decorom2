import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "../wishlist/WishlistContext";
import ProductCard from "../components/ProductCard";
import SEO from "../components/SEO";

const Wishlist = () => {
  const { items } = useWishlist();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-16">
      <SEO
        title="Your Wishlist — Decorom"
        description="Nameplates you've saved to come back to later."
      />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
        <p className="text-gray-500 mb-8">
          Saved on this device — tap the heart on any product to remove it.
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors"
            >
              Browse Nameplates
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
