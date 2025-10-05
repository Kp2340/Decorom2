import Nameplate from '../pages/categories/Nameplate';
import Banner from '../pages/categories/Banner';
import Radium from '../pages/categories/Radium';
import Commercial from '../pages/categories/Commercial';
import Interior from '../pages/categories/Interior';
import Film from '../pages/categories/Film';
import Safety from '../pages/categories/Safety';
const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Contact / Address Section */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
          <p>Email: <a href="mailto:info@decorom.in" className="text-pink-500 hover:underline">info@decorom.in</a></p>
          <p>Phone: <a href="tel:+919016707658" className="text-pink-500 hover:underline">+91 9016707658</a></p>
          <p>Address: <a href="https://maps.app.goo.gl/XpEJbMmDA61P7BHh9" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Shop No. 2, Ruchir Apartment, Ahmedabad</a></p>
        </div>

        {/* Categories Section */}
        <div className="flex-1 space-y-3 text-center">
          <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
          <ul className="space-y-1">
            <li><a href="/nameplate" className="hover:text-pink-500 transition-colors">Name Plate</a></li>
            <li><a href="/banner" className="hover:text-pink-500 transition-colors">Banner</a></li>
            <li><a href="/radium" className="hover:text-pink-500 transition-colors">Radium</a></li>
            <li><a href="/commercial" className="hover:text-pink-500 transition-colors">Commercial</a></li>
            <li><a href="/interior" className="hover:text-pink-500 transition-colors">Interior</a></li>
            <li><a href="/film" className="hover:text-pink-500 transition-colors">Film</a></li>
            <li><a href="/safety" className="hover:text-pink-500 transition-colors">Safety</a></li>
            {/*<li><a href="" className="hover:text-pink-500 transition-colors">Home</a></li>*/}
            {/*<li><a href="/products" className="hover:text-pink-500 transition-colors">Products</a></li>*/}
            {/*<li><a href="/about" className="hover:text-pink-500 transition-colors">About Us</a></li>*/}
            {/*<li><a href="/contact" className="hover:text-pink-500 transition-colors">Contact</a></li>*/}
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="flex-1 space-y-3 text-center md:text-right">
          <h3 className="text-lg font-semibold text-gray-800">Follow Us</h3>
          <div className="flex flex-col space-y-2 items-center md:items-end">
            <a href="https://wa.me/9016707658" className="flex items-center gap-2 hover:text-green-500 transition-colors">
              <i className="fab fa-whatsapp"></i> WhatsApp
            </a>
            <a href="https://instagram.com/decorom.in" className="flex items-center gap-2 hover:text-pink-500 transition-colors">
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a href="https://facebook.com/decoromindia" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <i className="fab fa-facebook"></i> Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-200 text-gray-600 text-center py-4 mt-6">
        <p>&copy; 2025 Decorom Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
