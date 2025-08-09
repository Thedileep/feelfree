import React from "react";
import Footer from "../components/Footer";

const Pricing = () => {
  return (
    <>
      <section className="max-w-3xl mx-auto p-10 bg-white rounded-xl shadow-lg my-16 dark:bg-gray-900 dark:text-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-400 text-center">
          Pricing
        </h2>

        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300 text-center">
          FeelFree platform is completely <strong>free</strong> to use — you can journal, track moods, chat with our AI buddy, and listen to calming music at no cost.
        </p>

        <p className="mb-6 text-lg text-gray-700 dark:text-gray-300 text-center">
          However, <strong>consultations with therapists or doctors</strong> will have charges applied as per their individual fees.
        </p>

        <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg shadow-inner text-center">
          <p className="text-indigo-800 dark:text-indigo-300 font-semibold text-lg">
            * Please check the therapist's profile for specific consultation fees before booking.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Pricing;
