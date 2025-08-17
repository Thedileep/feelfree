import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import HomeNavbar from "../components/Navbar/HomeNavbar";
import Body from "./Body";
import FeaturesSection from "../components/Features";
import Lenis from "@studio-freight/lenis";

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTherapistMenu, setShowTherapistMenu] = useState(false);
  const sectionsRef = useRef([]);

  const closeMenus = () => {
    setShowUserMenu(false);
    setShowTherapistMenu(false);
    setMobileMenuOpen(false);
  };

 useEffect(() => {
  // ✅ Lenis smooth scroll setup
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ✅ IntersectionObserver for animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        } else {
          entry.target.classList.remove("animate");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -10% 0px", 
    }
  );

  sectionsRef.current.forEach((sec) => sec && observer.observe(sec));

  return () => {
    sectionsRef.current.forEach((sec) => sec && observer.unobserve(sec));
  };
}, []);


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

      {/* Body Section */}
      <div
        ref={(el) => (sectionsRef.current[0] = el)}
        className="opacity-0 translate-y-10 transition-all duration-500 sm:duration-700"
      >
        <Body />
      </div>

      {/* Features Section */}
      <div
        ref={(el) => (sectionsRef.current[1] = el)}
        className="opacity-0 translate-y-10 transition-all duration-500 sm:duration-700"
      >
        <FeaturesSection />
      </div>

      {/* Testimonial Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="opacity-0 translate-y-10 transition-all duration-500 sm:duration-700 py-16 px-8 bg-indigo-50 dark:bg-gray-800 text-center"
      >
        <p className="text-xl italic">
          “FeelFree has been my emotional lifeline — a safe space without
          judgement, anytime I needed it.”
        </p>
        <p className="font-semibold text-indigo-600 dark:text-indigo-400">
          — A Satisfied Member
        </p>
      </section>

      {/* Footer */}
      <div
        ref={(el) => (sectionsRef.current[3] = el)}
        className="opacity-0 translate-y-10 transition-all duration-500 sm:duration-700"
      >
        <Footer />
      </div>
    </div>
  );
};

export default Home;
