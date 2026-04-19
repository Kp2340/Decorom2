/**
 * Frontend Pricing Utility
 * Mirrors the logic in PricingService.java exactly.
 */

export const calculateFinalPrice = (material = "", width = 0, height = 0, lighting = false, fitting = false) => {
    const minDim = 5.0;
    const maxDim = 96.0;

    // Validate dimensions
    if (width < minDim || width > maxDim || height < minDim || height > maxDim) {
        return 0;
    }

    const area = width * height;
    const mat = material.toLowerCase();
    
    let rate = 0;

    // Tiered pricing logic
    if (mat.includes("acrylic") || mat.includes("wood")) {
        if (area <= 100) rate = 13.0;
        else if (area <= 225) rate = 11.5;
        else rate = 10.0;
    } else if (mat.includes("acp")) {
        if (area <= 100) rate = 14.0;
        else if (area <= 225) rate = 12.0;
        else rate = 10.0;
    } else if (isMetal(mat)) {
        if (area <= 100) rate = 30.0;
        else if (area <= 225) rate = 25.0;
        else rate = 20.0;
    } else {
        // Fallback for unknown materials
        rate = 13.0; 
    }

    let price = rate * area;

    // Lighting Multiplier
    if (lighting) {
        if (isMetal(mat)) {
            price *= 1.6; // Metal + Light = 1.6x
        } else {
            price *= 2.0; // Acrylic/Wood + Light = 2.0x
        }
    }

    // Fitting flat fee
    if (fitting) {
        price += 500;
    }

    return Number(price.toFixed(2));
};

const isMetal = (mat) => {
    const tokens = mat.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    return tokens.some((t) => ["ss", "ms", "metal", "steel"].includes(t));
};
