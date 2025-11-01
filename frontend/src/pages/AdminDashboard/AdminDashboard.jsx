// src/pages/AdminDashboard.jsx (FINAL - Using Managed Mock Data)

import React, { useState, useEffect } from "react";
import StatCard from "./StatCard";
import ChartCard from "./ChartCard";
import CounsellorCard from "./CounsellorCard";
import EngagementCard from "./EngagementCard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

// --- MOCK DATA CONSTANTS ---
const MOCK_STATS = {
    totalUsers: "1287",
    activeThisMonth: "745",
    checkinsToday: "476",
    averageMoodScore: "3.8", // Keep as number for StatCard formatting
    assessmentsToday: "97",
    flaggedContent: 2, // Mocked flagged content count
};

const MOCK_GROWTH_DATA = [ // Matches {day: 'YYYY-MM-DD', users: N}
    { day: "2025-10-26", users: 50 },
    { day: "2025-10-27", users: 60 },
    { day: "2025-10-28", users: 85 },
    { day: "2025-10-29", users: 110 },
    { day: "2025-10-30", users: 130 },
    { day: "2025-10-31", users: 155 },
    { day: "2025-11-01", users: 180 },
];

const MOCK_MOOD_DATA = [ // Matches {day: 'YYYY-MM-DD', average_mood: N.N}
    { day: "2025-10-26", average_mood: 3.5 },
    { day: "2025-10-27", average_mood: 3.6 },
    { day: "2025-10-28", average_mood: 3.9 },
    { day: "2025-10-29", average_mood: 4.1 },
    { day: "2025-10-30", average_mood: 4.0 },
    { day: "2025-10-31", average_mood: 3.8 },
    { day: "2025-11-01", average_mood: 4.2 },
];
// -----------------------------


const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [stats, setStats] = useState({});
  const [growthChartData, setGrowthChartData] = useState([]);
  const [moodChartData, setMoodChartData] = useState([]); // State for Mood Chart
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching on component mount
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setStats(MOCK_STATS);
      setGrowthChartData(MOCK_GROWTH_DATA);
      setMoodChartData(MOCK_MOOD_DATA);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer); // Cleanup
  }, []);
  
  // --- Stat Card Mapping ---
  const statMetrics = [
    { title: "Total Users", value: stats.totalUsers || "...", colorClass: "bg-[#7F56D9]" },
    { title: "Active this month", value: stats.activeThisMonth || "...", colorClass: "bg-[#F79009]" },
    { title: "Check-ins Today", value: stats.checkinsToday || "...", colorClass: "bg-[#2970FF]" },
    // Use the fetched mood score with /5 suffix
    { title: "Average Mood Score", value: `${stats.averageMoodScore || "..."}/5`, colorClass: "bg-[#4CAF50]" },
    { title: "Assessments Today", value: stats.assessmentsToday || "...", colorClass: "bg-[#5C6BC0]" },
  ];

  // --- Loading State ---
  if (isLoading) {
    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-gray-500 bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans">
            <div className="text-3xl animate-pulse">⏳</div>
            <p className="mt-4 text-xl font-semibold">Loading Dashboard Data...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-semibold text-[#000459]">Admin Dashboard</h1>
        <p className="text-gray-500 mb-6">
          Monitor platform health and user engagement
        </p>

        {/* --- STAT CARDS --- */}
        <div className="flex flex-wrap gap-4 mb-8">
          {statMetrics.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              colorClass={stat.colorClass}
            />
          ))}
        </div>

        {/* --- CHARTS SECTION --- */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          User Growth & Mood Trends
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* 📈 User Growth Chart */}
          <ChartCard title="Daily User Growth Trends" icon="📈">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthChartData}> {/* Uses state data */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis dataKey="users" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 😊 Average Mood Score Chart */}
          <ChartCard title="Daily Average Mood Score" icon="😊">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodChartData}> {/* Uses state data */}
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value) => [`Avg Mood: ${value}/5`, 'Score']}
                />
                <Area
                  type="monotone"
                  dataKey="average_mood" // Key matches MOCK_MOOD_DATA structure
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorMood)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* --- COUNSELLOR & ENGAGEMENT SECTIONS --- */}
        <div className="mb-8">
          <CounsellorCard />
        </div>
        <div className="mb-8">
          {/* Passes the mocked flagged content count */}
          <EngagementCard flaggedCount={stats.flaggedContent} /> 
        </div>

        <div className="text-center mt-12 text-gray-400">Don't worry Be happy</div>
      </div>
    </div>
  );
};

export default AdminDashboard;