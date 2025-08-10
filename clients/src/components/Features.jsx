import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Pencil,
  BookOpen,
  Bot,
  Music,
  Lightbulb,
  ShieldCheck,
  Star,
  HeartHandshake,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Calendar size={32} />,
    title: "Book Scheduling",
    desc: "Book an appointment with a therapist at your convenience.",
    link: "/select-doctor",
  },
  {
    icon: <Pencil size={32} />,
    title: "Mood Tracker",
    desc: "Log daily feelings & track your emotional well-being.",
    link: "/mood-tracker",
  },
  {
    icon: <BookOpen size={32} />,
    title: "Daily Journal",
    desc: "Express yourself freely in a secure personal journal.",
    link: "/journal",
  },
  {
    icon: <Bot size={32} />,
    title: "AI ChatBuddy",
    desc: "Get anonymous and supportive AI conversation anytime.",
    link: "/chat",
  },
  {
    icon: <Music size={32} />,
    title: "Soothing Music",
    desc: "Heal your mind with curated calming sounds.",
  },
  {
    icon: <Lightbulb size={32} />,
    title: "Mindful Tips",
    desc: "Daily mental health guidance & reminders to keep you balanced.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Private & Secure",
    desc: "Your data is encrypted and accessible only to you.",
  },
];

const therapists = [
  {
    name: "Dr. Ayesha Yadav",
    experience: "10+ Years",
    rating: 4.9,
    specialty: "Cognitive Behavioral Therapy",
  },
  {
    name: "Dr. Rohan Mehta",
    experience: "8+ Years",
    rating: 4.8,
    specialty: "Stress & Anxiety Management",
  },
  {
    name: "Dr. Sarah Kapoor",
    experience: "12+ Years",
    rating: 5.0,
    specialty: "Relationship & Emotional Well-being",
  },
];

const FeatureCard = ({ icon, title, desc, link }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => link && navigate(link)}
      className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer"
    >
      <div className="mb-4 text-indigo-600 dark:text-indigo-400">{icon}</div>
      <h4 className="text-lg sm:text-xl font-semibold mb-2">{title}</h4>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
        {desc}
      </p>
    </motion.div>
  );
};

const TherapistCard = ({ name, experience, rating, specialty }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
      <h4 className="text-lg font-semibold mb-1">{name}</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-1">
        Experience: {experience}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Specialty: {specialty}
      </p>
      <div className="flex items-center gap-1 text-yellow-500">
        <Star size={18} fill="currentColor" />
        <span>{rating}</span>
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <div className="dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="py-20 px-6 sm:px-8 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6"
        >
          Your Mental Wellness, Simplified
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl mb-8 text-white/90"
        >
          Connect with professional therapists, AI tools, and mindfulness
          resources — anytime, anywhere, securely.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => (window.location.href = "/select-doctor")}
          className="bg-white text-indigo-600 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg hover:bg-gray-100"
        >
          Get Started
        </motion.button>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 sm:px-8 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          Our Mission
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Mental health is just as important as physical health — yet it is
          often neglected. Our platform aims to change that by making mental
          health care accessible, affordable, and stigma-free.
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          With advanced algorithms, we help you connect to the most suitable
          therapist based on your needs, preferences, and comfort. From booking
          an appointment to keeping a daily journal, everything is designed to
          make your journey to mental wellness easier.
        </p>
      </section>

      {/* Therapist Section */}
      <section className="py-20 px-6 sm:px-8 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
          Meet Our Top-Rated Therapists
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {therapists.map((t, i) => (
            <TherapistCard key={i} {...t} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-8 bg-white dark:bg-gray-900">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
          All the Care in One Place
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 sm:px-8 text-center bg-indigo-600 text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Ready to Take Care of Your Mind?
        </h2>
        <p className="mb-8 text-base sm:text-lg max-w-xl mx-auto text-white/90">
          Join thousands of users improving their mental well-being with our
          trusted therapists, AI tools, and mindfulness resources.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => (window.location.href = "/register/user")}
          className="bg-white text-indigo-600 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg hover:bg-gray-100"
        >
          Sign Up Now
        </motion.button>
      </section>
    </div>
  );
};

export default FeaturesSection;
