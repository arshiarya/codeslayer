


import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src="/Home-audio.mpeg" loop preload="auto"></audio>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between pb-0">

        {/* Left Content */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-5xl font-semibold text-[#000459] mb-2 leading-tight">
            For minds that need <span className="whitespace-nowrap">a moment</span>
          </h1>

          <p className="text-lg text-slate-600 mb-6">
            <a href="#feelings" className="hover:underline">
              "For every student who feels overwhelmed."
            </a>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <a
              href="/WellnessDashboard"
              className="bg-[#F4F8FB] text-[#000459] px-6 py-2 rounded-full font-semibold border border-[#D6E6F2] hover:bg-blue-100 transition inline-flex items-center justify-center"
            >
              Start Your Journey
            </a>

            <Link
              to="/AnnouncementsPage"
              className="bg-[#F4F8FB] text-[#000459] px-6 py-2 rounded-full font-semibold border border-[#D6E6F2] hover:bg-blue-100 transition inline-flex items-center justify-center"
            >
              Join our community
            </Link>
          </div>

          {/* Calm Track Section */}
          <div className="mb-4">
            <p className="text-slate-500 text-base font-medium mb-2">
              "Feeling overwhelmed?<br />
              Try this 2-min calm track."
            </p>

            <div className="flex items-center gap-2">
              {/* Play / Pause Button */}
              <button
                onClick={handlePlayPause}
                className="relative w-8 h-8 flex items-center justify-center rounded-full bg-[#F4F8FB] border border-[#D6E6F2] hover:bg-blue-100 transition group overflow-hidden"
              >
                {isPlaying ? (
                  <svg
                    className="w-4 h-4 text-blue-600 z-10 relative"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <rect x="5" y="4" width="3" height="12" />
                    <rect x="11" y="4" width="3" height="12" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-blue-600 z-10 relative group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <polygon points="5,3 16,10 5,17" />
                  </svg>
                )}
                <span className="absolute inset-0 rounded-full animate-ping bg-blue-200 opacity-60"></span>
              </button>

              {/* Music Bars Animation */}
              {isPlaying && (
                <span className="flex items-end h-5 ml-1">
                  <span className="inline-block w-1 h-3 bg-black mx-[1px] animate-musicbar1 rounded"></span>
                  <span className="inline-block w-1 h-5 bg-black mx-[1px] animate-musicbar2 rounded"></span>
                  <span className="inline-block w-1 h-2 bg-black mx-[1px] animate-musicbar3 rounded"></span>
                  <span className="inline-block w-1 h-4 bg-black mx-[1px] animate-musicbar4 rounded"></span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Assistant Image */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center items-center pl-8">
          <div className="relative">
            <Link 
              to="/ChatPage"
              className="absolute top-1/3 -right-12 bg-white px-5 py-2 rounded-full text-sm text-slate-600 font-medium shadow-md border border-slate-300 whitespace-nowrap z-20 hover:bg-slate-50 hover:shadow-lg transition-all duration-300"
            >
              chat with AI
            </Link>

            <div className="relative">
              <img src="/home_1.png" alt="AI Assistant" className="w-40 md:w-40 relative z-10" />
              <div className="absolute inset-0 rounded-full bg-sky-300/30 blur-xl animate-glow-ring-1"></div>
              <div className="absolute inset-0 rounded-full bg-indigo-300/25 blur-2xl animate-glow-ring-2"></div>
              <div className="absolute inset-0 rounded-full bg-blue-300/25 blur-xl animate-glow-ring-3"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#B5D8EB] via-[#B5D8EB]/50 to-transparent pointer-events-none animate-breath"></div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section className="container mx-auto px-4 mt-0 pt-0 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#F4F8FB] border border-[#D6E6F2] p-6 rounded-2xl transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md">
            <h3 className="text-xl font-bold mb-2 text-[#2B3990] tracking-wide">SESSION BOOKING</h3>
            <p className="text-base text-slate-600">
              "Talk to someone who gets it"<br />
              Gentle, inviting, and student-friendly—perfect for encouraging help-seeking without pressure.
            </p>
          </div>

          <div className="bg-[#F4F8FB] border border-[#D6E6F2] p-6 rounded-2xl transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md">
            <h3 className="text-xl font-bold mb-2 text-[#2B3990] tracking-wide">SELF TESTS</h3>
            <p className="text-base text-slate-600">
              "Check in with yourself"<br />
              Quick, science-backed mental health assessments designed for students to better understand their emotional state.
            </p>
          </div>

          <div className="bg-[#F4F8FB] border border-[#D6E6F2] p-6 rounded-2xl transform transition-transform duration-300 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md">
            <h3 className="text-xl font-bold mb-2 text-[#2B3990] tracking-wide">RESOURCE LIBRARY</h3>
            <p className="text-base text-slate-600">
              "Explore what helps"<br />
              Articles, playlists, notes, and real stories to support your mind, your way.
            </p>
          </div>
        </div>
      </section>

      {/* Feelings Section */}
      <div className="relative mt-[-96px] pt-[140px]">
        <div className="absolute inset-0 bg-[#47708F] z-0"></div>

        <div className="relative z-10">
          <section className="container mx-auto px-4 mb-16 pt-4">
            <div className="flex items-center justify-center gap-3 mb-14">
              <img src="/home_2.png" alt="Support" className="w-14" />
              <h2 className="text-2xl font-semibold text-white">
                What are you feeling, We're here to support you
              </h2>
            </div>

            <div className="flex flex-nowrap gap-3 justify-center pb-2">
              {[
                { emoji: '🧘', title: 'Stress', text: 'Try a 2 min breathing track or book a calming session', bg: '#B5D8EB' },
                { emoji: '😟', title: 'Anxiety', text: 'Chat with AI or take a self-test to check in', bg: '#CDEBFF' },
                { emoji: '😔', title: 'Loneliness', text: 'Join student community space or read shared stories', bg: '#D8C9FF' },
                { emoji: '😞', title: 'Depression', text: 'Book a session with a college counselor', bg: '#FFD6D6' },
                { emoji: '🤯', title: 'Overthinking', text: 'Explore grounding playlists or journaling prompts', bg: '#E6F4F1' },
                { emoji: '🔥', title: 'Burnout', text: 'Browse the resource library for recovery tips', bg: '#FFE3D8' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="rounded-full bg-opacity-70 px-7 py-6 flex flex-col items-center w-48 min-w-[12rem]"
                  style={{ backgroundColor: f.bg }}
                >
                  <span className="text-2xl mb-2">{f.emoji}</span>
                  <div className="font-semibold text-[#000459]">{f.title}</div>
                  <div className="text-xs text-slate-700 mt-1 text-center">{f.text}</div>
                </div>
              ))}
            </div>
          </section>

          <footer className="text-center mt-10 text-sm text-white pb-8">
            Don't worry Be happy
          </footer>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes breath {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes glow-ring-1 {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.6; }
        }
        @keyframes glow-ring-2 {
          0%, 100% { transform: scale(1.1); opacity: 0.3; }
          50% { transform: scale(1.35); opacity: 0.5; }
        }
        @keyframes glow-ring-3 {
          0%, 100% { transform: scale(1.2); opacity: 0.25; }
          50% { transform: scale(1.45); opacity: 0.4; }
        }
        .animate-breath { animation: breath 2s ease-in-out infinite; }
        .animate-glow-ring-1 { animation: glow-ring-1 3s ease-in-out infinite; }
        .animate-glow-ring-2 { animation: glow-ring-2 4s ease-in-out infinite; }
        .animate-glow-ring-3 { animation: glow-ring-3 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default HomePage;