// WellnessCard.jsx
import React from 'react';

// Added directionsUrl to props
const WellnessCard = ({ title, address, phone, services, imageUrl, directionsUrl }) => (
  <div className="flex-1 min-w-[300px] max-w-[360px] bg-white border border-gray-200 rounded-lg shadow-md p-4 m-3 hover:shadow-lg transition duration-300">
    {/* Card Header and Image */}
    <h3 className="text-xl font-semibold text-center text-blue-900 mb-4">{title}</h3>
    <div className="mb-4">
      {/* Placeholder for the image */}
      <img
        src={imageUrl || 'https://via.placeholder.com/350x200?text=Center+Image'}
        alt={title}
        className="w-full h-48 object-cover rounded-md border border-gray-100"
      />
    </div>

    {/* Location and Hours */}
    <div className="text-sm text-gray-700 space-y-2 mb-4 p-2 border-b border-t border-gray-100">
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
        <p>{address}</p>
      </div>
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd"></path></svg>
        <p>Monday - Friday : 8AM - 4PM</p>
      </div>
      <div className="flex items-center">
        <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.772-1.549a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
        <p>{phone}</p>
      </div>
    </div>

    {/* Services Provided */}
    <div className="mb-6">
      <p className="text-xs font-bold text-gray-600 mb-2">SERVICES PROVIDED</p>
      <div className="flex flex-wrap gap-2">
        {services.map((service, index) => (
          <span
            key={index}
            className="px-3 py-1 text-xs font-medium text-blue-900 bg-blue-100 rounded-full border border-blue-200"
          >
            {service}
          </span>
        ))}
      </div>
    </div>

    {/* Directions Button (Changed from button to <a>) */}
    <a 
      href={directionsUrl}
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 no-underline"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      Directions
    </a>
  </div>
);

export default WellnessCard;