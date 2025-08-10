import React, { useState } from "react";
import Footer from "../components/Footer";
import HomeNavbar from "../components/Navbar/HomeNavbar";
import Body from "./Body";
import FeaturesSection from "../components/Features";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTherapistMenu, setShowTherapistMenu] = useState(false);

  const closeMenus = () => {
    setShowUserMenu(false);
    setShowTherapistMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <HomeNavbar
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        showTherapistMenu={showTherapistMenu}
        setShowTherapistMenu={setShowTherapistMenu}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        closeMenus={closeMenus}
      />
      <Body />
      <FeaturesSection />
      <section className="py-16 px-8 bg-indigo-50 dark:bg-gray-800 text-center">
        <p className="text-xl italic">
          “FeelFree has been my emotional lifeline — a safe space without judgement, anytime I needed it.”
        </p>
        <p className="font-semibold text-indigo-600 dark:text-indigo-400">— A Satisfied Member</p>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
