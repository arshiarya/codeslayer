import React, { useState } from "react";
import { Send } from "lucide-react";
import CommunityHeader from "./CommunityHeader";

const ReachOutPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim() !== "") {
      setMessages([...messages, message]);
      setMessage("");
    }
  };

  return (
    <div className="p-6">
      <CommunityHeader activeTab="Reach Out" />
      <h2 className="text-2xl font-semibold text-[#000459] mb-4">Reach Out to the Community</h2>

      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No messages yet. Start the conversation!</p>
          ) : (
            messages.map((msg, i) => (
              <p key={i} className="bg-blue-50 p-2 rounded-lg text-gray-700">{msg}</p>
            ))
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReachOutPage;
