// ResourceIcon.jsx (Updated for consistent alignment and size)
import React from 'react';

const ResourceIcon = ({ icon, title, description, contact }) => (
  // Card container: Use flex-col and justify-start to push content from the top.
  <div className="flex flex-col items-center justify-start text-center p-6 m-3 w-[220px] h-[303px] bg-[#ddfof2] text-gray-800 rounded-lg shadow-lg border border-gray-200">
    
    {/* Icon */}
    <div className="text-4xl mb-4 text-yellow-500">
      {icon}
    </div>
    
    {/* Title Container: Enforced Height and Text Handling */}
    <div className="h-14 mb-2 flex items-center justify-center">
      <h4 className="text-xl font-serif font-bold text-gray-800 leading-tight">
        {title}
      </h4>
    </div>
    
    {/* Description (Text remains small) */}
    <p className="text-sm text-gray-600 mb-4 px-2">
      {description}
    </p>
    
    {/* Contact (Accent color text) */}
    <p className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer">
      {contact}
    </p>
  </div>
);

export default ResourceIcon;