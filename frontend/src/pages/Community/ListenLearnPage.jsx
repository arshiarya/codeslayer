import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import CommunityHeader from "./CommunityHeader";

const ListenLearnPage = () => {
  const [stories, setStories] = useState([
    { id: 1, user: "USER 1", text: "I struggled with anxiety during college, but journaling helped me find balance." },
    { id: 2, user: "USER 2", text: "Sharing my experiences with others made me realize I’m not alone." },
  ]);

  return (
    <div className="p-6">
      <CommunityHeader activeTab="Listen & Learn" />
      <h2 className="text-2xl font-semibold text-[#000459] mb-4">Listen & Learn</h2>
      <div className="space-y-4">
        {stories.map(story => (
          <div key={story.id} className="bg-white p-4 rounded-xl shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-700">{story.user}</p>
              <div className="flex gap-2 text-gray-400">
                <Heart className="w-5 h-5 hover:text-pink-500 cursor-pointer" />
                <MessageCircle className="w-5 h-5 hover:text-blue-500 cursor-pointer" />
              </div>
            </div>
            <p className="text-gray-600 mt-2">{story.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListenLearnPage;
