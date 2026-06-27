import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS, CONTACT_WHATSAPP_URL } from "../constants/contact";

const ContactUs = () => {
  const form = useRef();
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus("sending");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )
      .then(
        () => {
          setStatus("success");
          e.target.reset();
        },
        () => {
          setStatus("error");
        },
      );
  };

  return (
    <section className="bg-pink-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">Contact Us</h1>
          <p className="text-gray-500 mt-2 text-sm">We're happy to help — reach out anytime.</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {/* Phone */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-yellow-200 flex items-center justify-center rounded-lg mx-auto mb-4 text-2xl">
              📞
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
            <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="mt-2 text-gray-600 hover:text-pink-600 block">
              {CONTACT_PHONE}
            </a>
            <p className="mt-1 text-gray-500 text-sm">Shubh Bhavsar</p>
            <a
              href={CONTACT_WHATSAPP_URL("Hi, I have a query about a nameplate.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-green-600 hover:underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Address */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-yellow-200 flex items-center justify-center rounded-lg mx-auto mb-4 text-2xl">
              📍
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Address</h3>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">{CONTACT_ADDRESS}</p>
          </div>

          {/* Email */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center sm:col-span-2 md:col-span-1">
            <div className="w-16 h-16 bg-yellow-200 flex items-center justify-center rounded-lg mx-auto mb-4 text-2xl">
              ✉️
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 text-gray-600 hover:text-pink-600 block break-all">
              {CONTACT_EMAIL}
            </a>
            <p className="mt-2 text-gray-400 text-xs">We reply within 24 hours</p>
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
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <form
              ref={form}
              onSubmit={sendEmail}
              className="space-y-4 flex-1 flex flex-col"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="user_name"
                  placeholder="Name"
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
                  required
                />
                <input
                  type="text"
                  name="user_phone"
                  placeholder="Phone"
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
                />
              </div>
              <input
                type="email"
                name="user_email"
                placeholder="Email"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <textarea
                name="message"
                placeholder="Message"
                rows="4"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none resize-none flex-1"
                required
              />

              {/* Inline feedback */}
              {status === "success" && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Message sent! We'll get back to you within 24 hours.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Failed to send. Please try WhatsApp or email us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
