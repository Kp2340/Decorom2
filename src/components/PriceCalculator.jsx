import React, { useState, useEffect, useCallback } from 'react';

const PriceCalculator = ({ initialMaterial = "Acrylic", initialSize = "", productHasLight = false, onPriceChange }) => {
    // Parse initial size if possible (e.g., "12x24 inches")
    const parseSize = (sizeStr) => {
        if (!sizeStr) return { h: 12, w: 12 };
        const match = sizeStr.toLowerCase().match(/(\d+)\s*x\s*(\d+)/);
        if (match) return { h: parseInt(match[1]), w: parseInt(match[2]) };
        return { h: 12, w: 12 };
    };

    const defaults = parseSize(initialSize);

    const [height, setHeight] = useState(defaults.h);
    const [width, setWidth] = useState(defaults.w);
    const [material, setMaterial] = useState(initialMaterial);
    const [withLighting, setWithLighting] = useState(productHasLight);
    const [withFitting, setWithFitting] = useState(false);
    const [finalPrice, setFinalPrice] = useState(0);
    const [error, setError] = useState("");

    // Sync lighting state if prop changes
    useEffect(() => {
        if (productHasLight) {
            setWithLighting(true);
        }
    }, [productHasLight]);

    // Pricing Rules wrapped in useCallback to be a stable dependency
    const calculatePrice = useCallback(() => {
        const h = parseInt(height) || 0;
        const w = parseInt(width) || 0;
        const area = h * w;

        let isValid = true;
        let errorMsg = "";

        // Size Validation
        if (area < 50 || area > 2500) {
            isValid = false;
            errorMsg = "Size must be between 50 and 2500 sq inches.";
        }
        setError(errorMsg);

        let baseRate = 0;

        // Normalize material for logic
        const mat = material.toLowerCase();
        const isAcrylicOrWood = mat.includes('acrylic') || mat.includes('wood') || mat.includes('wooden');
        const isACP = mat.includes('acp');
        const isMetal = mat.includes('stainless') || mat.includes('steel') || mat.includes('ms') || mat.includes('metal');

        // Determine Base Rate
        if (isAcrylicOrWood) {
            if (area <= 100) baseRate = 13;
            else if (area <= 225) baseRate = 11.5;
            else baseRate = 10;
        } else if (isACP) {
            if (area <= 100) baseRate = 14;
            else if (area <= 225) baseRate = 12;
            else baseRate = 10;
        } else if (isMetal) {
            // SS / MS
            if (area <= 100) baseRate = 30;
            else if (area <= 225) baseRate = 25;
            else baseRate = 20;
        } else {
            // Default fallback (treat as Acrylic)
            if (area <= 100) baseRate = 13;
            else if (area <= 225) baseRate = 11.5;
            else baseRate = 10;
        }

        let materialCost = area * baseRate;

        // Lighting Logic
        // If productHasLight is true, lighting is mandatory and included in calculation logic
        // If withLighting is checked (and allowed), apply multiplier
        if (withLighting) {
            if (isMetal) {
                materialCost *= 1.6; // +60%
            } else {
                materialCost *= 2; // Double
            }
        }

        // Fitting Logic
        let total = materialCost;
        if (withFitting) {
            total += 500;
        }

        const calculatedTotal = Math.round(total);
        setFinalPrice(calculatedTotal);

        // Notify parent
        if (onPriceChange) {
            onPriceChange({
                height: h,
                width: w,
                material,
                withLighting,
                withFitting,
                price: calculatedTotal,
                totalSqInch: area,
                isValid
            });
        }
    }, [height, width, material, withLighting, withFitting, onPriceChange]);

    // Run calculation whenever dependencies change
    useEffect(() => {
        calculatePrice();
    }, [calculatePrice]);

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Price Calculator</h4>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (inch)</label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className={`w-full border rounded px-2 py-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width (inch)</label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className={`w-full border rounded px-2 py-1 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                >
                    <option value="Acrylic">Acrylic</option>
                    <option value="ACP">ACP</option>
                    <option value="Wood">Wooden</option>
                    <option value="Stainless Steel">Stainless Steel (SS)</option>
                    <option value="Mild Steel">Mild Steel (MS)</option>
                </select>
            </div>

            <div className="space-y-2 mb-4">
                {productHasLight ? (
                    <label className="flex items-center space-x-2 cursor-not-allowed opacity-80">
                        <input
                            type="checkbox"
                            checked={true}
                            disabled
                            className="rounded text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Light with Waterproofing (Included)</span>
                    </label>
                ) : null}

                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={withFitting}
                        onChange={(e) => setWithFitting(e.target.checked)}
                        className="rounded text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Fitting (Ahmedabad Only) - ₹500</span>
                </label>
            </div>

            <div className="flex items-center justify-between border-t pt-3">
                <span className="text-gray-600">Total Price:</span>
                <span className="text-2xl font-bold text-pink-600">₹{finalPrice}</span>
            </div>
        </div>
    );
};

export default PriceCalculator;
