import React, { memo } from "react";
import SvgRenderer from "../renderers/SvgRenderer";

/**
 * Reusable preview component for nameplates.
 * Displays actual dimensions and scales preview proportionally.
 */
const NameplatePreview = memo(
  ({
    productId,
    editorConfig,
    values,
    dimensions,
    scale = 1,
    className = "",
  }) => {
    const { defaultWidth = 24, defaultHeight = 60 } = editorConfig || {};
    const aspectRatio = defaultWidth / defaultHeight;

    return (
      <div className={`relative ${className}`}>
        {/* Preview label */}
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">
          Live Preview
        </div>

        {/* Aspect ratio container */}
        <div
          className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          <SvgRenderer
            productId={productId}
            editorConfig={editorConfig}
            values={values}
            scale={scale}
          />

          {/* Empty state overlay */}
          {!values?.familyName?.trim() && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
              <p className="text-amber-400/70 text-sm font-medium">
                Enter your name to preview
              </p>
            </div>
          )}
        </div>

        {/* Size indicator */}
        <div className="mt-2 text-xs text-gray-400 text-center">
          Size: {dimensions?.width || defaultWidth} ×{" "}
          {dimensions?.height || defaultHeight} inch
        </div>
      </div>
    );
  },
);

NameplatePreview.displayName = "NameplatePreview";

export default NameplatePreview;
