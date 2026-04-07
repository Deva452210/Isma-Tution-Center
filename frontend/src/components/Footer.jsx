import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Our Offerings</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Bank Courses</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">SSC Courses</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">TNPSC Courses</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Railways Courses</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Our Story</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Free Mock Tests</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Books</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Downloads</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-brand transition-colors"><FaFacebook className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-brand transition-colors"><FaInstagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-brand transition-colors"><FaLinkedin className="w-5 h-5" /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-brand transition-colors"><FaYoutube className="w-5 h-5" /></a>
            </div>
            <h4 className="font-semibold mb-2">Our App</h4>
            <div className="flex space-x-2">
              {/* Placeholders for App Store buttons */}
              <div className="w-32 h-10 bg-gray-800 rounded flex items-center justify-center text-xs">Google Play</div>
              <div className="w-32 h-10 bg-gray-800 rounded flex items-center justify-center text-xs">App Store</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">© 2024 Veranda RACE. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-500">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4">
        <a href="https://wa.me/919043303030" target="_blank" rel="noreferrer" className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
        <a href="tel:+919043303030" className="w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform md:hidden">
          <Phone className="w-6 h-6 text-white" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
