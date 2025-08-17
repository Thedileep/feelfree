import React from "react";
import { Link } from "react-router-dom";

const SidebarDoc = ({ selected, setSelected, handleLogout }) => {
  const menuItems = [
    { key: "home", label: "Home", link: "/" },
    { key: "appointments", label: "Appointments" },
    { key: "profile", label: "Profile" },
    { key: "password", label: "Change Password" },
  ];

  return (
    <div className="bg-indigo-700 text-white min-h-screen p-6 w-full sm:w-64 flex flex-col">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-8 sm:mb-8 sticky top-0 bg-indigo-700 py-2">
        FeelFree
      </h1>

      {/* Menu */}
      <ul className="space-y-4 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <li key={item.key}>
            {item.link ? (
              <Link
                to={item.link}
                className={`block w-full text-left py-2 px-3 rounded-lg transition ${
                  selected === item.key
                    ? "bg-indigo-500"
                    : "hover:bg-indigo-600"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <button
                onClick={() => setSelected(item.key)}
                className={`w-full text-left py-2 px-3 rounded-lg transition ${
                  selected === item.key
                    ? "bg-indigo-500"
                    : "hover:bg-indigo-600"
                }`}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-8 w-full bg-red-500 hover:bg-red-600 py-2 px-3 rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
};

export default SidebarDoc;