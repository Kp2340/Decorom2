import React, { memo } from "react";
import SvgRenderer from "../renderers/SvgRenderer";

/**
 * Reusable preview component for nameplates.
 * Displays actual dimensions and scales preview proportionally with dynamic material finish overlays.
 */
const NameplatePreview = memo(
  ({
    productId,
    editorConfig,
    values,
    dimensions,
    scale = 1,
    materialFinish = "acrylic",
    className = "",
  }) => {
    const { defaultWidth = 24, defaultHeight = 60 } = editorConfig || {};
    const aspectRatio = defaultWidth / defaultHeight;

    const textureOverlays = {
      acrylic: "bg-gradient-to-tr from-transparent via-white/12 to-white/5 pointer-events-none",
      brass: "bg-gradient-to-r from-amber-600/15 via-yellow-300/20 to-amber-700/15 mix-blend-overlay pointer-events-none",
      wood: "bg-gradient-to-b from-amber-950/10 via-transparent to-amber-950/20 mix-blend-multiply pointer-events-none",
      steel: "bg-gradient-to-r from-slate-400/15 via-white/25 to-slate-500/15 mix-blend-overlay pointer-events-none",
    };

    return (
      <div className={`relative ${className}`}>
        {/* Preview label & live badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/40 animate-pulse" />
            <span className="text-xs text-[#2C3E50] font-bold uppercase tracking-wider">
              Live Craftsmanship Preview
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#E59500] bg-[#FFFDD0] px-2 py-0.5 rounded capitalize">
            {materialFinish} Finish
          </span>
        </div>

        {/* Aspect ratio container */}
        <div
          className="relative w-full bg-[#0F172A] rounded-xl overflow-hidden shadow-xl border border-slate-700/50 transition-all"
          style={{ aspectRatio: `${aspectRatio}` }}
        >
          <SvgRenderer
            productId={productId}
            editorConfig={editorConfig}
            values={values}
            scale={scale}
          />

          {/* Dynamic Material Texture Finish Overlay */}
          <div className={`absolute inset-0 ${textureOverlays[materialFinish] || textureOverlays.acrylic}`} />

          {/* Empty state overlay */}
          {!values?.familyName?.trim() && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-2xs">
              <p className="text-[#FFFDD0] text-xs sm:text-sm font-medium bg-black/60 px-3.5 py-2 rounded-lg border border-white/10 shadow-sm">
                Type your family name to see live preview
              </p>
            </div>
          )}
        </div>

        {/* Size indicator */}
        <div className="mt-2.5 text-xs text-slate-500 text-center font-medium">
          Scaled Preview · {dimensions?.width || defaultWidth}" × {dimensions?.height || defaultHeight}"
        </div>
      </div>
    );
  },
);

NameplatePreview.displayName = "NameplatePreview";

export default NameplatePreview;
