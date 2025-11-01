import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import AuthPage from "./pages/LoginPage/AuthPage";

import HomePage from "./pages/Home/HomePage";
import SupportPage from "./pages/Support/SupportPage";  
import WellnessCard from "./pages/Support/WellnessCard";
import ResourceIcon from "./pages/Support/ResourceIcon";  
import CallAway from "./pages/Support/CallAway";
import PathwaysToWellness from "./pages/Support/PathwaysToWellness";
import BookingChatbot from "./pages/Support/BookingChatbot";

import SupportOptions from "./pages/Resources/support_condition";
import ArticlesPage from "./pages/Resources/articles_page";
import AudioPage from "./pages/Resources/audio_page";
import VideoPage from "./pages/Resources/video_page";

import WellnessDashboard from "./pages/UserDashboard/WellnessDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

import AnnouncementsPage from "./pages/Community/AnnouncementsPage";
import ListenLearnPage from "./pages/Community/ListenLearnPage";
import ReachOutPage from "./pages/Community/ReachOutPage";
import CommunityHeader from "./pages/Community/CommunityHeader";

import ChatPage from "./pages/ChatBot/ChatPage";
import UserProfile from "./components/UserProfile";

import TrackMoodPage from "./pages/TrackMood/TrackMoodPage";
import PSSAssessment from "./pages/TrackMood/PSS";
import PHQ9Assessment from "./pages/TrackMood/PHQ-9";
import GAD7Assessment from "./pages/TrackMood/GAD-7";

// ✅ Protected Route wrapper
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

// ✅ Layout wrapper for protected routes (with header)
const ProtectedLayout = ({ onSignOut }) => (
  <>
    <Header onSignOut={onSignOut} />
    <main className="p-4">
      <Outlet />
    </main>
  </>
);

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleAuthSuccess = (token, user) => {
    setIsLoggedIn(true);
    setAuthToken(token);
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
      <Routes>
        {/* Login / Signup */}
        <Route 
          path="/" 
          element={
            isLoggedIn 
              ? <Navigate to="/HomePage" replace /> 
              : <AuthPage onAuthSuccess={handleAuthSuccess} />
          } 
        />

        {/* Temporary: Chat accessible without login */}
        <Route path="/ChatPage" element={<ChatPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProtectedLayout onSignOut={handleSignOut} />
            </ProtectedRoute>
          }
        >
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/SupportPage" element={<SupportPage />} />
          <Route path="/AnnouncementsPage" element={<AnnouncementsPage />} />
          <Route path="/ListenLearnPage" element={<ListenLearnPage />} />
          <Route path="/ReachOutPage" element={<ReachOutPage />} />
          <Route path="/SupportOptions" element={<SupportOptions />} />
          <Route path="/book-counselling" element={<BookingChatbot />} />
          <Route path="/WellnessCard" element={<WellnessCard />} />
          <Route path="/ResourceIcon" element={<ResourceIcon />} />
          <Route path="/ArticlesPage" element={<ArticlesPage />} />
          <Route path="/AudioPage" element={<AudioPage />} />
          <Route path="/VideoPage" element={<VideoPage />} />
          <Route path="/TrackMoodPage" element={<TrackMoodPage />} />
          <Route path="/PSSAssessment" element={<PSSAssessment />} />
          <Route path="/PHQ9Assessment" element={<PHQ9Assessment />} />
          <Route path="/GAD7Assessment" element={<GAD7Assessment />} />
          <Route path="/WellnessDashboard" element={<WellnessDashboard />} />
          <Route 
            path="/UserProfile" 
            element={
              <UserProfile 
                user={currentUser}
                token={authToken}
                onUpdateProfile={setCurrentUser}
              />
            } 
          />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/lifeline" element={<CallAway />} />
          <Route path="/find-wellness" element={<PathwaysToWellness />} />
          <Route path="/CommunityHeader" element={<CommunityHeader />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<div className="text-center py-20 text-gray-600 text-xl">🚧 Page Not Found</div>} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
