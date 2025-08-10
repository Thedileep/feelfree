import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-8 bg-gray-900 text-center text-sm text-white px-4">
      <div className="flex flex-wrap justify-center gap-6 font-medium mb-4">
        <Link to="/pricing" className="text-sky-200 hover:underline hover:text-gray-300 transition">Pricing</Link>
        <Link to="/privacy-policy" className="text-sky-200 hover:underline hover:text-indigo-400 transition">Privacy Policy</Link>
        <Link to="/terms-conditions" className="text-sky-200 hover:underline hover:text-indigo-400 transition">Terms & Conditions</Link>
        <Link to="/cancellation-refund" className="text-sky-200 hover:underline hover:text-indigo-400 transition">Cancellation & Refund</Link>
      </div>

      <p>&copy; {new Date().getFullYear()} FeelFree. All rights reserved.</p>
      <p className="mt-1">Made with ❤️ for your mental well-being.</p>
      <p>
        <strong className="text-indigo-600">Founder: </strong>
        <b className="text-green-600">Dileep Yadav</b>
      </p>
    </footer>
  );
};

export default Footer;
