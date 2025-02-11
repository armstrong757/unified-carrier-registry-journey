
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="bg-[#1A1F2C] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex justify-center space-x-6 text-sm">
            <Link to="/terms" className="text-white hover:text-gray-300">
              Terms of Use
            </Link>
            <span className="text-white">·</span>
            <Link to="/privacy" className="text-white hover:text-gray-300">
              Privacy Policy
            </Link>
            <span className="text-white">·</span>
            <Link to="/refund" className="text-white hover:text-gray-300">
              Refund Policy
            </Link>
            <span className="text-white">·</span>
            <Link to="/contact" className="text-white hover:text-gray-300">
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
      <div className="bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#8E9196] text-sm mb-4">
            The information and images on this website are the property of DOT Hub LLC and may not be reproduced, reused, or appropriated without the express written consent of the owner.
          </p>
          <p className="text-[#8E9196] text-sm mb-4">
            DOT Hub, operated by DOT Hub LLC, is a private third-party provider offering services for a fee. This website serves as a commercial solicitation and advertisement.
          </p>
          <p className="text-[#8E9196] text-sm">
            We are not affiliated with any government authority such as USDOT or FMCSA.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
