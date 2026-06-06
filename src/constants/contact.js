export const CONTACT_WHATSAPP_NUMBER = "919016147775";
export const GOOGLE_MAPS_REVIEWS_URL = "https://www.google.com/maps/place/Decorom/@23.067602,72.5427599,17z/data=!4m8!3m7!1s0x4f84568c88347905:0x54150044f7285f73!8m2!3d23.067602!4d72.5453342!9m1!1b1";
export const CONTACT_EMAIL = "decorom213@gmail.com";
export const CONTACT_PHONE = "+91 9016707658";
export const CONTACT_WHATSAPP_URL = (message = "") => {
  const base = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};
