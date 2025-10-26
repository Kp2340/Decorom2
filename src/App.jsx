import { HashRouter , Routes, Route } from "react-router-dom";

//Categories
import HandleInquiry from "./pages/HandleInquiry.jsx";

//Pages
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/About";

// Analytic
import { Analytics } from "@vercel/analytics/next"

//Components
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Categories from "./components/Categories.jsx";
import Carousel from "./components/Carousel.jsx";

const App = () => (
  <HashRouter>
    <Header />
      <Routes>
      <Route path="*" element={<div> <Carousel /> <Categories/> </div>} />
      <Route path="/" element={<div> <Carousel /> <Categories/> </div>} />
      <Route path="/products" element={<Categories />} />
      <Route path="/productss/:type" element={<HandleInquiry />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
     </Routes>
    <Footer />
   <Analytics/>
  </HashRouter>
);
export default App;