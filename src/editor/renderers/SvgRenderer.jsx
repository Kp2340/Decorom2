import React, { memo, useMemo } from "react";

/**
 * SVG-based nameplate renderer using design images as backgrounds.
 * Supports dynamic scaling and italic text styling.
 * Auto-fetches design from /designs/blank/{productId}.png
 */
const SvgRenderer = memo(
  ({ productId, editorConfig, values, scale = 1, className = "" }) => {
    const { defaultWidth, defaultHeight, textZones } = editorConfig || {};

    // Calculate viewBox based on aspect ratio (normalized to 200 base width)
    const aspectRatio =
      defaultWidth && defaultHeight ? defaultWidth / defaultHeight : 0.4;
    const vbWidth = 200;
    const vbHeight = Math.round(vbWidth / aspectRatio);
    const viewBox = `0 0 ${vbWidth} ${vbHeight}`;

    // Auto-generate design image path from product ID
    const backgroundImage = productId
      ? `/designs/blank/${productId}.png`
      : null;

    // Calculate font size with auto-scaling based on text length and scale factor
    const calculateFontSize = useMemo(
      () => (zone, text) => {
        if (!text) return zone.fontSize * scale;

        const charCount = text.length;
        const maxChars = zone.maxLength || 15;
        const { fontSize } = zone;

        // Reduce font size for longer text
        let scaledSize = fontSize;
        if (charCount > 5) {
          const reduction = Math.min((charCount - 5) / (maxChars - 5), 0.5);
          scaledSize = fontSize * (1 - reduction * 0.4);
        }

        return Math.round(scaledSize * scale);
      },
      [scale],
    );

    // Convert percentage position to viewBox coordinates
    const toViewBoxCoord = (percent, dimension) => {
      return dimension === "x"
        ? (percent / 100) * vbWidth
        : (percent / 100) * vbHeight;
    };

    return (
      <svg
        viewBox={viewBox}
        className={`w-full h-full ${className}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Nameplate Preview"
      >
        {/* Definitions for text effects */}
        <defs>
          <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background: Design Image */}
        {backgroundImage ? (
          <image
            href={backgroundImage}
            x="0"
            y="0"
            width={vbWidth}
            height={vbHeight}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <rect
            x="0"
            y="0"
            width={vbWidth}
            height={vbHeight}
            rx="16"
            ry="16"
            fill="#0a0a0a"
          />
        )}

        {/* Dynamic Text Zones */}
        {textZones?.map((zone) => {
          const text = values[zone.id] || "";
          const fontSize = calculateFontSize(zone, text);
          const x = toViewBoxCoord(zone.position.x, "x");
          const y = toViewBoxCoord(zone.position.y, "y");

          return text ? (
            <text
              key={zone.id}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={zone.color || "#d4a620"}
              fontFamily={zone.fontFamily}
              fontWeight={zone.fontWeight || 400}
              fontStyle={zone.fontStyle || "normal"}
              fontSize={fontSize}
              filter="url(#textGlow)"
            >
              {text}
            </text>
          ) : null;
        })}
      </svg>
    );
  },
);

SvgRenderer.displayName = "SvgRenderer";

export default SvgRenderer;
