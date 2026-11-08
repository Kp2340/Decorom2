export const CONTACT_WHATSAPP_NUMBER = "919016707658";
export const CONTACT_PHONE = "+91 90167 07658";
export const CONTACT_EMAIL = "decorom213@gmail.com";
export const CONTACT_ADDRESS =
  "Shop A/7, Second Floor, Shreekunj Shopping Centre, Near HDFC Bank, K.K. Nagar, Ghatlodiya, Nirnay Nagar, Ahmedabad, Gujarat 380061";
export const GOOGLE_MAPS_REVIEWS_URL =
  "https://www.google.com/maps?cid=6058749169901264755";

export const CONTACT_WHATSAPP_URL = (message = "") => {
  const base = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
