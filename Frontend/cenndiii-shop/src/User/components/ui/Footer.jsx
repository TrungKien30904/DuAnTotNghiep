import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 mt-24">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Cột 1: Thông tin công ty */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-gray-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-gray-400">Contact</Link></li>
            <li><Link to="/careers" className="hover:text-gray-400">Careers</Link></li>
          </ul>
        </div>

        {/* Cột 2: Hỗ trợ khách hàng */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-gray-400">FAQs</Link></li>
            <li><Link to="/shipping" className="hover:text-gray-400">Shipping & Returns</Link></li>
            <li><Link to="/policy" className="hover:text-gray-400">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Cột 3: Mạng xã hội */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <Facebook fontSize="large" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <Instagram fontSize="large" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <Twitter fontSize="large" />
            </a>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="text-center text-gray-500 text-sm mt-8">
        &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
