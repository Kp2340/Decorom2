import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import { WishlistProvider } from "./wishlist/WishlistContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Customers = lazy(() => import("./pages/Customers"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Checkout = lazy(() => import("./pages/Checkout"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminApiTest = lazy(() => import("./pages/AdminApiTest"));
const ContactUs = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/About"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const CustomDesign = lazy(() => import("./pages/CustomDesign"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import FloatingButtons from "./components/FloatingButtons.jsx";
import { Analytics } from "@vercel/analytics/react";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <main className="pt-16 min-h-screen">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/category/:materialName" element={<CategoryPage />} />
                <Route path="/products/:productId" element={<ProductDetails />} />
                <Route
                  path="/products/:productId/edit"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard mode="edit" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products/:productId/delete"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard mode="delete" />
                    </ProtectedRoute>
                  }
                />
                <Route path="/products/:productId/checkout" element={<Checkout />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/track/:orderId" element={<OrderTracking />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/custom-design" element={<CustomDesign />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products/:productId"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard mode="edit" />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/api-test"
                  element={
                    <ProtectedRoute>
                      <AdminApiTest />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <FloatingButtons />
          <Analytics />
          <SpeedInsights/>
        </BrowserRouter>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
