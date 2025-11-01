import React from 'react';
import { UserCircle, BookOpen } from 'lucide-react';

const PreviousSessionsSummary = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="text-gray-600 w-5 h-5" />
        <h2 className="text-xl font-semibold text-gray-800">Previous Sessions summary</h2>
      </div>
      
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <UserCircle className="w-10 h-10 text-blue-500" />
          <div>
            <p className="text-gray-800 font-medium">Dr Vinod</p>
            <p className="text-sm text-gray-500">Sep 8, 10:00 AM</p>
          </div>
        </div>
        <button className="text-blue-500 text-sm font-medium hover:text-blue-700">
          View Summary
        </button>
      </div>
    </div>
  );
};

export default PreviousSessionsSummary;