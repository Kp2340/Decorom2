import React from "react";

const ContactUs = () => {
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
            <p className="mt-2 text-gray-600">
              Decorom, Shop-2, Under Ruchir Apartment,
            </p>
            <p className="mt-2 text-gray-600">
              Near Nilkanth Mahadev Temple,
            </p><p className="mt-2 text-gray-600">
              Ghatlodia, Ahmedabad, PIN-380061
            </p>
          </div>

          {/* Email */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-yellow-200 flex items-center justify-center rounded-lg mx-auto mb-4 text-2xl">
              ✉️
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Email</h3>
            <p className="mt-2 text-gray-600">info@decorom.in</p>
          </div>
        </div>

        {/* Map + Contact Form */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Google Map */}
          <div className="flex-1 h-80 md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d58749.67861993453!2d72.53280477873354!3d23.029098767046854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sShop%20No.%202%2C%20Ruchir%20Apartment%2C%20Ahmedabad!5e0!3m2!1sen!2sin!4v1759661526025!5m2!1sen!2sin"
              className="w-full h-full rounded-lg shadow-md border-0"
              allowFullScreen
              // loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Contact Form */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
            <form className="space-y-4 flex-1 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none"
              />
              <textarea
                placeholder="Message"
                rows="4"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-pink-400 outline-none resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600 transition-colors mt-auto"
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
