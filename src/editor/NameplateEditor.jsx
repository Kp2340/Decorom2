import React, { useMemo } from "react";
import NameInput from "./controls/NameInput";
import FlatInput from "./controls/FlatInput";
import NameplatePreview from "./components/NameplatePreview";
import useNameplateEditor from "./hooks/useNameplateEditor";
import { isFixedPrice } from "../utils/productUtils";

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
  initialValues,
  initialDimensions,
  className = "",
}) => {
  const editorConfig = product?.editorConfig;
  const productId = product?.id;

  // Fixed-price best sellers ship in one standard size, so dimensions are not editable here.
  const sizeLocked = isFixedPrice(product);
  const [materialFinish, setMaterialFinish] = React.useState("acrylic");

  const {
    values,
    updateValue,
    dimensions,
    updateDimension,
    scale,
    isValid,
    orderPayload,
  } = useNameplateEditor(editorConfig, initialValues, initialDimensions);

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
            materialFinish={materialFinish}
          />
        </div>

        {/* Editor Controls */}
        <div className="lg:order-1 lg:flex-1">
          <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
            <h4 className="text-base font-bold text-[#2C3E50] mb-4 flex items-center">
              <span className="p-1.5 rounded-md bg-[#FFFDD0] text-[#E59500] mr-2.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </span>
              Customize Your Nameplate
            </h4>

            {/* Material Texture Preview Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#2C3E50] mb-1.5">
                Preview Material Finish
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "acrylic", label: "Acrylic Gloss", icon: "💎" },
                  { id: "brass", label: "Brass Gold", icon: "✨" },
                  { id: "wood", label: "Warm Wood", icon: "🪵" },
                  { id: "steel", label: "Brushed Steel", icon: "⚙️" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMaterialFinish(m.id)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      materialFinish === m.id
                        ? "bg-[#2C3E50] text-white border-[#2C3E50] shadow-xs"
                        : "bg-white text-[#334155] border-slate-200 hover:border-[#E59500]"
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

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

            {/* Dimension Inputs — read-only for fixed-price best sellers */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <label className="block text-xs font-semibold text-[#2C3E50] mb-2">
                Dimensions (inch)
              </label>

              {sizeLocked ? (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <span className="text-sm font-bold text-[#2C3E50]">
                    {dimensions.height}" × {dimensions.width}"
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Standard fixed size
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* Height Input */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
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
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500] text-[#2C3E50] text-sm bg-white"
                      />
                      <span className="text-slate-400 text-xs">inch</span>
                    </div>
                  </div>

                  {/* Width Input */}
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Width
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={dimensions.width}
                        onChange={(e) => updateDimension("width", e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500] text-[#2C3E50] text-sm bg-white"
                      />
                      <span className="text-slate-400 text-xs">inch</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Validation message */}
            {!isValid && (
              <p className="text-xs text-amber-600 font-medium mt-3">
                * Please enter your family name to preview live customization.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameplateEditor;
