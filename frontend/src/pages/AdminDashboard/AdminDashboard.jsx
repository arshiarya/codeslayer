// src/pages/Dashboard.jsx

import React from 'react';
// import Header from '../Header'; // Assume you have a header component
import StatCard from './StatCard';
import ChartCard from './ChartCard';
import CounsellorCard from './CounsellorCard';
import EngagementCard from './EngagementCard'; // For the bottom section

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB] font-sans">
      {/* 1. Header/Navigation (You'd implement this) */}
      {/* <Header />  */}

      <div className="p-8 max-w-7xl mx-auto">
        {/* Admin Dashboard Title */}
        <h1 className="text-5xl font-semibold text-[#000459]">Admin Dashboard</h1>
        <p className="text-gray-500 mb-6">Monitor platform health and user engagement</p>

        {/* 2. STAT CARDS SECTION (Flexbox Layout) */}
        <div className="flex flex-wrap gap-4 mb-8">
          <StatCard title="Total Users" value="1287" colorClass="bg-[#7F56D9]" />
          <StatCard title="Active this month" value="745" colorClass="bg-[#F79009]" />
          <StatCard title="Check-ins Today" value="476" colorClass="bg-[#2970FF]" />
          <StatCard title="Average Mood Score" value="3.8/5" colorClass="bg-[#4CAF50]" />
          <StatCard title="Assessments Today" value="97" colorClass="bg-[#5C6BC0]" />
        </div>

        {/* 3. CHARTS SECTION (Grid Layout) */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Growth trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="User Growth trends" icon="📈">
            {/* Placeholder for your actual chart component (e.g., LineChart from Recharts) */}
            <div className="flex items-center justify-center h-full text-gray-400">
              [Line Chart Placeholder]
            </div>
          </ChartCard>

          <ChartCard title="Platform mood score" icon="😊">
            {/* Placeholder for your actual chart component */}
            <div className="flex items-center justify-center h-full text-gray-400">
              [Line Chart Placeholder]
            </div>
          </ChartCard>
        </div>

        {/* 4. COUNSELLOR DATA SECTION */}
        <div className="mb-8">
            <CounsellorCard />
        </div>

        {/* 5. ENGAGEMENT ANALYTICS SECTION (Grid Layout) */}
        <div className="mb-8">
            <EngagementCard /> {/* <-- RENDER THE ENGAGEMENT DATA HERE */}
        </div>
        
        {/* Footer Text */}
        <div className="text-center mt-12 text-gray-400">
            Don't worry Be happy
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;