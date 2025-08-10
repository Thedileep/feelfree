import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Body = () => {
  return (
    <section className="relative flex flex-col-reverse md:flex-row items-center justify-between py-20 px-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700">
      {/* Background SVG blob */}
      <div className="absolute -top-20 -left-20 z-0 opacity-20 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 200 200">
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
        <img
          src="/feelfreelogo.png"
          alt="Mindfulness illustration"
          className="w-60 h-60 rounded-full object-cover border-2 border-gray-300"
        />
      </motion.div>
    </section>
  );
};

export default Body;
