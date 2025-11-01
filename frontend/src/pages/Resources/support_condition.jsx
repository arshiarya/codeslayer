import { Bot, Calendar, AlertTriangle } from "lucide-react";

export default function SupportOptions() {
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



