import React, { memo, useCallback } from "react";

/**
 * Controlled input for family name with real-time updates.
 * Includes character limit indicator and validation styling.
 */
const NameInput = memo(({ value, onChange, zone, disabled = false }) => {
  const maxLength = zone?.maxLength || 20;
  const charCount = value?.length || 0;
  const isNearLimit = charCount > maxLength * 0.8;

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      if (newValue.length <= maxLength) {
        onChange(newValue);
      }
    },
    [onChange, maxLength],
  );

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {zone?.label || "Family Name"} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Enter your family name"
        className={`w-full px-3 py-2 border rounded-lg text-base transition-colors
          ${!value?.trim() ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-pink-500"}
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed`}
        autoComplete="off"
      />
      <div
        className={`text-xs mt-1 text-right ${isNearLimit ? "text-amber-600" : "text-gray-400"}`}
      >
        {charCount}/{maxLength}
      </div>
    </div>
  );
});

NameInput.displayName = "NameInput";

export default NameInput;
