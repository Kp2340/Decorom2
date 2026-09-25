import { describe, it, expect } from "vitest";
import { calculateFinalPrice } from "./pricingUtils";

/**
 * FE ↔ BE pricing parity.
 *
 * The pricing formula is intentionally duplicated in two places:
 *   - Frontend: src/utils/pricingUtils.js        → calculateFinalPrice(...)
 *   - Backend:  PricingService.java              → calculatePrice(...)
 *
 * These MUST stay in sync (see .kiro/specs/decorom/bugs.md). The expected values
 * below are the exact assertions from the backend's PricingServiceTest.java. If a
 * rate, tier boundary, multiplier, or fee changes on one side only, this test breaks.
 *
 * Each case: [label, material, width, height, lighting, fitting, expectedPrice]
 * mirrored 1:1 from PricingServiceTest.
 */
const parityCases = [
  ["Acrylic small area (≤100) @ ₹13", "Acrylic", 10, 10, false, false, 1300.0],
  ["Metal MS small area (≤100) @ ₹30", "MS", 10, 10, false, false, 3000.0],
  ["Acrylic + light (2.0x) + fitting (+500)", "Acrylic", 10, 10, true, true, 3100.0],
  ["Metal + light (1.6x) + fitting (+500)", "MS", 10, 10, true, true, 5300.0],
  ["Resin small area (≤100) @ ₹20", "Resin", 10, 10, false, false, 2000.0],
  ["Resin medium area (101-225) @ ₹18", "Resin", 15, 10, false, false, 2700.0],
  ["Resin large area (>225) @ ₹16", "Resin", 20, 15, false, false, 4800.0],
  ["Resin + light (2.0x) + fitting (+500)", "Resin", 10, 10, true, true, 4500.0],
  ["Stainless Steel recognized as metal (1.6x) + fitting", "Stainless Steel", 10, 10, true, true, 5300.0],
];

describe("pricingUtils.calculateFinalPrice — parity with backend PricingService", () => {
  it.each(parityCases)(
    "%s",
    (_label, material, width, height, lighting, fitting, expected) => {
      expect(calculateFinalPrice(material, width, height, lighting, fitting)).toBeCloseTo(expected, 2);
    }
  );

  // ── Documented, intentional FE/BE divergences ──────────────────────────────
  // The backend THROWS on these; the frontend is a UI helper and must not throw,
  // so it returns a safe sentinel/fallback instead. These are deliberate and are
  // asserted here so the difference is explicit rather than an accidental drift.

  it("out-of-range dimensions return 0 on the FE (backend throws)", () => {
    // BE: PricingServiceTest.calculatePrice_ExceedingMaxDimensions expects IllegalArgumentException
    expect(calculateFinalPrice("Acrylic", 100, 10, false, false)).toBe(0);
  });

  it("unknown material falls back to ₹13 rate on the FE (backend throws)", () => {
    // BE: PricingServiceTest.calculatePrice_UnknownMaterial expects IllegalArgumentException.
    // FE fallback rate is 13.0 → 100 sq in * 13 = 1300.
    expect(calculateFinalPrice("Unobtanium", 10, 10, false, false)).toBeCloseTo(1300.0, 2);
  });
});
