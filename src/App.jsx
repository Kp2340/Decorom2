import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './pages/Product';
import Nameplate from './pages/categories/Nameplate';
import Banner from './pages/categories/Banner';
import Radium from './pages/categories/Radium';
import Commercial from './pages/categories/Commercial';
import Interior from './pages/categories/Interior';
import Film from './pages/categories/Film';
import Safety from './pages/categories/Safety';
// import Signage from './pages/categories/Signage';
import Home from './pages/Home';

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<Product />} />
            <Route path="/nameplate" element={<Nameplate />} />
            <Route path="/banner" element={<Banner />} />
            <Route path="/radium" element={<Radium />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/interior" element={<Interior />} />
            <Route path="/film" element={<Film />} />
            <Route path="/safety" element={<Safety />} />
            {/*<Route path="/signage" element={<Signage />} />*/}
        </Routes>
    </BrowserRouter>
);
export default App;