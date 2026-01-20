import React, { memo, useCallback } from "react";

/**
 * Controlled input for flat/house number.
 * Optional field with character limit.
 */
const FlatInput = memo(({ value, onChange, zone, disabled = false }) => {
  const maxLength = zone?.maxLength || 10;
  const charCount = value?.length || 0;

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
        {zone?.label || "Flat / House No."}
        <span className="text-gray-400 font-normal ml-1">(Optional)</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="e.g., A-501"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        autoComplete="off"
      />
      <div className="text-xs mt-1 text-right text-gray-400">
        {charCount}/{maxLength}
      </div>
    </div>
  );
});

FlatInput.displayName = "FlatInput";

export default FlatInput;
