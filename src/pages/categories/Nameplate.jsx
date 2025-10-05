import React from 'react';
import Layout from '../../components/Layout';
import { products } from '../../data/products';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const Nameplate = () => {
  const [material, setMaterial] = React.useState('');
  const [shape, setShape] = React.useState('');

  const filteredProducts = products.filter(
    (p) => (!material || p.material === material) && (!shape || p.shape === shape)
  );

  const handleInquiry = (product) => {
    const message = encodeURIComponent(
      `Hi, I'm interested in:\n\n` +
        `Image: decorom.in${product.link}\n` +
        `Product_Name: ${product.name}\n` +
        `Material: ${product.material}\n` +
        `Shape: ${product.shape}\n` +
        `Size: ${product.size}\n\n` +
        `Please provide more information about this product.`
    );
    window.open(`https://wa.me/9016707658?text=${message}`, '_blank');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section id="hero" className="text-center py-16 bg-gray-50">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Welcome to Decorom Gallery</h1>
        <p className="text-gray-600 text-lg md:text-xl">Discover our unique collection of wall art and decorative pieces</p>
      </section>

      {/* Filters */}
      <section id="filters" className="py-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-center items-center">
          <select
            onChange={(e) => setMaterial(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Materials</option>
            <option value="Acrylic">Acrylic</option>
            <option value="Wood">Wood</option>
            <option value="Stainless Steel">Stainless Steel</option>
          </select>
          <select
            onChange={(e) => setShape(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
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

      git init
      git add .
      git commit -m "first commit"
      git branch -M main
      git remote add origin https://github.com/Kp2340/Decorom2.git
      git push -u origin main

      {/* Gallery */}
      <section id="gallery" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
              <LazyLoadImage src={product.link} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                  <p>Material: {product.material}</p>
                  <p>Shape: {product.shape}</p>
                  <p>Size: {product.size}</p>
                </div>
                <button
                  onClick={() => handleInquiry(product)}
                  className="mt-auto bg-pink-500 text-white font-medium py-2 rounded-md hover:bg-pink-600 transition-colors relative overflow-hidden"
                >
                  Inquiry Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Nameplate;
