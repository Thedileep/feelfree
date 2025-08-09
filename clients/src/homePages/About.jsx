import React from "react";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <>
      <section className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-xl text-gray-800 dark:bg-gray-900 dark:text-gray-100 my-12">
        <h1 className="text-5xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 tracking-wide">
          About Us
        </h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <p className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg border-l-8 border-indigo-500">
            FeelFree is a mental health and wellness platform designed to provide a safe, supportive digital space where users can track their moods, journal their thoughts, chat anonymously with an AI companion, and listen to soothing music.
          </p>

          <p className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg border-l-8 border-indigo-500">
            I, <strong className="font-semibold">Dileep Yadav</strong>, developed this project as an ongoing effort to create accessible mental health tools for everyone. Although the platform is currently live and functional, many exciting new features are still in development to make the experience even more helpful and personalized.
          </p>

          <p className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg border-l-8 border-indigo-500">
            At FeelFree, we believe that mental well-being is just as important as physical health. Users can consult with licensed doctors regarding physical ailments or connect with therapists for mental health support. Our mission is to empower users to take charge of their emotional and physical wellness with ease and privacy.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
