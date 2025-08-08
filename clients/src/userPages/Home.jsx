import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Pencil,
  BookOpen,
  Bot,
  Music,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTherapistMenu, setShowTherapistMenu] = useState(false);

  const features = [
    { icon: <Pencil size={32} />, title: "Mood Tracker", desc: "Log daily feelings & see your emotional trends.",onClick: () => navigate("/mood-tracker") },
    { icon: <BookOpen size={32} />, title: "Daily Journal", desc: "Free expression. Your thoughts, your space.", onClick: () => navigate("/journal") },
    { icon: <Bot size={32} />, title: "AI ChatBuddy", desc: "Anonymous, supportive AI conversation anytime.", onClick: () => navigate("/chat") },
    { icon: <Music size={32} />, title: "Soothing Music", desc: "Heal with calm sounds curated for you." },
    { icon: <Lightbulb size={32} />, title: "Mindful Tips", desc: "Daily mental health guidance & reminders." },
    { icon: <ShieldCheck size={32} />, title: "Private & Secure", desc: "Encrypted data — only you can access." },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      
      {/* NAVBAR */}
      <nav className="flex justify-between items-center py-6 px-8 shadow-md bg-white dark:bg-gray-800 sticky top-0 z-50">
        <h1 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">FeelFree</h1>
        <div className="space-x-6 flex items-center">

          {/* USER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu((prev) => !prev);
                setShowTherapistMenu(false);
              }}
              className="font-medium hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400"
            >
              User
            </button>
            {showUserMenu && (
              <div className="absolute bg-white dark:bg-gray-700 border rounded shadow-md mt-2 z-10">
                <Link
                  to="/login/user"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Login
                </Link>
                <Link
                  to="/register/user"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* THERAPIST DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTherapistMenu((prev) => !prev);
                setShowUserMenu(false);
              }}
              className="font-medium hover:text-indigo-600 dark:text-gray-100 dark:hover:text-indigo-400"
            >
              Therapist
            </button>
            {showTherapistMenu && (
              <div className="absolute bg-white dark:bg-gray-700 border rounded shadow-md mt-2 z-10">
                <Link
                  to="/login/therapist"
                  onClick={() => setShowTherapistMenu(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Login
                </Link>
                <Link
                  to="/register/therapist"
                  onClick={() => setShowTherapistMenu(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between py-20 px-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700">
        {/* Background SVG blob */}
        <div className="absolute -top-20 -left-20 z-0 opacity-20 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#c4b5fd"
              d="M41.8,-58.5C54.2,-52.1,64.5,-41.2,66.1,-28.9C67.7,-16.6,60.7,-2.9,56.3,10.8C51.9,24.5,50.2,38.2,42.5,48.2C34.9,58.1,21.4,64.4,6.7,66.3C-8,68.1,-24,65.4,-33.7,56.6C-43.4,47.7,-46.9,32.6,-52.3,18.6C-57.7,4.5,-64.9,-8.4,-60.9,-18.9C-56.9,-29.4,-41.8,-37.6,-28.5,-43.2C-15.3,-48.8,-3.8,-51.7,9.4,-62.3C22.7,-72.9,37.6,-91.4,41.8,-58.5Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 space-y-6 z-10"
        >
          <h2 className="text-5xl font-extrabold text-indigo-800 dark:text-indigo-300 leading-tight">
            A peaceful place<br />for your mind.
          </h2>
          <p className="text-lg leading-relaxed">
            FeelFree is your digital sanctuary. Journal, track emotions, chat with our AI buddy, and listen to serene tunes—without judgment. <br />
            <span className="font-semibold">Feel safe. Feel heard. Feel free.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register/user" className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition shadow">
              I'm a User
            </Link>
            <Link to="/register/therapist" className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition shadow">
              I'm a Therapist
            </Link>
            <Link to="/login/user" className="px-6 py-3 bg-white dark:bg-gray-800 border border-indigo-600 text-indigo-600 dark:text-indigo-300 font-semibold rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition">
              I Have an Account
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 mb-10 md:mb-0 flex justify-center z-10"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/4326/4326483.png" alt="Calming illustration" className="w-80 max-w-full" />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-8">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
          All the Care in One Place
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-16 px-8 bg-indigo-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <p className="text-xl italic">“FeelFree has been my emotional lifeline — a safe space without judgement, anytime I needed it.”</p>
          <p className="font-semibold text-indigo-600 dark:text-indigo-400">— A Satisfied Member</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-gray-900 text-white text-center text-sm">
        <p>&copy; {new Date().getFullYear()} FeelFree. All rights reserved.</p>
        <p className="mt-1">Made with ❤️ for your mental well-being.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col items-center text-center transition cursor-pointer"
  >
    <div className="mb-4 text-indigo-600 dark:text-indigo-400">{icon}</div>
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p>{desc}</p>
  </motion.div>
);

export default Home;
