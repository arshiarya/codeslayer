import React from "react";
import { NavLink } from "react-router-dom";

export default function ResourcesNav() {
  const navItems = [
    { name: "📚 Articles", path: "/ArticlesPage" },
    { name: "🎥 Videos", path: "/VideoPage" },
    { name: "🔊 Audios", path: "/AudioPage" },
  ];

  return (
    <nav className="w-[400px] mx-auto bg-white shadow-md border border-gray-200 rounded-full py-3 px-4 mt-6 mb-6">
      <div className="flex justify-between items-center space-x-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 ${
                isActive
                  ? "text-white bg-blue-600 shadow-md"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
