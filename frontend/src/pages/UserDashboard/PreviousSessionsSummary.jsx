import React, { useState, useEffect } from 'react';
import { UserCircle, BookOpen, Clock, Calendar, Frown } from 'lucide-react';
import apiClient from '../../utils/apiClient'; // Assuming this utility is available

const API_BASE_URL = 'http://localhost:5050/api'; 
// --- Helper Function (Reused from your UpcomingAppointments component) ---
const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    
    return { formattedDate, formattedTime };
};

// --- Reusable Component for a Single Session Row ---
const SessionRow = ({ doctorName, sessionDate, sessionTime, bookingId }) => {
    // NOTE: In a real app, the 'View Summary' button would link 
    // to a detailed page using the bookingId.
    const handleViewSummary = () => {
        console.log(`Viewing summary for booking ID: ${bookingId}`);
        // Example: router.push(`/summary/${bookingId}`);
    };

    return (
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-3 last:mb-0 border border-gray-100">
            <div className="flex items-center space-x-3">
                <UserCircle className="w-10 h-10 text-blue-500" />
                <div>
                    <p className="text-gray-800 font-medium">{doctorName}</p>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{sessionDate}</span>
                        <span className="mx-1">•</span>
                        <Clock className="w-3 h-3" />
                        <span>{sessionTime}</span>
                    </p>
                </div>
            </div>
            <button 
                onClick={handleViewSummary}
                className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition duration-150"
            >
                View Summary
            </button>
        </div>
    );
};


// --- Main Component ---
const PreviousSessionsSummary = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPreviousSessions = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // ⚠️ NOTE: You'll need a different API endpoint for PAST sessions. 
                // I've guessed a logical path here.
                const response = await apiClient.fetchWithAuth('/api/bookings/my-past-sessions');

                if (!response.ok) {
                    throw new Error(`Failed to fetch sessions. Status: ${response.status}`);
                }
                
                const rawData = await response.json();
                
                setSessions(rawData.map(session => {
                    const { formattedDate, formattedTime } = formatDateTime(
                        session.schedule_date, 
                        session.schedule_time
                    );
                    return {
                        id: session.booking_id, // Important for keys and linking
                        doctorName: session.counsellor_name,
                        date: formattedDate,
                        time: formattedTime,
                    };
                }));

            } catch (err) {
                console.error("Failed to load previous sessions:", err);
                setError("Could not load past sessions. Please try again."); 
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPreviousSessions();

    }, []); // Empty dependency array means this runs only once on mount

    // --- Component Rendering ---

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="text-gray-600 w-5 h-5" />
                <h2 className="text-xl font-semibold text-gray-800">Previous Sessions Summary</h2>
            </div>
            
            <div className="min-h-[150px]">
                {/* 1. Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center h-full py-8 text-blue-600">
                        <Clock className="w-5 h-5 animate-spin mr-2" />
                        ... Loading Past Sessions...
                    </div>
                )}

                {/* 2. Error State */}
                {error && (
                    <div className="text-center py-8 text-red-500">
                        <Frown className="w-6 h-6 mx-auto mb-2" />
                        <p>{error}</p>
                    </div>
                )}
                
                {/* 3. No Data State */}
                {!isLoading && !error && sessions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <p className="font-medium">No previous sessions found.</p>
                        <p className="text-sm mt-1">Check back after your first session!</p>
                    </div>
                )}

                {/* 4. Display Sessions */}
                {!isLoading && sessions.length > 0 && (
                    <div className='divide-y divide-gray-100'>
                        {sessions.map((session) => (
                            <SessionRow
                                key={session.id} // Use a unique ID for the key
                                bookingId={session.id}
                                doctorName={session.doctorName}
                                sessionDate={session.date}
                                sessionTime={session.time}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviousSessionsSummary;