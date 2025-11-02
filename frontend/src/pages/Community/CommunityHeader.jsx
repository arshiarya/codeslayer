import React, { useState } from 'react';
import {
  CalendarIcon,
  HeartIcon,
  SparklesIcon,
  SunIcon,
  PencilIcon,
  MicrophoneIcon,
  ChatBubbleBottomCenterTextIcon,
  BookOpenIcon,
  UserGroupIcon
} from '@heroicons/react/24/solid';

// --- 1. CommunityHeader Component ---
// Handles the top banner, post input, and tab navigation.
const CommunityHeader = ({ activeTab, setActiveTab }) => {
  const [postText, setPostText] = useState('');

  const handlePost = () => {
    if (postText.trim()) {
      // In a real app, this would dispatch to a backend/database
      console.log('Posting:', postText);
      setPostText('');
    }
  };

  // Utility function to generate tab classes
  const getTabClasses = (tabName, primaryColor, secondaryColor) => `
    p-5 rounded-2xl cursor-pointer transition 
    ${activeTab === tabName
      ? `bg-${secondaryColor} border-2 border-${primaryColor}` // Active style
      : `bg-gradient-to-b from-white to-[#F4F8FB] border border-slate-200 hover:shadow-md` // Inactive style
    }`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-5xl font-semibold text-[#000459] mb-2">BetterX</h1>
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#000459]">Community</h2>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <div className="relative">
            {/* Placeholder for an image asset */}
            <div className="w-40 h-40 md:w-40 relative z-10 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <UserGroupIcon className="h-20 w-20 text-slate-500" />
            </div>
          </div>
          <p className="text-sm font-semibold text-[#2B5A7A] mt-2">BetterX</p>
          <p className="text-xs text-slate-600">● 12,345 members</p>
        </div>
      </div>

      {/* Post Input Section */}
      <div className="bg-white rounded-2xl p-5 lg:p-6 mb-8 shadow-md border border-slate-200">
        <input
          type="text"
          placeholder="What's on your mind..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePost()}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-full mb-3 text-sm focus:outline-none focus:border-[#E8A287] focus:ring-1 focus:ring-[#E8A287] transition duration-150"
        />
        <button
          type="button"
          onClick={handlePost}
          className="bg-[#E8A287] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#D89277] transition shadow-md"
        >
          POST
        </button>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <button
            type="button"
            className="bg-[#2B5A7A] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#1A3B53] transition flex items-center gap-2 shadow-md"
          >
            Share your story
            <span className="text-lg">+</span>
          </button>
          <p className="text-xs text-slate-500 mt-2">
            Share your story, listen to others, or just breathe.<br />
            No pressure.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Announcements Tab */}
        <div
          onClick={() => setActiveTab('announcements')}
          className={`p-5 rounded-2xl transition cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-[#E8F5FF] border-2 border-[#B5D8EB] shadow-lg'
                : 'bg-gradient-to-b from-white to-[#F4F8FB] border border-slate-200 hover:shadow-md'
            }`}
        >
          <h3 className="text-base lg:text-lg font-bold text-[#2B5A7A] mb-1.5">Announcements</h3>
          <p className="text-xs lg:text-sm text-slate-600">
            Important announcements, news, and dates related to mental health.
          </p>
        </div>

        {/* Listen & Learn Tab */}
        <div
          onClick={() => setActiveTab('listenLearn')}
          className={`p-5 rounded-2xl transition cursor-pointer ${
              activeTab === 'listenLearn'
                ? 'bg-[#FFF9E6] border-2 border-[#E8D4A0] shadow-lg'
                : 'bg-gradient-to-b from-white to-[#F4F8FB] border border-slate-200 hover:shadow-md'
            }`}
        >
          <h3 className="text-base lg:text-lg font-bold text-[#2B5A7A] mb-1.5">Listen & Learn</h3>
          <p className="text-xs lg:text-sm text-slate-600">
            Stories, insights, and gentle advice to feel understood.
          </p>
        </div>

        {/* Reach Out Tab */}
        <div
          onClick={() => setActiveTab('reachOut')}
          className={`p-5 rounded-2xl transition cursor-pointer ${
              activeTab === 'reachOut'
                ? 'bg-[#E8F0FF] border-2 border-[#B8D4F1] shadow-lg'
                : 'bg-gradient-to-b from-white to-[#F4F8FB] border border-slate-200 hover:shadow-md'
            }`}
        >
          <h3 className="text-base lg:text-lg font-bold text-[#2B5A7A] mb-1.5">Reach Out & Be Heard</h3>
          <p className="text-xs lg:text-sm text-slate-600">
            Start a conversation, ask for support, or simply express yourself.
          </p>
        </div>
      </div>
    </div>
  );
};


// --- 2. AnnouncementsPage Component (Content) ---
const AnnouncementsPage = ({ activeTab, setActiveTab }) => {
  const announcements = [
    {
      id: 1,
      title: 'October 10 – World Mental Health Day',
      description:
        "Today, we're hosting live sessions and gentle yoga to honor this day. Join us to reflect, connect, and breathe.",
      icon: <HeartIcon className="h-6 w-6 text-[#2B5A7A]" />
    },
    {
      id: 2,
      title: 'June 21 – International Yoga Day',
      description:
        "Let's breathe in and out together. Exhale the stress of the month and return to your center.",
      icon: <SunIcon className="h-6 w-6 text-[#2B5A7A]" />
    },
    {
      id: 3,
      title: 'September 7-13 – Suicide Prevention Week',
      description:
        "We're sharing stories of hope, healing, and quiet courage. Let's remind each other: you're not alone.",
      icon: <SparklesIcon className="h-6 w-6 text-[#2B5A7A]" />
    },
    {
      id: 4,
      title: 'May – Mental Health Awareness Month',
      description:
        'A full month to run student-led campaigns, share resources, and create safe spaces for open conversations.',
      icon: <CalendarIcon className="h-6 w-6 text-[#2B5A7A]" />
    },
    {
      id: 5,
      title: 'November 15-22 – Art for Awareness Week (suggested date)',
      description:
        "Express what words can't. Submit your artwork to help others feel seen and understood.",
      icon: <PencilIcon className="h-6 w-6 text-[#2B5A7A]" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-0 max-w-5xl">
      {/* The Header is now controlled by the parent App component */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 min-h-96">
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2B5A7A]/10">
                <HeartIcon className="h-6 w-6 text-[#2B5A7A]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2B5A7A]">Announcements</h2>
              <p className="text-sm text-gray-500">Stay updated with community events and news</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-start gap-4 border-b border-slate-200 pb-6 last:border-b-0"
            >
              <div className="flex-shrink-0 mt-1">{announcement.icon}</div>
              <div>
                <h3 className="font-bold text-[#2B5A7A] mb-2">
                  {announcement.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {announcement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- 3. Placeholder Pages ---

const PlaceholderPage = ({ title, icon: Icon, description, activeTab, setActiveTab }) => (
  <div className="container mx-auto px-4 py-0 max-w-5xl">
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 min-h-96 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#2B5A7A]/10 mb-4">
          <Icon className="h-10 w-10 text-[#2B5A7A]" />
      </div>
      <h2 className="text-3xl font-bold text-[#2B5A7A] mb-2">{title}</h2>
      <p className="text-lg text-gray-600 max-w-lg">{description}</p>
      <button
        onClick={() => setActiveTab('announcements')}
        className="mt-6 bg-[#E8A287] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#D89277] transition shadow-md"
      >
        Go to Announcements
      </button>
    </div>
  </div>
);

const ListenLearnPage = (props) => (
  <PlaceholderPage
    {...props}
    title="Listen & Learn"
    icon={MicrophoneIcon}
    description="This section is where members share personal stories, meditations, and educational resources. Get ready to listen, reflect, and grow."
  />
);

const ReachOutPage = (props) => (
  <PlaceholderPage
    {...props}
    title="Reach Out & Be Heard"
    icon={ChatBubbleBottomCenterTextIcon}
    description="This is your safe space to ask for support, start deep conversations, or find someone to talk to. We're here for you."
  />
);


// --- 4. Main App Component with Routing Logic ---
const App = () => {
  const [activeTab, setActiveTab] = useState('announcements'); // State controls which tab is active

  // Function to render the correct content component based on the active tab state
  const renderContent = () => {
    switch (activeTab) {
      case 'announcements':
        return <AnnouncementsPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'listenLearn':
        return <ListenLearnPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'reachOut':
        return <ReachOutPage activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <AnnouncementsPage activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] pb-10">
      <CommunityHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Content Area - conditionally rendered based on activeTab */}
      {renderContent()}

      {/* Footer */}
      <footer className="text-center mt-10 text-gray-600 text-sm">
        <p>Don't worry Be happy</p>
      </footer>
    </div>
  );
};

export default App;
