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
      <label className="block text-xs font-semibold text-[#2C3E50] mb-1">
        {zone?.label || "Flat / House No."}
        <span className="text-slate-400 font-normal ml-1">(Optional)</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="e.g., A-501"
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-[#2C3E50]
          focus:outline-none focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500]
          disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
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
