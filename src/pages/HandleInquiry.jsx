import { useState, useEffect } from 'react';
// import { useParams } from "react-router-dom";
import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import {useParams} from "react-router-dom";

const HandleInquiry = () => {
    const { type } = useParams();
    const [product, setProduct] = useState([]);
    const [material, setMaterial] = useState("");
    const [shape, setShape] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const productTypes = ["banner", "commercial", "film", "interior", "nameplate", "offer", "radium", "safety"]

    useEffect(() => {
        // if (!type || !productTypes.includes(type)) {
        //     setProduct([]);
        //     return;
        // }
        // import(`../data/${type}.js`)
        import(`../data/nameplate.js`)
            .then((module) => setProduct(module.types))
            .catch((error) => {
                console.log(error);
                setProduct([])
            });
    }, [type]);

    useEffect(() => {
        const filtered = product.filter(
            (p) => (!material || p.material === material) && (!shape || p.shape === shape)
        );
        setFilteredProducts(filtered);
    }, [product, material, shape]);

    return !product ? (
        <header className="bg-pink-600 text-white py-6 mb-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Products
                </h1>
            </div>
        </header>
    ) : (
        <div>
            {/* Hero Section */}
            <section id="hero" className="text-center py-16 bg-gray-50">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Welcome to Decorom Gallery
                </h1>
                <p className="text-gray-600 text-lg md:text-xl">
                    Discover our unique collection of wall art and decorative pieces
                </p>
            </section>

            {/* Filters */}
            <section id="filters" className="py-8 bg-white sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-center items-center px-4">
                    <select
                        onChange={(e) => setMaterial(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
                    >
                        <option value="">All Materials</option>
                        <option value="Acrylic">Acrylic</option>
                        <option value="Wood">Wood</option>
                        <option value="Stainless Steel">Stainless Steel</option>
                    </select>
                    <select
                        onChange={(e) => setShape(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-auto"
                    >
                        <option value="">All Shapes</option>
                        <option value="Square">Square</option>
                        <option value="Rectangle">Rectangle</option>
                        <option value="Circle">Circle</option>
                        <option value="Oval">Oval</option>
                        <option value="Unique">Unique</option>
                    </select>
                </div>
            </section>

            {/* Gallery */}
            {filteredProducts && (
                <section id="gallery" className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={setSelectedProduct}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Product Details Modal */}
            {selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default HandleInquiry;