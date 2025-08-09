// src/pages/NotFound.jsx
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Invalid Route</h1>
      <p className="text-lg text-gray-700 mb-6">Oops! The page you’re looking for doesn't exist.</p>
  {/* <iframe
      width="420"
      height="340"
      src="https://www.youtube.com/embed/i2_KvAi8h4M?autoplay=1&mute=0"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      class="rounded shadow"
    /> */}



    </div>
  );
};

export default NotFound;
