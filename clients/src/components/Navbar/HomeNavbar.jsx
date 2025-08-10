import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const HomeNavbar = ({ showUserMenu, setShowUserMenu, showTherapistMenu, setShowTherapistMenu, mobileMenuOpen, setMobileMenuOpen, closeMenus }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1
          className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 cursor-pointer"
          onClick={() => { closeMenus(); navigate("/"); }}
        >
          FeelFree
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-indigo-600 font-medium items-center">
          <Link to="/about-us" className="hover:text-sky-300 text-sky-200">About Us</Link>
          <Link to="/contact-us" className="hover:text-sky-300 text-sky-200">Contact Us</Link>

          {/* User Dropdown */}
         <div className="relative text-sky-200 ">
            <button
             className="hover:text-sky-300 cursor-pointer"
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowTherapistMenu(false);
              }}
             
            >
              User
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 min-w-[120px]">
                <Link
                  to="/login/user"
                  onClick={closeMenus}
                  className="block px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Login
                </Link>

                <Link
                  to="/register/user"
                  onClick={closeMenus}
                  className="block px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>


          {/* Therapist Dropdown */}
          <div className="relative text-sky-200">
          <button
          className="hover:text-sky-300 cursor-pointer"
            onClick={() => {
              setShowTherapistMenu((prev) => !prev);
              setShowUserMenu(false);
            }}
          >
            Therapist
          </button>

          {showTherapistMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10 min-w-[140px]">
              <Link
                to="/login/therapist"
                onClick={closeMenus}
                 className="block px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                Login
              </Link>

              <Link
                to="/register/therapist"
                onClick={closeMenus}
                 className="block px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                Register
              </Link>
            </div>
          )}
        </div>

        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-indigo-100 dark:hover:bg-gray-700"
          onClick={() => {
            setMobileMenuOpen((prev) => !prev);
            setShowUserMenu(false);
            setShowTherapistMenu(false);
          }}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-6 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-700">
          <Link to="/about-us" onClick={closeMenus} className="block">About Us</Link>
          <Link to="/contact-us" onClick={closeMenus} className="block">Contact Us</Link>

          {/* User Mobile Dropdown */}
          <div>
            <button onClick={() => setShowUserMenu((prev) => !prev)} className="w-full text-left">
              User {showUserMenu ? "▲" : "▼"}
            </button>
            {showUserMenu && (
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/login/user" onClick={closeMenus}>Login</Link>
                <Link to="/register/user" onClick={closeMenus}>Register</Link>
              </div>
            )}
          </div>

          {/* Therapist Mobile Dropdown */}
          <div>
            <button onClick={() => setShowTherapistMenu((prev) => !prev)} className="w-full text-left">
              Therapist {showTherapistMenu ? "▲" : "▼"}
            </button>
            {showTherapistMenu && (
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/login/therapist" onClick={closeMenus}>Login</Link>
                <Link to="/register/therapist" onClick={closeMenus}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;
