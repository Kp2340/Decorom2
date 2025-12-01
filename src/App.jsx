import { BrowserRouter, Routes, Route } from "react-router-dom";

//Categories
import HandleInquiry from "./pages/HandleInquiry.jsx";

//Pages
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/About";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";

// Analytic
import { Analytics } from "@vercel/analytics/react"

//Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Categories from "./components/Categories.jsx";
import Carousel from "./components/Carousel.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Header />
    <main className="pt-20 min-h-screen">
      <Routes>
        <Route path="*" element={<div> <Carousel /> <Categories /> </div>} />
        <Route path="/" element={<div> <Carousel /> <Categories /> </div>} />
        <Route path="/products" element={<Categories />} />
        <Route path="/products/:type" element={<HandleInquiry />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
      </Routes>
    </main>
    <Footer />
    <Analytics />
  </BrowserRouter>
);
export default App;