import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          {/* About Us */}
          <div>
            <h3 className="text-base sm:text-xl font-bold font-serif text-accent mb-3 sm:mb-4 tracking-wide">About Us</h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Vinayaka Oils is dedicated to bringing natural, pure, and healthy cooking oils to your kitchen. Extracted traditionally to preserve nutrition and goodness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-xl font-bold font-serif text-accent mb-3 sm:mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Home</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Shop</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">About Us</Link></li>
              <li><Link to="/oils" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Our Oils</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base sm:text-xl font-bold font-serif text-accent mb-3 sm:mb-4 tracking-wide">Customer Service</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Returns & Refunds</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition text-xs sm:text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-base sm:text-xl font-bold font-serif text-accent mb-3 sm:mb-4 tracking-wide">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+91 95661 19003</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <a href="mailto:info@vinayakaoils.com" className="hover:text-white transition">info@vinayakaoils.com</a>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1">📍</span>
                <span>Thanthonimalai, Karur, Tamil Nadu</span>
              </li>
            </ul>
            
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs text-gray-400">
          <p>© 2026 Vinayaka Oils. All rights are reserved by team UnitaryX</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
