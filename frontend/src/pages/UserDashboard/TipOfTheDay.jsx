import React from 'react';

// Define a list of tips/quotes. Expand this list as much as possible!
const DAILY_TIPS = [
  "Try a 5-minute meditation before bed tonight.",
  "Practice the 4-7-8 breathing technique when you feel stressed.",
  "Reach out to one friend or family member you haven't spoken to in a week.",
  "Take a 15-minute walk outdoors today, even if it's just around the block.",
  "Write down three things you are grateful for before starting your day.",
  "Limit your screen time 30 minutes before going to sleep.",
  "Drink a glass of water first thing in the morning before coffee.",
  "Listen to your favorite music for 10 minutes to boost your mood.",
  "Take five minutes to organize a small part of your living space.",
  "Challenge a negative thought by asking: 'Is this 100% true?'"
];

const TipOfTheDay = () => {
  
  // Function to calculate the day of the year (0-364)
  const getDayOfYear = () => {
    const now = new Date();
    // Get the start of the year (Jan 1, 00:00:00)
    const start = new Date(now.getFullYear(), 0, 0); 
    // Calculate the difference in milliseconds
    const diff = now.getTime() - start.getTime(); 
    // Define milliseconds in one day
    const oneDay = 1000 * 60 * 60 * 24;
    // Return the floor of the difference divided by one day
    return Math.floor(diff / oneDay); 
  };

  const dayNumber = getDayOfYear();
  
  // Use the day number modulo the array length to select a tip.
  // This ensures the tips cycle through the array consistently, repeating 
  // once the day number exceeds the array length.
  const index = dayNumber % DAILY_TIPS.length;
  
  const currentTip = DAILY_TIPS[index];
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 h-full">
      <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
        Tip of the Day 💡
      </h3>
      <p className="text-xl font-medium text-gray-800">
        {currentTip}
      </p>
    </div>
  );
};

export default TipOfTheDay;