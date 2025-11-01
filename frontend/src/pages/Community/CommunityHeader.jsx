import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { name: "📢 Announcements", path: "/AnnouncementsPage" },
  { name: "🎧 Listen & Learn", path: "/ListenLearnPage" },
  { name: "💬 Reach Out", path: "/ReachOutPage" },
];

const CommunityHeader = () => {
  const location = useLocation();

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-100 flex flex-wrap justify-center gap-3">
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isActive
                ? "bg-blue-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-blue-50"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
};

export default CommunityHeader;
