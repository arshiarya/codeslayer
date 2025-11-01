import SupportOptions from "./support_condition";
import { Clock, PlayCircle } from "lucide-react";
import ResourcesNav from "../../components/ResourcesNav";

export default function VideoPage() {
  const videos = [
    {
      title: "Full Self Healing Meditation - OM SHANTI",
      views: "26M views",
      time: "15:40",
      desc: "This 15-minute basic meditation video is ideal for inner peace and calm.",
      thumb: "/images/omshanti.jpg",
      link: "https://www.youtube.com/watch?v=YWDRFZFCrGE",
    },
    {
      title: "Morning Surya Namaskar Meditation",
      views: "10M views",
      time: "27:22",
      desc: "Practice the 12 postures of Surya Namaskar with sacred Vedic chants.",
      thumb: "/images/surya_namaskar.png",
      link: "https://www.youtube.com/watch?v=7s0E8ecWncM",
    },
    {
      title: "Progressive Muscle Relaxation",
      views: "4M views",
      time: "15:52",
      desc: "Learn this evidence-based technique to release physical tension and stress.",
      thumb: "/images/pmr.avif",
      link: "https://www.youtube.com/watch?v=86HUcX8ZtAk",
    },
    {
      title: "10-Minute Gayatri Mantra for Mind & Soul",
      views: "3.1M views",
      time: "10:50",
      desc: "Chanting Gayatri Mantra regularly can establish and stabilize the mind.",
      thumb: "/images/gaytrimantra.jpg",
      link: "https://www.youtube.com/watch?v=8lxDnvAH4tQ",
    },
    {
      title: "Exam Success Meditation",
      views: "1.6M views",
      time: "10:01",
      desc: "Quick breathing techniques to calm pre-exam nerves.",
      thumb: "/images/exam_success.jpg",
      link: "https://www.youtube.com/watch?v=AtF0T2fPvbI",
    },
    {
      title: "10-Minute Morning Yoga for Mental Clarity",
      views: "69K views",
      time: "12:01",
      desc: "Start your day with gentle movements to center your mind and body.",
      thumb: "/images/morning_yoga.jpg",
      link: "https://youtu.be/WrM12NYA7wg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans">
      <div className="max-w-6xl mx-auto px-4 py-10">
      
        <h1 className="text-5xl font-semibold text-[#000459] mb-2 text-center">
          Campus Mental Health Resources
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Watch mindfulness and relaxation videos designed to help you de-stress and focus.
      </p>
        <ResourcesNav />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
              <div className="relative">
                <img src={v.thumb} alt={v.title} className="w-full h-40 object-cover" />
                <a
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex justify-center items-center bg-black/40 hover:bg-black/60 transition"
                >
                  <PlayCircle size={48} className="text-white" />
                </a>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{v.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{v.desc}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{v.views}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {v.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SupportOptions />
      </div>
    </div>
  );
}






