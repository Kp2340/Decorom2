import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_WHATSAPP_URL,
  GOOGLE_MAPS_REVIEWS_URL,
} from "../constants/contact";

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Footer = () => (
  <footer className="bg-yellow-100 text-black mt-16">
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

      {/* Column 1 — Contact Us */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Contact Us</h3>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="flex items-center gap-2 hover:text-yellow-600 transition-colors"
        >
          <Mail className="w-4 h-4 shrink-0" />
          <span className="break-all">{CONTACT_EMAIL}</span>
        </a>
        <a
          href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
          className="flex items-center gap-2 hover:text-yellow-600 transition-colors"
        >
          <Phone className="w-4 h-4 shrink-0" />
          <span>{CONTACT_PHONE}</span>
        </a>
        <a
          href={GOOGLE_MAPS_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-2 hover:text-yellow-600 transition-colors"
        >
          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Ghatlodiya, Ahmedabad, Gujarat</span>
        </a>
      </div>

      {/* Column 2 — Quick Links */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link to="/" className="hover:text-yellow-600 hover:underline transition-colors">Home</Link></li>
          <li><Link to="/products" className="hover:text-yellow-600 hover:underline transition-colors">All Products</Link></li>
          <li><Link to="/customers" className="hover:text-yellow-600 hover:underline transition-colors">Happy Customers</Link></li>
          <li><Link to="/custom-design" className="hover:text-yellow-600 hover:underline transition-colors">Custom Design</Link></li>
          <li><Link to="/about" className="hover:text-yellow-600 hover:underline transition-colors">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-600 hover:underline transition-colors">Contact Us</Link></li>
        </ul>
      </div>

      {/* Column 3 — Policies */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Policies</h3>
        <ul className="space-y-2">
          <li><Link to="/privacy" className="hover:text-yellow-600 hover:underline transition-colors">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-yellow-600 hover:underline transition-colors">Terms &amp; Conditions</Link></li>
          <li><Link to="/refund-policy" className="hover:text-yellow-600 hover:underline transition-colors">Refund Policy</Link></li>
          <li><Link to="/shipping-policy" className="hover:text-yellow-600 hover:underline transition-colors">Shipping Policy</Link></li>
        </ul>
      </div>

      {/* Column 4 — Follow Us */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Follow Us</h3>
        <div className="flex flex-col space-y-2">
          <a
            href={CONTACT_WHATSAPP_URL("Hi, I'm interested in a custom nameplate!")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-green-600 transition-colors"
          >
            <WhatsappIcon /> {CONTACT_PHONE}
          </a>
          <a
            href="https://instagram.com/decorom.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-pink-600 transition-colors"
          >
            <InstagramIcon /> @decorom.in
          </a>
          <a
            href="https://facebook.com/decoromindia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-blue-700 transition-colors"
          >
            <FacebookIcon /> Decorom
          </a>
        </div>
      </div>

    </div>

    {/* Footer Bottom */}
    <div className="bg-yellow-200 text-black text-center py-4 text-sm space-y-1">
      <p>&copy; {new Date().getFullYear()} Decorom. All Rights Reserved.</p>
      <p className="text-sm text-gray-600">
        Made with <span className="text-red-500 text-base">♥</span> by{" "}
        <a
          href="https://zendadigitalsolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 font-medium transition-colors"
        >
          Zenda Digital Solutions
        </a>
      </p>
    </div>
  </footer>
);

export default Footer;
