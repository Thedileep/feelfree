import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer';

const Features = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-6 py-16">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Our Features</h1>
        <p className="text-gray-700">Details about mood tracking, journaling, and more will go here.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
