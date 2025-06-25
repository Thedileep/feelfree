// 📄 client/src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="min-h-screen flex flex-col">
    {/* NAVBAR */}
    <nav className="flex justify-between items-center py-6 px-8">
      <h1 className="text-3xl font-bold text-indigo-600">FeelFree</h1>
      <div className="space-x-6">
        <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
        <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
        <Link
          to="/register"
          className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
      </div>
    </nav>

    {/* HERO */}
    <section className="flex flex-col-reverse md:flex-row items-center justify-between py-16 px-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-5xl font-extrabold text-indigo-800 leading-tight">
          A peaceful place<br />for your mind.
        </h2>
        <p className="text-gray-800 text-lg leading-relaxed">
          FeelFree is your digital sanctuary. Journal, track emotions, chat with our AI buddy, and listen to serene tunes—without judgment. <br />
          <span className="font-semibold">Feel safe. Feel heard. Feel free.</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-full hover:bg-pink-600 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition"
          >
            I Have an Account
          </Link>
        </div>
      </div>
      <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4326/4326483.png"
          alt="Calming illustration"
          className="w-80 max-w-full"
        />
      </div>
    </section>

     

    {/* FEATURE CARDS */}
    <section className="py-20 px-8">
      <h3 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
        All the Care in One Place
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((f, i) => <FeatureCard key={i} {...f} />)}
      </div>
    </section>

    {/* TESTIMONIAL */}
    <section className="py-16 px-8 bg-indigo-50">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <p className="text-xl italic text-gray-800">“FeelFree has been my emotional lifeline — a safe space without judgement, anytime I needed it.”</p>
        <p className="font-semibold text-indigo-600">— A Satisfied Member</p>
      </div>
      
    </section>

    {/* FOOTER */}
    <footer className="py-8 bg-gray-900 text-white text-center text-sm">
      <p>&copy; {new Date().getFullYear()} FeelFree. All rights reserved.</p>
      <p className="mt-1">Made with ❤️ for your mental well-being.</p>
    </footer>
  </div>
);

const features = [
  { icon: "📝", title: "Mood Tracker", desc: "Log daily feelings & see your emotional trends." },
  { icon: "📓", title: "Daily Journal", desc: "Free expression. Your thoughts, your space." },
  { icon: "🤖", title: "AI ChatBuddy", desc: "Anonymous, supportive AI conversation anytime." },
  { icon: "🎶", title: "Soothing Music", desc: "Heal with calm sounds curated for you." },
  { icon: "💡", title: "Mindful Tips", desc: "Daily mental health guidance & reminders." },
  { icon: "🔒", title: "Private & Secure", desc: "Encrypted data — only you can access." },
];

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
    <p className="text-gray-600">{desc}</p>
  </div>
  
);

export default Home;
