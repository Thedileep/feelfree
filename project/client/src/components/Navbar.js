import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">FeelFree</Link>

      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
        <li><Link to="/features" className="hover:text-blue-600">Features</Link></li>
        <li><Link to="/mood-tracker" className="hover:text-blue-600">Mood Tracker</Link></li>
        <li><Link to="/community" className="hover:text-blue-600">Community</Link></li>
        <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
      </ul>

      <Link to="/login" className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Login
      </Link>

      <div className="md:hidden">
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;
