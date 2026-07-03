import React, { useMemo } from "react";
import NameInput from "./controls/NameInput";
import FlatInput from "./controls/FlatInput";
import NameplatePreview from "./components/NameplatePreview";
import useNameplateEditor from "./hooks/useNameplateEditor";

/**
 * Main Nameplate Editor component.
 * Data-driven from product's editorConfig.
 * Features direct dimension inputs (width/height in cm).
 */
const NameplateEditor = ({
  product,
  onValuesChange,
  onOrderReady,
  onDimensionsChange,
  className = "",
}) => {
  const editorConfig = product?.editorConfig;
  const productId = product?.id;

  const {
    values,
    updateValue,
    dimensions,
    updateDimension,
    scale,
    isValid,
    orderPayload,
  } = useNameplateEditor(editorConfig);

  // Get zone configurations for inputs
  const nameZone = useMemo(
    () => editorConfig?.textZones?.find((z) => z.id === "familyName"),
    [editorConfig],
  );
  const flatZone = useMemo(
    () => editorConfig?.textZones?.find((z) => z.id === "flatNumber"),
    [editorConfig],
  );

  // Notify parent of value changes
  React.useEffect(() => {
    onValuesChange?.(values);
  }, [values, onValuesChange]);

  // Notify parent of dimension changes
  React.useEffect(() => {
    onDimensionsChange?.(dimensions);
  }, [dimensions, onDimensionsChange]);

  // Notify parent when order is ready
  React.useEffect(() => {
    if (isValid) {
      onOrderReady?.(orderPayload);
    }
  }, [isValid, orderPayload, onOrderReady]);

  return (
    <div className={`${className}`}>
      {/* Responsive container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Preview Section */}
        <div className="lg:order-2 lg:flex-1">
          <NameplatePreview
            productId={productId}
            editorConfig={editorConfig}
            values={values}
            dimensions={dimensions}
            scale={scale}
          />
        </div>

        {/* Editor Controls */}
        <div className="lg:order-1 lg:flex-1">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-pink-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Customize Your Nameplate
            </h4>

            <NameInput
              value={values.familyName}
              onChange={(val) => updateValue("familyName", val)}
              zone={nameZone}
            />

            <FlatInput
              value={values.flatNumber}
              onChange={(val) => updateValue("flatNumber", val)}
              zone={flatZone}
            />

            {/* Dimension Inputs */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Size (inch)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Height Input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Height
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="200"
                      value={dimensions.height}
                      onChange={(e) =>
                        updateDimension("height", e.target.value)
                      }
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-800 text-center"
                    />
                    <span className="text-gray-500 text-sm">inch</span>
                  </div>
                </div>

                {/* Width Input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Width
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={dimensions.width}
                      onChange={(e) => updateDimension("width", e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-800 text-center"
                    />
                    <span className="text-gray-500 text-sm">inch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation message */}
            {!isValid && (
              <p className="text-sm text-red-500 mt-3">
                Please enter your family name to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameplateEditor;
