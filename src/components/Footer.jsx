import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-yellow-100 text-black mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        {/* Contact / Address Section */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <p className="flex items-center gap-2 justify-center md:justify-start">
            <FaEnvelope className="text-black" />{" "}
            <a
              href="mailto:decorom213@gmail.com"
              className="hover:text-yellow-600 transition-colors"
            >
              decorom213@gmail.com
            </a>
          </p>
          <p className="flex items-center gap-2 justify-center md:justify-start">
            <FaPhoneAlt className="text-black" />{" "}
            <a
              href="tel:+919016707658"
              className="hover:text-yellow-600 transition-colors"
            >
              +91 9016707658
            </a>
          </p>
          <p className="flex items-center gap-2 justify-start">
            <FaMapMarkerAlt className="text-black flex-shrink-0" />
            <span>Shop No. 2, Ruchir Apartment, Ahmedabad</span>
          </p>
        </div>

        {/* Categories Section */}
        <div className="flex-1 space-y-3 text-center">
          <h3 className="text-lg font-semibold">Categories</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="/nameplate"
                className="hover:text-yellow-600 hover:underline transition-colors"
              >
                Name Plate
              </a>
            </li>
            <li>
              <a
                href="/commercial"
                className="hover:text-yellow-600 hover:underline transition-colors"
              >
                Commercial
              </a>
            </li>
            <li>
              <a
                href="/interior"
                className="hover:text-yellow-600 hover:underline transition-colors"
              >
                Interior
              </a>
            </li>
            <li>
              <a
                href="/radium"
                className="hover:text-yellow-600 hover:underline transition-colors"
              >
                Radium
              </a>
            </li>
            <li>
              <a
                href="/banner"
                className="hover:text-yellow-600 hover:underline transition-colors"
              >
                Banner
              </a>
            </li>
            <li>
              <a
                href="/safety"
                className="hover:text-yellow-600 hover:underline transition-colors"
              >
                Safety
              </a>
            </li>
            <li>
              <a
                href="/film"
                className="hover:text-yellow-600 hover:underline transition-colors"
              >
                Film
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="flex-1 space-y-3 text-center md:text-center">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex flex-col space-y-2 items-center md:items-center">
            <a
              href="https://wa.me/9016707658"
              className="flex items-center gap-2 hover:text-green-600 transition-colors"
            >
              <FaWhatsapp className="text-black" /> +91 9016707658
            </a>
            <a
              href="https://instagram.com/decorom.in"
              className="flex items-center gap-2 hover:text-pink-600 transition-colors"
            >
              <FaInstagram className="text-black" /> @decorom.in
            </a>
            <a
              href="https://facebook.com/decoromindia"
              className="flex items-center gap-2 hover:text-blue-700 transition-colors"
            >
              <FaFacebookF className="text-black" /> Decorom India
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-yellow-200 text-black text-center py-4 mt-6">
        <p>&copy; 2025 Decorom Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
