// FeatureCard.js
import React from "react";
const DashboardCard = ({ title, description, icon, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition"
      onClick={onClick}
    >
      <div className="text-5xl mb-4 text-blue-500">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default DashboardCard;
