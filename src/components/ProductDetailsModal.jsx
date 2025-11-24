import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import PriceCalculator from './PriceCalculator';

const ProductDetailsModal = ({ product, onClose }) => {
    if (!product) return null;

    // Gallery Logic: Main image + extra images
    const allImages = [product.link, ...(product.images || [])];
    const [selectedImage, setSelectedImage] = useState(allImages[0]);

    // Calculator State
    const [calculatedConfig, setCalculatedConfig] = useState(null);

    // Checkout Form State
    const [userIP, setUserIP] = useState("");
    const [address, setAddress] = useState({
        flatNo: "",
        society: "",
        area: "",
        city: "Ahmedabad",
        state: "Gujarat",
        pincode: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch IP on mount
    useEffect(() => {
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => setUserIP(data.ip))
            .catch(err => {
                console.warn("IP fetch blocked by client (likely ad-blocker). Using fallback.");
                setUserIP("0.0.0.0"); // Fallback IP to ensure checkout doesn't fail
            });
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        // Validation
        if (!calculatedConfig || !calculatedConfig.isValid) {
            alert("Please ensure product configuration is valid.");
            return;
        }
        if (!address.flatNo || !address.society || !address.area || !address.pincode) {
            alert("Please fill in all address details.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            category: product.category || "Unknown", // Assuming category is passed or merged in data
            imageId: product.id || product.name,
            material: calculatedConfig.material,
            size: `${calculatedConfig.height}x${calculatedConfig.width}`,
            totalSqInch: calculatedConfig.totalSqInch,
            price: calculatedConfig.price,
            isLightIncluded: calculatedConfig.withLighting,
            isFittingIncluded: calculatedConfig.withFitting,
            userIP: userIP,
            address: address
        };

        try {
            const response = await fetch('http://localhost:8080/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Order Placed Successfully!");
                onClose();
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("An error occurred while placing the order.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine if product has light (heuristic or prop if available)
    // Assuming product.hasLight might exist, or we default to false.
    // The prompt says "Accept a prop... from the parent". 
    // Since we are in the modal, we pass it to PriceCalculator.
    // We'll assume the product object has this info.
    const productHasLight = product.hasLight || false;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-fadeIn">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Amazon-Style Gallery */}
                <div className="w-full md:w-1/2 p-6 bg-gray-50 flex flex-col items-center">
                    {/* Main Image */}
                    <div className="w-full aspect-square bg-white rounded-lg shadow-sm overflow-hidden mb-4 relative">
                        <LazyLoadImage
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Thumbnails Strip */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto w-full py-2 px-1 scrollbar-hide">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === img ? 'border-pink-500 scale-105' : 'border-gray-200 hover:border-pink-300'}`}
                                >
                                    <LazyLoadImage src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details, Calculator & Checkout */}
                <div className="w-full md:w-1/2 p-6 flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                        <div><span className="font-semibold">Shape:</span> {product.shape}</div>
                        <div><span className="font-semibold">Default Size:</span> {product.size}</div>
                    </div>

                    <hr className="my-2 border-gray-200" />

                    {/* Calculator */}
                    <PriceCalculator
                        initialMaterial={product.material}
                        initialSize={product.size}
                        productHasLight={productHasLight}
                        onPriceChange={setCalculatedConfig}
                    />

                    {/* Shipping Details Form */}
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800">Shipping Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text" name="flatNo" placeholder="Flat / Residence No."
                                value={address.flatNo} onChange={handleAddressChange}
                                className="border rounded px-3 py-2 text-sm w-full"
                            />
                            <input
                                type="text" name="society" placeholder="Society / Building"
                                value={address.society} onChange={handleAddressChange}
                                className="border rounded px-3 py-2 text-sm w-full"
                            />
                        </div>
                        <input
                            type="text" name="area" placeholder="Area / Locality"
                            value={address.area} onChange={handleAddressChange}
                            className="border rounded px-3 py-2 text-sm w-full mt-3"
                        />
                        <div className="grid grid-cols-3 gap-3 mt-3">
                            <input
                                type="text" name="city" placeholder="City"
                                value={address.city} onChange={handleAddressChange}
                                className="border rounded px-3 py-2 text-sm w-full"
                            />
                            <input
                                type="text" name="state" placeholder="State"
                                value={address.state} onChange={handleAddressChange}
                                className="border rounded px-3 py-2 text-sm w-full"
                            />
                            <input
                                type="text" name="pincode" placeholder="Pincode"
                                value={address.pincode} onChange={handleAddressChange}
                                className="border rounded px-3 py-2 text-sm w-full"
                            />
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        disabled={!calculatedConfig?.isValid || isSubmitting}
                        className={`mt-6 w-full font-bold py-3 rounded-lg shadow-md transition-all transform hover:scale-[1.02] 
                            ${(!calculatedConfig?.isValid || isSubmitting)
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                        {isSubmitting ? 'Processing...' : `Place Order & Pay - ₹${calculatedConfig?.price || 0}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
