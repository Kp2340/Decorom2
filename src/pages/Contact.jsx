import React, { useRef } from "react";
import emailjs from "emailjs-com";

const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_6f1m0vg", // Your Service ID
        "template_6i1vxdl", // Your EmailJS template ID
        form.current,
        "O3-Z2OeVM5bXRKscz" // Your Public Key
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("✅ Message sent successfully!");
          e.target.reset();
        },
        (error) => {
          console.error(error.text);
          alert("❌ Failed to send message. Please try again.");
        }
      );
  };

  return (
    <section className="bg-pink-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800">Contact Us</h1>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {/* Phone */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-yellow-200 flex items-center justify-center rounded-lg mx-auto mb-4 text-2xl">
              📞
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
            <p className="mt-2 text-gray-600">+91 9016707658</p>
          </div>

          {/* Address */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-yellow-200 flex items-center justify-center rounded-lg mx-auto mb-4 text-2xl">
              📍
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Address</h3>
            <p className="mt-2 text-gray-600">Decorom, Shop-2, Under Ruchir Apartment,</p>
            <p className="mt-2 text-gray-600">Near Nilkanth Mahadev Temple,</p>
            <p className="mt-2 text-gray-600">Ghatlodia, Ahmedabad, PIN-380061</p>
          </div>

          {/* Email */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-yellow-200 flex items-center justify-center rounded-lg mx-auto mb-4 text-2xl">
              ✉️
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            <p className="mt-2 text-gray-600">decorom213@gmail.com</p>
          </div>
        </div>

        {/* Map + Contact Form */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Google Map */}
          <div className="flex-1 w-full md:w-1/2 h-64 md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.7572500876954!2d72.5503355!3d23.0693596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4f84568c88347905%3A0x54150044f7285f73!2sDecorom!5e0!3m2!1sen!2sin!4v1759839182167!5m2!1sen!2sin"
              className="w-full h-full rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              // loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Contact Form */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-4 flex-1 flex flex-col">
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
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none resize-none"
                required
              ></textarea>

              <button
                type="submit"
                className="w-fullbg-green-500 text-white font-medium py-3 rounded-md hover:bg-green-600 transition-colors mt-auto"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
