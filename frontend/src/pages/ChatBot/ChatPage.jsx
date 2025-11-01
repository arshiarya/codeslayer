import React, { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header';

const ChatPage = ({ onSignOut }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey, I'm here for you whenever you need. How are you feeling right now?",
      isBot: true,
      role: 'model'
    }
  ]);

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const moreOptions = [
    "Conduct a meditation session with me",
    "I'm feeling anxious, can you help me calm down?",
    "I'm stressed about work, what can I do?",
    "I'm feeling lonely, can we talk?",
    "Help me with breathing exercises",
    "I need tips for better sleep"
  ];

  const quickActions = [
    { text: "Need Motivation", message: "I need some motivation and encouragement right now", color: "bg-[#E8B4F5] hover:bg-[#D8A4E5]" },
    { text: "Not feeling good", message: "I'm not feeling good today, can you help me?", color: "bg-[#FFB347] hover:bg-[#EFA337]" },
    { text: "I need some tips", message: "I'd like some tips for improving my mental wellbeing", color: "bg-[#A8E6CF] hover:bg-[#98D6BF]" }
  ];

  // Initialize session ID and Speech Recognition on component mount
  useEffect(() => {
    let storedSessionId = localStorage.getItem('chatSessionId');
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
    console.log('✅ Session ID initialized:', storedSessionId);

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in your browser settings.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Main function to get bot response from backend
  const getBotResponse = async (userMessage) => {
    setIsLoading(true);
    setConnectionError(false);

    try {
      console.log('📤 Sending to backend:', { message: userMessage, sessionId });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("http://localhost:5050/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const botText = data.reply || "Sorry, I couldn't get a response.";

      if (botText.includes("configuration error") || botText.includes("API key error")) {
        setConnectionError(true);
      }

      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, text: botText, isBot: true, role: "model" }
      ]);

    } catch (error) {
      console.error("❌ Backend error:", error);
      setConnectionError(true);
      
      let errorMessage = "Oops! I'm having trouble connecting. ";
      
      if (error.name === 'AbortError') {
        errorMessage += "The request took too long. Please try again.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage += "Cannot reach the server. Make sure the backend is running on port 5050.";
      } else {
        errorMessage += "Please try again.";
      }
      
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, text: errorMessage, isBot: true, role: "model" }
      ]);
    }

    setIsLoading(false);
  };

  // Handle sending message from input
  const handleSendMessage = () => {
    if (message.trim() && !isLoading && sessionId) {
      const userMessage = message.trim();
      
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, text: userMessage, isBot: false, role: 'user' }
      ]);
      
      setMessage('');
      getBotResponse(userMessage);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle clicking on pre-defined options
  const handleOptionClick = (option) => {
    if (!isLoading && sessionId) {
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, text: option, isBot: false, role: 'user' }
      ]);
      getBotResponse(option);
    }
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setMessage('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Reset conversation
  const resetChat = async () => {
    if (window.confirm('Start a new conversation? This will clear your chat history.')) {
      try {
        await fetch("http://localhost:5050/api/gemini-chat/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        
        setMessages([
          {
            id: 1,
            text: "Hey, I'm here for you whenever you need. How are you feeling right now?",
            isBot: true,
            role: 'model'
          }
        ]);
        
        setConnectionError(false);
        console.log('🔄 Chat reset successfully');
      } catch (error) {
        console.error('❌ Reset error:', error);
        alert('Failed to reset chat. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
      {/* Header */}
      <Header onSignOut={onSignOut} />

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mx-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Cannot connect to backend server</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Split Screen */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col overflow-hidden">
          {/* New Chat Button */}
          <div className="p-4 border-b border-[#e2e8f0]">
            <button 
              onClick={resetChat}
              disabled={isLoading}
              className="w-full bg-[#4A9FF5] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#3A8FE5] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-[#e2e8f0]">
            <h3 className="text-sm font-bold text-[#1e293b] mb-3 uppercase tracking-wide">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(action.message)}
                  disabled={isLoading || !sessionId}
                  className={`w-full ${action.color} text-[#000459] px-4 py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-left`}
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
            <h3 className="text-sm font-bold text-[#1e293b] mb-3 uppercase tracking-wide">Suggestions</h3>
            <div className="space-y-2">
              {moreOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={isLoading || !sessionId}
                  className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 text-sm"
                  style={{ backgroundColor: 'rgb(40 138 143 / 92%)' }}
                  onMouseEnter={(e) => !isLoading && !sessionId ? null : e.currentTarget.style.backgroundColor = 'rgb(40 138 143)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(40 138 143 / 92%)'}
                >
                  <span className="text-lg">▶</span>
                  <span className="flex-1">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#e2e8f0] text-center bg-[#f1f5f9]">
            <p className="text-sm text-[#334155] font-semibold">Don't worry Be happy</p>
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-lg px-5 py-3 rounded-2xl ${msg.isBot ? 'bg-white text-[#000459] shadow-md border border-[#E0E7EF]' : 'bg-[#2B3990] text-white'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-lg px-5 py-3 rounded-2xl bg-white text-[#000459] shadow-md border border-[#E0E7EF] italic">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#000459] rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-[#000459] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-2 h-2 bg-[#000459] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      </div>
                      <span>BetterX is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Fixed Input Area at Bottom */}
          <div className="border-t border-[#D6E6F2] bg-white p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 bg-[#F4F8FB] rounded-full px-4 py-3 border border-[#D6E6F2]">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : isLoading ? "Please wait..." : sessionId ? "Type here..." : "Loading..."}
                  disabled={isLoading || !sessionId || isListening}
                  className="flex-1 bg-transparent outline-none text-[#000459] placeholder-slate-400 disabled:opacity-50"
                />
                
                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading || !sessionId}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-white hover:bg-slate-100'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  <svg 
                    className={`w-5 h-5 ${isListening ? 'text-white' : 'text-[#000459]'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim() || !sessionId}
                  className="w-10 h-10 rounded-full bg-[#2B3990] flex items-center justify-center hover:bg-[#1f2b6b] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;