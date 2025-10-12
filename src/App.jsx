import { HashRouter , Routes, Route } from "react-router-dom";
import HandleInquiry from "./pages/categories/HandleInquiry";
import Layout from "./components/Layout";
import Nameplate from "./pages/categories/Nameplate";
import Banner from "./pages/categories/Banner";
import Radium from "./pages/categories/Radium";
import Commercial from "./pages/categories/Commercial";
import Interior from "./pages/categories/Interior";
import Film from "./pages/categories/Film";
import Safety from "./pages/categories/Safety";
import Offer from "./pages/categories/Offer";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ContactUs from "./pages/Contact";
import AboutUs from "./pages/About";

const App = () => (
  <HashRouter>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Product />} />
      {/*<Route path="/products" element={<products />} />*/}
      <Route path="/productss/:type" element={<HandleInquiry />} />
      {/*<Route path="/nameplate" element={<Nameplate />} />*/}
      {/*<Route path="/banner" element={<Banner />} />*/}
      {/*<Route path="/radium" element={<Radium />} />*/}
      {/*<Route path="/commercial" element={<Commercial />} />*/}
      {/*<Route path="/interior" element={<Interior />} />*/}
      {/*<Route path="/film" element={<Film />} />*/}
      {/*<Route path="/safety" element={<Safety />} />*/}
      {/*<Route path="/offer" element={<Offer />} />*/}
      <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
      <Route path="/about" element={<Layout> <AboutUs /> </Layout>} />
     </Routes>
  </HashRouter>
);
export default App;