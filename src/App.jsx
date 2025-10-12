import { HashRouter , Routes, Route } from "react-router-dom";

//Categories
import HandleInquiry from "./pages/HandleInquiry.jsx";

//Header, Footer
import Layout from "./components/Layout";

//Pages
import Home from "./pages/Home";
import Product from "./pages/Product";
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/About";

const App = () => (
  <HashRouter>
      <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      <Route path="/productss/:type" element={<HandleInquiry />} />
      <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
      <Route path="/about" element={<Layout> <AboutUs /> </Layout>} />
     </Routes>
  </HashRouter>
);
export default App;