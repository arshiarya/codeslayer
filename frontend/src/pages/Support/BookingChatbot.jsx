// /pages/Support/BookingChatbot.jsx

import React, { useState } from "react";
import { Send, Bot, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import apiClient from "../../utils/apiClient";

const BookingChatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi there! I’m your counselling assistant. Want to book a session?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Simulate chatbot flow
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      // You can change this logic based on your backend API
      const response = await apiClient.fetchWithAuth("/api/bookings/chatbot", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
        if (data.bookingConfirmed) {
          setIsBooked(true);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch (error) {
      console.error("Chatbot booking error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Connection issue. Please check your network." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 px-6 py-4 bg-[#000459] text-white rounded-t-2xl">
          <Bot className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Booking Chatbot</h2>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[450px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="animate-spin w-4 h-4" />
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input field */}
        <form
          onSubmit={handleSend}
          className="flex items-center border-t border-gray-200 p-3 bg-white rounded-b-2xl"
        >
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isBooked}
          />
          <button
            type="submit"
            disabled={isLoading || isBooked}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {isBooked && (
          <div className="flex items-center justify-center gap-2 text-green-600 py-3 border-t border-gray-200">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">Your counselling session is booked! 🎉</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
        <Calendar className="w-4 h-4" />
        <span>Powered by Wellness Booking System</span>
      </div>
    </div>
  );
};

export default BookingChatbot;
