// src/components/ChartCard.jsx

import React from 'react';

const ChartCard = ({ title, children, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full">
      <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
        {icon}
        <h3 className="ml-2">{title}</h3>
      </div>
      {/* The actual chart library (like Recharts or Nivo) component will go here */}
      <div className="h-64 w-full">{children}</div>
    </div>
  );
};

export default ChartCard;