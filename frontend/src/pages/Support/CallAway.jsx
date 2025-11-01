import React from 'react';
// Import necessary hooks for navigation
// import { useNavigate } from 'react-router-dom'; // Replaced for preview
import { 
    Phone, 
    MessageSquare, 
    Briefcase, // This icon is imported but not used in the component
    Lock, 
    AlertTriangle, 
    LifeBuoy, 
    Heart, 
    Twitter, // This icon is imported but not used in the component
    MessageCircle, 
    Info,
    Coffee // Added for 7 Cups
} from 'lucide-react'; 

// --- Stub useNavigate for preview ---
// In a real multi-page app, you would import this from 'react-router-dom'
const useNavigate = () => (path) => {
    console.log(`Mock navigation to: ${path}`);
    // This function simulates the navigation hook
};

// --- 1. EmergencyButton Component (UPDATED: duration-150 -> duration-300) ---
const EmergencyButton = ({ title, number, color }) => (
    <a 
        href={`tel:${number}`} 
        // CHANGED: duration-150 -> duration-300
        className={`p-4 rounded-lg flex flex-col items-center justify-center min-w-[120px] shadow-md border-2 border-gray-100 bg-${color}-50 hover:bg-${color}-100 transition duration-300 cursor-pointer no-underline text-current`}
    >
        <div className={`text-3xl text-${color}-600 mb-1`}>
            {number === '911' && <AlertTriangle size={32} />}
            {number === '988' && <LifeBuoy size={32} />}
            {number === '741741' && <MessageSquare size={32} />}
        </div>
        <div className={`text-xl font-bold text-${color}-800`}>{number}</div>
        <div className="text-xs text-gray-600 mt-1 text-center leading-snug">{title}</div>
    </a>
);

