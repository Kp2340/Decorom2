/**
 * Utility to verify honeypot anti-spam fields on client side.
 * Returns true if submission is genuine (botcheck field is empty).
 */
export const validateHoneypot = (formData) => {
  const botFieldValue = formData.get("website_hp_field");
  return !botFieldValue || botFieldValue.trim() === "";
};
