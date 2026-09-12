import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import SEO from "../components/SEO";
import { validateHoneypot } from "../utils/honeypot";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS, CONTACT_WHATSAPP_URL, GOOGLE_MAPS_REVIEWS_URL } from "../constants/contact";

const ContactUs = () => {
  const formRef = useRef();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error | spam
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (val && !/^[6-9]\d{9}$/.test(val.replace(/\s+/g, ""))) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number");
    } else {
      setPhoneError("");
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    // Anti-Spam Honeypot Verification
    if (!validateHoneypot(formData)) {
      setStatus("spam");
      return;
    }

    if (phoneError) return;

    setStatus("sending");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("success");
          formRef.current.reset();
        },
        () => {
          setStatus("error");
        }
      );
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Decorom for custom nameplate consultations, inquiries, and orders in Ahmedabad, Gujarat."
        url="https://www.decorom.in/contact"
      />
      <section className="bg-cyan-50/60 border-b border-cyan-100/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#2C3E50]">Contact Us</h1>
            <p className="text-[#334155] mt-2 text-sm">We're happy to help — reach out anytime for custom nameplate inquiries.</p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {/* Phone */}
            <div className="bg-white shadow-xs rounded-xl border border-slate-200 p-6 text-center product-card-lift group">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200/60 flex items-center justify-center rounded-xl mx-auto mb-4 text-2xl text-[#10B981] group-hover:text-[#E59500] transition-colors">
                📞
              </div>
              <h3 className="text-base font-bold text-[#2C3E50]">Phone</h3>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="mt-2 text-slate-600 hover:text-[#E59500] block text-sm font-medium">
                {CONTACT_PHONE}
              </a>
              <p className="mt-1 text-slate-400 text-xs">Shubh Bhavsar</p>
              <a
                href={CONTACT_WHATSAPP_URL("Hi, I have a query about a nameplate.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#25D366] hover:text-[#E59500] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366]"
              >
                <svg className="w-4 h-4 text-[#25D366] group-hover:text-[#E59500] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Address */}
            <div className="bg-white shadow-xs rounded-xl border border-slate-200 p-6 text-center product-card-lift group">
              <div className="w-16 h-16 bg-red-50 border border-red-200/60 flex items-center justify-center rounded-xl mx-auto mb-4 text-2xl text-[#EA4335] group-hover:text-[#E59500] transition-colors">
                📍
              </div>
              <h3 className="text-base font-bold text-[#2C3E50]">Address</h3>
              <a
                href={GOOGLE_MAPS_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-slate-600 hover:text-[#E59500] text-sm leading-relaxed block focus:outline-none focus:ring-2 focus:ring-[#E59500]"
              >
                {CONTACT_ADDRESS}
              </a>
            </div>

            {/* Email */}
            <div className="bg-white shadow-xs rounded-xl border border-slate-200 p-6 text-center sm:col-span-2 md:col-span-1 product-card-lift group">
              <div className="w-16 h-16 bg-red-50 border border-red-200/60 flex items-center justify-center rounded-xl mx-auto mb-4 text-2xl text-[#EA4335] group-hover:text-[#E59500] transition-colors">
                ✉️
              </div>
              <h3 className="text-base font-bold text-[#2C3E50]">Email</h3>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 text-slate-600 hover:text-[#E59500] block break-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E59500]">
                {CONTACT_EMAIL}
              </a>
              <p className="mt-2 text-slate-400 text-xs">We reply within 24 hours</p>
            </div>
          </div>

          {/* Map + Contact Form */}
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Google Map */}
            <div className="flex-1 w-full min-h-[280px] md:h-auto">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.7572500876954!2d72.5503355!3d23.0693596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4f84568c88347905%3A0x54150044f7285f73!2sDecorom!5e0!3m2!1sen!2sin!4v1759839182167!5m2!1sen!2sin"
                className="w-full h-full rounded-lg min-h-[280px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Decorom location on Google Maps"
              />
            </div>

            {/* Contact Form */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Get In Touch</h3>
              <form
                ref={formRef}
                onSubmit={sendEmail}
                className="space-y-4 flex-1 flex flex-col"
              >
                {/* Anti-Spam Honeypot Input */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website_hp_field"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="user_name" className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                      Name <span className="text-[#E59500]">*</span>
                    </label>
                    <input
                      id="user_name"
                      type="text"
                      name="user_name"
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500] outline-none text-[#2C3E50] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="user_phone" className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                      Phone <span className="text-[#E59500]">*</span>
                    </label>
                    <input
                      id="user_phone"
                      type="tel"
                      name="user_phone"
                      onChange={handlePhoneChange}
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500] outline-none text-[#2C3E50] transition-colors"
                      required
                    />
                    {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="user_email" className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                    Email <span className="text-[#E59500]">*</span>
                  </label>
                  <input
                    id="user_email"
                    type="email"
                    name="user_email"
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500] outline-none text-[#2C3E50] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500] outline-none text-[#2C3E50] transition-colors"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label htmlFor="message" className="block text-xs font-bold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                    Message / Details <span className="text-[#E59500]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#E59500] focus:border-[#E59500] outline-none text-[#2C3E50] resize-none flex-1 transition-colors"
                    required
                  />
                </div>

                {/* Inline feedback */}
                {status === "success" && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message sent! We'll get back to you within 24 hours.
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Failed to send. Please try WhatsApp or email us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-white hover:bg-[#E59500] text-[#E59500] hover:text-white border border-[#E59500] font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md active:scale-95 mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E59500]"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
