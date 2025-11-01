// src/components/CounsellorCard.jsx

import React from 'react';

const DataRow = ({ label, value, valueClass }) => (
  <div className="flex justify-between items-center py-2 border-b last:border-b-0">
    <span className="text-gray-500">{label}</span>
    <span className={`font-semibold ${valueClass}`}>{value}</span>
  </div>
);

const CounsellorCard = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
        <span role="img" aria-label="counsellor" className="text-xl">
          ➕
        </span>{' '}
        <h3 className="ml-2">Counsellor Data</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Appointments */}
        <div>
          <DataRow label="Appointments Booked" value="239" valueClass="text-purple-600" />
          <DataRow label="Sessions Pending" value="56" valueClass="text-orange-500" />
          <DataRow label="Sessions Completed" value="183" valueClass="text-green-600" />
        </div>

        {/* Right Column: Rates & Ratings */}
        <div>
          <DataRow label="Average User Rating" value="4.2/5" valueClass="text-green-500" />
          <DataRow label="Cancellation Rate" value="12%" valueClass="text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default CounsellorCard;