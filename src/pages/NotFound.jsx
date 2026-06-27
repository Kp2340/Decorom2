import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const NotFound = () => (
  <>
    <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />
    <section className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-yellow-200 leading-none select-none">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or may have moved. Head back to browse our nameplate collection.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-full transition-colors shadow-md"
          >
            Browse Products
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-full transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </section>
  </>
);

export default NotFound;