// --- 2. HotlineCard Component (UPDATED: duration-150 -> duration-300 on buttons) ---
const HotlineCard = ({ title, number, description, tags, color, navigate }) => (
    <div className="w-full lg:w-1/2 p-2"> 
        {/* RESET BG: Always use white background and simple border for all cards */}
        <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200"> 
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center"> 
                    
                    {/* ICON COLOR LOGIC: Use 'red-600' if color prop is 'red', otherwise use the appropriate color */}
                    <Phone 
                        size={20} 
                        className={`mr-2 ${color === 'red' ? 'text-red-600' : `text-${color}-600`}`} 
                    /> 
                    
                    {/* TEXT COLOR: Always use dark text for the number */}
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{number}</h3> 
                </div>
                
                <div className="flex space-x-2">
                    {/* TAGS: Always use standard white/light backgrounds for the top tags */}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Text</span> 
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Chat</span>  
                </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">{description}</p> 
            
            <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, index) => (
                    <span key={index} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {tag}
                    </span>
                ))}
            </div>
            
            <div className="flex space-x-4 mt-4">
                {/* 1. Call Now Button (UPDATED: duration-150 -> duration-300) */}
                <a 
                    href={`tel:${number.replace(/\D/g, '')}`} // Clean number for dialer
                    className="flex items-center space-x-1 p-2 rounded-lg border border-blue-400 text-blue-600 hover:bg-blue-50 transition duration-300 no-underline"
                >
                    <Phone size={16} /><span>Call Now</span>
                </a>

                {/* 2. Text Button (UPDATED: duration-150 -> duration-300) */}
                <a 
                    href={`sms:${number.replace(/\D/g, '')}`} // Use sms: protocol
                    className="flex items-center space-x-1 p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition duration-300 no-underline"
                >
                    <MessageSquare size={16} /><span>Text</span>
                </a>

                {/* 3. Chat Button (UPDATED: duration-150 -> duration-300) */}
                <button 
                    onClick={() => navigate('/ChatPage')} // Navigate to the chatbot route
                    className="flex items-center space-x-1 p-2 rounded-lg border border-green-400 text-green-600 hover:bg-green-50 transition duration-300"
                >
                    <MessageCircle size={16} /><span>Chat</span>
                </button>
            </div>
        </div>
    </div>
);
// --- 3. OnlineResourceCard Component (UPDATED: duration-150 -> duration-300 & icon logic) ---
const OnlineResourceCard = ({ title, description, icon: IconComponent, color, siteUrl }) => ( 
    <div className="flex flex-col items-center text-center p-4 m-2 w-[220px] bg-white rounded-lg shadow-md border border-gray-200">
        <div className={`p-2 mb-2 rounded-full bg-white border-2 border-${color}-100 w-10 h-10 flex items-center justify-center text-${color}-600`}>
            {/* Updated logic to render icon component instead of img path */}
            {IconComponent ? (
                <IconComponent size={24} />
            ) : (
                <div className={`w-3 h-3 rounded-full bg-${color}-400`}></div>
            )}
        </div>
        <h5 className="font-semibold text-gray-800 text-base">{title}</h5>
        <p className="text-xs text-gray-500 mb-3">{description}</p>
        <a 
            href={siteUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            // CHANGED: duration-150 -> duration-300
            className="flex items-center justify-center w-full py-2 text-sm text-white bg-green-500 rounded-full hover:bg-green-600 transition duration-300 cursor-pointer no-underline"
        >
            Visit Site
        </a>
    </div>
);

// --- 4. Main CallAway Component (UPDATED: Replaced img tags with icons) ---
const CallAway = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 font-sans">
            
            <header className="text-center mb-12">
                <h1 className="text-5xl font-semibold text-[#000459] mb-2">
                    Help is just a Call Away
                </h1>
                <p className="text-gray-600 mt-2 italic">
                    Quick connections to care, guidance, and emergency assistance.
                </p>
            </header>

            <section className="max-w-3xl mx-auto bg-red-600 p-8 rounded-xl shadow-2xl mb-12">
                <h2 className="text-2xl font-semibold text-white text-center mb-8">
                    Immediate Emergency Numbers
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <EmergencyButton title="Life-threatening Emergency" number="911" color="red" />
                    <EmergencyButton title="Suicide Prevention Lifeline" number="988" color="yellow" />
                    <EmergencyButton title="Crisis Text Line" number="741741" color="red" />
                </div>
            </section>

            {/* Contact Hotlines (Passing the navigate function) */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
                    Contact Hotlines
                </h2>
                <div className="max-w-5xl mx-auto flex flex-wrap -m-2">
                    <HotlineCard 
                        title="National Suicide Prevention Lifeline" 
                        number="988" 
                        description="24/7 confidential support for people in distress and those who care for them."
                        tags={['Call now', 'Confidential', '24/7', 'Chat', 'TTY/TDD']}
                        color="blue"
                        navigate={navigate} // Pass navigate to the card
                    />

                    <HotlineCard 
                        title="Emergency Services" 
                        number="911" 
                        description="Immediate response for any immediate emergency, medical, fire, or police related issue."
                        tags={['Immediate response', 'Medical', 'Safety', 'Police']}
                        color="red"
                        navigate={navigate} // Pass navigate to the card
                    />
                    
                    <HotlineCard 
                        title="National Domestic Violence Hotline" 
                        number="1-800-799-7233" 
                        description="Provides confidential support and resources to survivors of domestic violence."
                        tags={['Safety planning', 'Confidential', '24/7', 'Multilingual']}
                        color="indigo"
                        navigate={navigate} // Pass navigate to the card
                    />

                    <HotlineCard 
                        title="Campus Safety" 
                        number="(555) 911-SAFE" 
                        description="Immediate response for non-life-threatening campus safety issues and escort services."
                        tags={['Campus safety', 'Safety alerts', 'Escort program']}
                        color="yellow"
                        navigate={navigate} // Pass navigate to the card
                    />
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
                    Online Support Resources
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <OnlineResourceCard 
                        title="National Suicide Prevention Lifeline Chat" 
                        description="24/7 confidential online chat support." 
                        icon={MessageCircle} // REPLACED image path
                        color="green" 
                        siteUrl="https://988lifeline.org/chat/" 
                    />
                    <OnlineResourceCard 
                        title="Crisis Text Line" 
                        description="Text HOME to 741741 anytime, anywhere in the US." 
                        icon={MessageSquare} // REPLACED image path
                        color="red" 
                        siteUrl="https://www.crisistextline.org/" 
                    />
                    <OnlineResourceCard 
                        title="IMAlive Online Crisis Chat" 
                        description="Live, confidential support with trained volunteers." 
                        icon={Heart} // REPLACED image path
                        color="pink" 
                        siteUrl="https://www.imalive.org/" 
                    />
                    <OnlineResourceCard 
                        title="7 Cups Emotional Support" 
                        description="Connect with listeners and therapists for support." 
                        icon={Coffee} // REPLACED image path
                        color="blue" 
                        siteUrl="https://www.7cups.com/" 
                    />
                </div>
            </section>
            
            <section className="max-w-6xl mx-auto flex flex-wrap justify-between gap-4 px-4 mb-12">
                {/* When to Call Box (Bullets RED) */}
                <div className="w-full lg:w-[48%] bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
                        <Info size={24} className="mr-2 text-blue-600" /> {/* REPLACED image tag */}
                        When To Call
                    </h3>
                    {/* ADD list-disc and text-red-500 for marker color */}
                    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-2 list-inside marker:text-red-500">
                        <li>Thoughts of suicide or self-harm</li>
                        <li>Experiencing a mental health crisis or psychosis</li>
                        <li>Severe anxiety or panic attacks</li>
                        <li>Dangerous health situation</li>
                        <li>Substance abuse emergencies</li>
                    </ul>
                </div>

                <div className="w-full lg:w-[48%] bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100">
                    <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
                        <Lock size={24} className="mr-2 text-green-600" /> {/* REPLACED image tag */}
                        Your Privacy
                    </h3>
                    {/* ADD list-disc and text-green-500 for marker color */}
                    <ul className="list-disc ml-6 text-sm text-gray-700 space-y-2 list-inside marker:text-green-500">
                        <li>All calls are completely confidential</li>
                        <li>No identifiable information collected</li>
                        <li>No caller ID required</li>
                        <li>Support in multiple languages</li>
<li>Free of charge</li>
                    </ul>
                </div>
            </section>

            <footer className="text-center mt-10 text-gray-600 text-sm">
                <p>Don't worry Be happy</p>
            </footer>
        </div>
    );
};

export default CallAway;

