// src/components/StatCard.jsx

import React from 'react';

const StatCard = ({ title, value, colorClass }) => {
  // `colorClass` will be a Tailwind background/text class like 'bg-purple-600'
  return (
    <div className={`p-4 rounded-xl text-white ${colorClass} flex-1 min-w-[150px] shadow-lg`}>
      <p className="text-sm font-light opacity-80">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default StatCard;