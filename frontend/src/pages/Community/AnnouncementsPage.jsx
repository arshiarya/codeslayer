import React from "react";
import { Megaphone } from "lucide-react";
import CommunityHeader from "./CommunityHeader";

const AnnouncementsPage = () => {
  const announcements = [
    { id: 1, title: "New Wellness Workshops", detail: "Join our weekly group therapy sessions for stress relief and mindfulness." },
    { id: 2, title: "Exam Week Support", detail: "Extra counsellor slots added this month to help you through exam stress." },
    { id: 3, title: "Self-Care Sunday Event", detail: "Participate in art therapy and relaxation activities this Sunday!" },
  ];

  return (
    <div className="p-6">
      <CommunityHeader activeTab="Announcements" />
      <h2 className="text-2xl font-semibold text-[#000459] mb-4 flex items-center gap-2">
        <Megaphone className="w-6 h-6 text-blue-500" /> Latest Announcements
      </h2>
      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-white p-4 rounded-xl shadow hover:shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">{a.title}</h3>
            <p className="text-gray-600 mt-1">{a.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
