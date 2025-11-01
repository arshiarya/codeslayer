// src/components/EngagementCard.jsx

import React from 'react';

// Using simple text/emojis as placeholders for the design icons
const ChatbotIcon = () => <span className="text-xl text-blue-500">🤖</span>;
const AssessmentIcon = () => <span className="text-xl text-orange-500">📋</span>;
const FlagIcon = () => <span className="text-xl text-green-500">🚩</span>;

// Helper component for the resource progress bars
const ResourceProgress = ({ title, percentage, colorClass }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-gray-700">{title}</span>
            <span className="font-bold text-gray-800">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className={`h-2 rounded-full ${colorClass}`} 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);


const EngagementCard = () => {
  return (
    <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Engagement analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Column: Resources (Bar Chart) - spanning 1 column */}
            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
                <p className="text-xs text-gray-500 mb-4">Most Viewed Content</p>
                
                {/* Progress Bars */}
                <ResourceProgress title="Videos" percentage={45} colorClass="bg-blue-600" />
                <ResourceProgress title="Audios" percentage={38} colorClass="bg-yellow-500" />
                <ResourceProgress title="Articles" percentage={17} colorClass="bg-cyan-500" />
                
                <div className="mt-6 pt-4 border-t">
                    <span className="text-gray-500">Average Completion:</span>
                    <span className="ml-2 text-lg font-bold text-green-600">82%</span>
                </div>
            </div>

            {/* Right Columns: Chatbot, Assessments, Flagged - spanning 2 columns */}
            <div className="md:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Chatbot Tile */}
                <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-gray-500">Chatbot</p>
                        <ChatbotIcon />
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-1">786</p>
                    <p className="text-xs text-gray-500">Conversations Initiated</p>
                </div>

                {/* Assessments Tile */}
                <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-gray-500">Assessments</p>
                        <AssessmentIcon />
                    </div>
                    <p className="text-3xl font-bold text-gray-800 mt-1">485</p>
                    <p className="text-xs text-gray-500">Assessments Completed</p>
                </div>

                {/* Flagged Content Tile (Spanning both columns) */}
                <div className="sm:col-span-2 bg-white p-4 rounded-xl shadow border border-gray-100">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Flagged Content</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">None</p>
                        </div>
                        <FlagIcon />
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EngagementCard;