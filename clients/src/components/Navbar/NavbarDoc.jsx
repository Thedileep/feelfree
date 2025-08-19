import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NavbarDoc = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("therapistToken");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("therapistToken");
    setIsLoggedIn(false);
    setMenuOpen(false);
    toast.success('Successfully Logout',{autoClose:2000})
    navigate("/login/therapist");
  };

  const renderAuthButton = (isMobile = false) => {
    if (isLoggedIn) {
      return (
        <button
          onClick={handleLogout}
          className={`${isMobile ? "block" : "hidden md:block"} bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition`}
        >
          Logout
        </button>
      );
    } else {
      const isLoginPage = location.pathname.includes("/login/therapist");
      return (
        <Link
          to={isLoginPage ? "/register/therapist" : "/login/therapist"}
          onClick={() => setMenuOpen(false)}
          className={`${isMobile ? "block" : "hidden md:block"} bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition`}
        >
          {isLoginPage ? "Register" : "Login"}
        </Link>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-indigo-600" onClick={() => setMenuOpen(false)}>
        FeelFree
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
        <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
        <li><Link to="/about-us" className="hover:text-indigo-600">About</Link></li>
        <li><Link to="/services" className="hover:text-indigo-600">Services</Link></li>
        <li><Link to="/contact-us" className="hover:text-indigo-600">Contact</Link></li>
      </ul>

      {/* Desktop Auth Button */}
      {renderAuthButton()}

      {/* Mobile Hamburger */}
      <div className="md:hidden" onClick={() => setMenuOpen(prev => !prev)}>
        <svg className="w-6 h-6 text-gray-700 cursor-pointer" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">About</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Services</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-indigo-600">Contact</Link>
          {renderAuthButton(true)}
        </div>
      )}
    </nav>
  );
};

export default NavbarDoc;
