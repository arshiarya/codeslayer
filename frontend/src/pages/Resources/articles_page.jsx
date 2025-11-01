import React from "react";
// Merged all icon imports from lucide-react
import { Clock, Star, Bot, Calendar, AlertTriangle } from "lucide-react";

// --- Inlined SupportOptions Component ---
// (This was previously in "./support_condition")
const SupportOptions = () => {
  const options = [
    {
      title: "AI Chat Buddy (Instant Help)",
      icon: <Bot size={22} />,
      desc: "Talk to your AI Buddy anytime — private, judgment-free, and available 24/7.",
      color: "bg-blue-100",
    },
    {
      title: "Book a Counseling Session",
      icon: <Calendar size={22} />,
      desc: "Connect with certified counselors for one-on-one personalized support.",
      color: "bg-blue-200",
    },
    {
      title: "Emergency Help",
      icon: <AlertTriangle size={22} />,
      desc: "In crisis or need urgent support? Contact campus emergency or helpline now.",
      color: "bg-red-200",
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-3">
        Need More Personalized Support?
      </h2>
      <p className="text-center text-gray-600 mb-6">
        These resources are a great start, but if you need more guidance, we’re here to help.
      </p>

      <div className="grid sm:grid-cols-3 gap-5">
        {options.map((opt) => (
          <div
            key={opt.title}
            className={`${opt.color} p-5 rounded-2xl shadow-sm text-center`}
          >
            <div className="flex justify-center mb-2 text-blue-800">{opt.icon}</div>
            <h3 className="font-semibold mb-2">{opt.title}</h3>
            <p className="text-sm text-gray-700">{opt.desc}</p>
          </div>
        ))}
      </div>

       
      <footer className="text-center mt-10 text-gray-600 text-sm">
                <p>Don't worry Be happy</p>
            </footer>
    </div>
  );
}

// --- Inlined ResourcesNav Component ---
// (This was previously in "../../components/ResourcesNav")
// Created a placeholder navigation bar based on context
const ResourcesNav = () => {
  // We're on the Articles page, so make it the "active" link
  return (
    <div className="mb-8 flex justify-center gap-2 sm:gap-4">
      <a 
        href="#" 
        className="bg-white text-blue-700 px-3 py-2 sm:px-4 rounded-lg shadow-md font-medium text-sm sm:text-base"
      >
        Articles
      </a>
      <a 
        href="#" 
        className="bg-white/70 text-gray-600 hover:bg-white hover:text-blue-700 px-3 py-2 sm:px-4 rounded-lg shadow-sm font-medium transition text-sm sm:text-base"
      >
        Videos
      </a>
      <a 
        href="#" 
        className="bg-white/70 text-gray-600 hover:bg-white hover:text-blue-700 px-3 py-2 sm:px-4 rounded-lg shadow-sm font-medium transition text-sm sm:text-base"
      >
        Audio
      </a>
    </div>
  );
};


// --- Main ArticlesPage Component ---
const ArticlesPage = () => {
  const articles = [
    {
      title: "Understanding Anxiety: A Student’s Guide",
      time: "8 min",
      rating: 4.8,
      desc: "Learn practical strategies to manage anxiety during exams and daily college life.",
      tags: ["Anxiety", "Stress Management", "Study Tips"],
      link: "https://www.innermined.com/post/understanding-anxiety-a-student-s-guide-to-turning-stress-into-strength?srsltid=AfmBOoqFLn5uQXCt3srFL7dMPrwvsaqiLgBmd-8SOyex5CLXirayIUud",
    },
    {
      title: "Building Resilience in University",
      time: "12 min",
      rating: 4.9,
      desc: "Develop mental strength and bounce back from academic and personal challenges.",
      tags: ["Resilience", "Mental Strength", "Growth"],
      link: "https://theglobalcollege.com/blog/building-resilience-students/",
    },
    {
      title: "The Power of Mindfulness for Students",
      time: "6 min",
      rating: 4.7,
      desc: "Simple mindfulness techniques to improve focus and reduce stress.",
      tags: ["Mindfulness", "Meditation", "Focus"],
      link: "httpsI://childmind.org/article/the-power-of-mindfulness/",
    },
    {
      title: "The Art of Stillness: Ancient Wisdom for Inner Peace",
      time: "8 min",
      rating: 4.8,
      desc: "Explore timeless techniques from Indian heritage to cultivate peace amidst academic pressure.",
      tags: ["Peace", "Indian Wisdom", "Heritage"],
      link: "https://www.safalniveshak.com/the-art-of-stillness/",
    },
    {
      title: "Finding Your Inner Shakti: A Guide to Self-Power",
      time: "12 min",
      rating: 4.9,
      desc: "Tap into your innate ‘Shakti’ energy to build confidence and navigate university life.",
      tags: ["Self Power", "Divine", "Growth"],
      link: "httpsClick://kripalu.org/living-kripalu/shakti-power-within-you",
    },
    {
      title: "Cosmic Calm: Easing Anxiety with a Broader View",
      time: "12 min",
      rating: 4.7,
      desc: "Learn to reduce anxiety through cosmic philosophies and find your place in the universe.",
      tags: ["Philosophy", "Cosmic", "Peace"],
      link: "https://www.cafhglobal.com/meditation-and-anxiety/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        <h1 className="text-5xl font-semibold text-[#000459] mb-2 text-center">
          Campus Mental Health Resources
      </h1>
      <p className="text-center text-gray-600 mb-8">
        From exam stress to social anxiety — find helpful articles designed for students navigating college life.
      </p>
       <ResourcesNav />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Clock size={14} className="mr-1" /> {article.time}
              <Star size={14} className="ml-3 mr-1 text-yellow-500" />{" "}
              {article.rating}
            </div>

            <p className="text-gray-600 text-sm mb-3">{article.desc}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Read Article
            </a>
          </div>
        ))}
      </div>

      <SupportOptions />
      </div>
    </div>
  );
};

export default ArticlesPage;