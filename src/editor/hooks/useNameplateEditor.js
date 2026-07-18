import { useState, useMemo, useCallback } from "react";

/**
 * Custom hook for managing nameplate editor state.
 * Supports direct dimension input (width/height) with aspect ratio lock.
 */
export const useNameplateEditor = (editorConfig, initialValues, initialDimensions) => {
  const { defaultWidth = 24, defaultHeight = 60 } = editorConfig || {};

  const [values, setValues] = useState({
    familyName: initialValues?.familyName || "",
    flatNumber: initialValues?.flatNumber || "",
  });

  // Dimensions in actual units (cm/inches) — optionally seeded (e.g. from a shared link)
  const [dimensions, setDimensions] = useState({
    width: initialDimensions?.width || defaultWidth,
    height: initialDimensions?.height || defaultHeight,
  });

  const updateValue = useCallback((field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Update dimensions while maintaining aspect ratio
  const updateDimension = useCallback(
    (dimension, value) => {
      const numValue = parseFloat(value) || 0;
      const aspectRatio = defaultWidth / defaultHeight;

      if (dimension === "height") {
        setDimensions({
          height: numValue,
          width: Math.round(numValue * aspectRatio),
        });
      } else {
        setDimensions({
          width: numValue,
          height: Math.round(numValue / aspectRatio),
        });
      }
    },
    [defaultWidth, defaultHeight],
  );

  // Calculate scale factor based on dimensions
  const scale = useMemo(() => {
    return dimensions.height / defaultHeight;
  }, [dimensions.height, defaultHeight]);

  const isValid = useMemo(() => {
    const nameZone = editorConfig?.textZones?.find(
      (z) => z.id === "familyName",
    );
    if (nameZone?.required && !values.familyName.trim()) {
      return false;
    }
    return dimensions.height > 0 && dimensions.width > 0;
  }, [editorConfig, values.familyName, dimensions]);

  const orderPayload = useMemo(() => {
    return {
      productId: editorConfig?.productId,
      texts: {
        familyName: values.familyName.trim(),
        flatNumber: values.flatNumber.trim(),
      },
      size: {
        width: dimensions.width,
        height: dimensions.height,
        unit: "inch",
      },
    };
  }, [editorConfig, values, dimensions]);

  const reset = useCallback(() => {
    setValues({ familyName: "", flatNumber: "" });
    setDimensions({ width: defaultWidth, height: defaultHeight });
  }, [defaultWidth, defaultHeight]);

  return {
    values,
    setValues,
    updateValue,
    dimensions,
    setDimensions,
    updateDimension,
    scale,
    isValid,
    orderPayload,
    reset,
  };
};

export default useNameplateEditor;
