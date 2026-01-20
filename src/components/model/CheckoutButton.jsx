import React, { memo } from "react";

/**
 * CheckoutButton - Checkout/Place Order button.
 * Extracted from ProductDetailsModal.
 *
 * Props:
 * - isValid: Whether the order configuration is valid
 * - isSubmitting: Whether the order is being submitted
 * - price: The calculated price to display
 * - onClick: Handler for button click
 */
const CheckoutButton = memo(({ isValid, isSubmitting, price, onClick }) => {
  const isDisabled = !isValid || isSubmitting;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`mt-6 w-full font-bold py-3 rounded-lg shadow-md transition-all transform hover:scale-[1.02] 
        ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
    >
      {isSubmitting ? "Processing..." : `Place Order & Pay - ₹${price || 0}`}
    </button>
  );
});

CheckoutButton.displayName = "CheckoutButton";

export default CheckoutButton;
