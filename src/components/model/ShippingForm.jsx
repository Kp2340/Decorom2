import React, { memo, useCallback } from "react";

/**
 * Validates shipping address fields.
 * Returns null if valid, error string if invalid.
 * Pure function - no side effects.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const validateShipping = (address) => {
  if (!address.name || address.name.trim().length < 3) {
    return "Full name is required (min 3 characters)";
  }
  if (!/^\d{10}$/.test(address.mobile)) {
    return "Mobile must be exactly 10 digits";
  }
  if (!/^\S+@\S+\.\S+$/.test(address.email)) {
    return "Valid email address is required";
  }
  if (!address.flatNo?.trim()) {
    return "Flat/Residence number is required";
  }
  if (!address.society?.trim()) {
    return "Society/Building name is required";
  }
  if (!address.area?.trim()) {
    return "Area/Locality is required";
  }
  if (!address.city?.trim()) {
    return "City is required";
  }
  if (!address.state?.trim()) {
    return "State is required";
  }
  if (!/^\d{6}$/.test(address.pincode)) {
    return "Pincode must be exactly 6 digits";
  }
  return null;
};

/**
 * ShippingForm - Production-ready shipping form.
 *
 * Props:
 * - address: Object with name, mobile, email, flatNo, society, area, city, state, country, pincode
 * - onAddressChange: Callback (name, value) for field changes
 *
 * Features:
 * - Identity + Address sections
 * - Numeric-only enforcement on mobile/pincode
 * - Editable city/state/country with defaults
 */
const ShippingForm = memo(({ address, onAddressChange }) => {
  // Standard field change handler
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      onAddressChange(name, value);
    },
    [onAddressChange],
  );

  // Numeric-only handler for mobile and pincode
  const handleNumericChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      // Strip non-digits
      const numericValue = value.replace(/\D/g, "");
      onAddressChange(name, numericValue);
    },
    [onAddressChange],
  );

  const inputClass =
    "border border-gray-300 rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors";

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-3 text-gray-800">
        Shipping Details
      </h4>

      {/* Identity Section */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name *"
          value={address.name || ""}
          onChange={handleChange}
          autoComplete="name"
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number *"
            value={address.mobile || ""}
            onChange={handleNumericChange}
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address *"
            value={address.email || ""}
            onChange={handleChange}
            autoComplete="email"
            className={inputClass}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          name="flatNo"
          placeholder="Flat / Residence No. *"
          value={address.flatNo || ""}
          onChange={handleChange}
          autoComplete="address-line1"
          className={inputClass}
        />
        <input
          type="text"
          name="society"
          placeholder="Society / Building *"
          value={address.society || ""}
          onChange={handleChange}
          autoComplete="address-line2"
          className={inputClass}
        />
      </div>
      <input
        type="text"
        name="area"
        placeholder="Area / Locality *"
        value={address.area || ""}
        onChange={handleChange}
        autoComplete="address-level3"
        className={`${inputClass} mt-3`}
      />
      <div className="grid grid-cols-2 gap-3 mt-3">
        <input
          type="text"
          name="city"
          placeholder="City *"
          value={address.city || ""}
          onChange={handleChange}
          autoComplete="address-level2"
          className={inputClass}
        />
        <input
          type="text"
          name="state"
          placeholder="State *"
          value={address.state || ""}
          onChange={handleChange}
          autoComplete="address-level1"
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <input
          type="text"
          name="country"
          placeholder="Country *"
          value={address.country || ""}
          onChange={handleChange}
          autoComplete="country-name"
          className={inputClass}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode *"
          value={address.pincode || ""}
          onChange={handleNumericChange}
          inputMode="numeric"
          maxLength={6}
          autoComplete="postal-code"
          className={inputClass}
        />
      </div>
    </div>
  );
});

ShippingForm.displayName = "ShippingForm";

export default ShippingForm;
