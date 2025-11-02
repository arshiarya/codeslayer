import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Send, Mic, Flag, X } from 'lucide-react';
import { io } from 'socket.io-client'; 

const CHAT_API_BASE_URL = "http://localhost:5050/api";
const SOCKET_SERVER_URL = "http://localhost:5050";
const ROOM_ID = 1;

// --- AUTHENTICATION HELPER FUNCTIONS ---
const getTokens = () => {
    return {
        accessToken: localStorage.getItem('jwtToken') || localStorage.getItem('authToken') || localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken')
    };
};

const clearTokens = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error("No refresh token available.");
    
    const response = await fetch(`${CHAT_API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        throw new Error("Token refresh failed.");
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;
    localStorage.setItem('jwtToken', newAccessToken); 
    return newAccessToken;
};

const fetchAuthenticated = async (url, options, postStatusSetter) => {
    let { accessToken, refreshToken } = getTokens();
    
    const performFetch = (token) => fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
    
    const getBodyAndError = async (res) => {
        try {
            const data = await res.json();
            return { message: data.message || data.error || "Unknown JSON Error" };
        } catch (e) {
            return { message: await res.text() };
        }
    };

    let response = await performFetch(accessToken);

    if (response.status === 401) {
        postStatusSetter({ type: 'info', message: 'Token expired. Attempting to renew session...' });

        try {
            accessToken = await refreshAccessToken(refreshToken);
            response = await performFetch(accessToken);
        } catch (error) {
            clearTokens();
            postStatusSetter({ type: 'error', message: "Session expired. Please log in again." });
            throw new Error("Session expired.");
        }
    }
    
    if (!response.ok) {
        const errorData = await getBodyAndError(response);
        const errorMessage = errorData.message || `Server Error (${response.status})`;
        throw new Error(errorMessage);
    }
    
    return response;
};
// -----------------------------------------------------------


const ReachOutPage = () => {
    // --- CHAT STATE ---
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [postStatus, setPostStatus] = useState({ type: '', message: '' });

    // --- ANONYMITY & SOCKET STATE ---
    const [anonymousName, setAnonymousName] = useState('Guest');
    const [identityId, setIdentityId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false); 

    // --- MODERATION STATE ---
    const [showFlagModal, setShowFlagModal] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState(null); 
    const [flagReason, setFlagReason] = useState('');

    // --- UI/UTILITY STATE ---
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const currentUserId = '12345'; 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    // --- 1. INITIAL SETUP: JOIN ROOM & CONNECT SOCKET ---
    useEffect(() => {
        const { accessToken } = getTokens();
        
        if (!accessToken) {
             setPostStatus({ type: 'error', message: 'Authentication token is missing. Please log in.' });
             setIsAuthChecked(true); 
             return;
        }

        setIsAuthChecked(true); 
        
        const joinChat = async () => {
            setPostStatus({ type: 'info', message: 'Authenticating anonymous identity...' });
            
            try {
                const response = await fetchAuthenticated(
                    `${CHAT_API_BASE_URL}/chat/join/${ROOM_ID}`,
                    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
                    setPostStatus
                );

                const data = await response.json();
                
                setIdentityId(data.identity_id);
                setAnonymousName(data.anonymous_name);
                setPostStatus({ type: 'success', message: `Joined as ${data.anonymous_name}. Connecting to live chat...` });

                return data; 
            } catch (error) {
                console.error("Join Room Error:", error);
                setPostStatus({ type: 'error', message: `Error: ${error.message}. You cannot chat.` });
                return null;
            }
        };

        const identityPromise = joinChat();

        const newSocket = io(SOCKET_SERVER_URL, {
            withCredentials: true, 
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            setSocket(newSocket);
            
            identityPromise.then(identity => {
                if (identity && identity.identity_id) { 
                    newSocket.emit('joinRoom', ROOM_ID, identity.identity_id);
                }
            });
        });

        // 🌟 CHANGE 1: Listen for the server's join confirmation 🌟
        newSocket.on('joinedRoom', (data) => {
            if (data.success) {
                setPostStatus(prev => ({ 
                    type: 'success', 
                    // Only overwrite the status if the prior message wasn't an error
                    message: prev.type !== 'error' ? 'Successfully connected to live chat!' : prev.message 
                }));
            }
        });

        newSocket.on('newMessage', (message) => {
            setMessages(prevMessages => [message, ...prevMessages]); 
            scrollToBottom();
        });
        
        // 🌟 CHANGE 2: Listen for server-sent errors 🌟
        newSocket.on('errorMessage', (data) => {
            console.error("Socket Error from Server:", data.error);
            setPostStatus({ type: 'error', message: `Chat Error: ${data.error}` });
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            setPostStatus({ type: 'error', message: 'Disconnected from server.' });
        });

        return () => {
            newSocket.disconnect();
        };
    }, []); 

    // ... (rest of the component functions remain unchanged)
    useEffect(scrollToBottom, [messages]);
    
    const startVoiceInput = () => {
        setPostStatus({ type: 'info', message: 'Voice input active (functionality mocked).' });
        setIsListening(true);
        setTimeout(() => {
             setIsListening(false);
             setMessageText(prevText => (prevText + ' ' + 'Voice transcript example.').trim());
             setPostStatus({ type: 'success', message: 'Voice input stopped.' });
        }, 1500);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !socket || !identityId || !isConnected) {
            setPostStatus({ type: 'error', message: 'Cannot send. Not connected or missing identity.' });
            return;
        }

        const messagePayload = {
            identityId: identityId, 
            roomId: ROOM_ID,
            text: messageText.trim(),
        };

        socket.emit('sendMessage', messagePayload);
        
        setMessageText(''); 
    };
    
    const handleFlagClick = (messageId) => {
        setSelectedMessageId(messageId); 
        setShowFlagModal(true);
        setFlagReason('');
    };

    const handleReasonChange = (e) => {
        const value = e.target.value;
        setFlagReason(value === 'other' ? 'other:' : value);
    };

    const handleFlagSubmit = async () => {
        if (!flagReason.trim() || !selectedMessageId) return;

        setPostStatus({ type: 'info', message: 'Submitting flag for review...' });

        try {
            const response = await fetchAuthenticated(
                `${CHAT_API_BASE_URL}/moderation/flag/${selectedMessageId}`,
                { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason: flagReason }), 
                },
                setPostStatus
            );

            const data = await response.json();

            if (!response.ok) {
                const errorText = response.statusText || 'Unknown error';
                throw new Error(data.message || `Failed to flag message. Server response: ${response.status} ${errorText}`);
            }

            setPostStatus({ type: 'success', message: data.status || 'Message flagged successfully.' });
        } catch (error) {
            console.error('Flag Submission Error:', error);
            setPostStatus({ type: 'error', message: error.message.includes("Session expired") ? error.message : `Error flagging: ${error.message}` });
        } finally {
            setShowFlagModal(false);
            setSelectedMessageId(null);
            setFlagReason('');
        }
    };

    const handleFlagCancel = () => {
        setShowFlagModal(false);
        setSelectedMessageId(null);
        setFlagReason('');
    };
    
    // --- Render Content (UNCHANGED) ---

    if (!isAuthChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
                <div className="text-xl font-semibold text-[#2B5A7A]">Checking authentication...</div>
            </div>
        );
    }

    const tokenMissing = !getTokens().accessToken;
    if (tokenMissing) {
         return (
            <div className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
                    <p className="text-lg text-gray-700">Authentication token is missing. Please log in to access the anonymous chat.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
            <div className="container mx-auto px-4 py-8 max-w-xl">

                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-6 relative z-10 border-b pb-4">
                        <div className="flex items-center gap-4">
                            <img src="https://placehold.co/40x40/FFF9C4/E8A287?text=🗣️" alt="Chat" className="w-10 h-10 rounded-full" />
                            <div>
                                <h2 className="text-xl font-bold text-[#2B5A7A]">The Anonymous Chat</h2>
                                <p className="text-xs text-gray-500">
                                    You are: <span className="font-semibold text-blue-500">{anonymousName}</span> | 
                                    Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>{isConnected ? "Live" : "Connecting..."}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {postStatus.message && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${postStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {postStatus.message}
                        </div>
                    )}
                    
                    {/* Chat Feed (UNCHANGED) */}
                    <div className="space-y-4 h-96 overflow-y-auto flex flex-col-reverse p-2">
                        {[...messages].map((message) => (
                            <div
                                key={message.messageId}
                                className="rounded-xl p-3 bg-[#EDF3F8] relative transition duration-150 ease-in-out hover:shadow-md"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <p className="font-bold text-sm text-[#2B5A7A]">{message.sender}</p>
                                    <button
                                        onClick={() => handleFlagClick(message.messageId)}
                                        className="text-slate-400 hover:text-red-500 p-1 rounded-full transition"
                                        title="Flag this message for review"
                                    >
                                        <Flag className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-sm text-slate-700 break-words pr-8">{message.text}</p>
                                <p className="text-xs text-slate-500 text-right mt-1">
                                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : 'sending...'}
                                </p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 mt-10">Start the conversation!</div>
                        )}
                    </div>

                    {/* Flag Modal (UNCHANGED) */}
                    {showFlagModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                             <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                                <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4">
                                    Flag this message
                                </h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Please select a reason for flagging:
                                    </label>
                                    <select
                                        value={flagReason.startsWith('other:') ? 'other' : flagReason}
                                        onChange={handleReasonChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select a reason</option>
                                        <option value="inappropriate">Inappropriate Content</option>
                                        <option value="harassment">Harassment</option>
                                        <option value="spam">Spam</option>
                                        <option value="hate_speech">Hate Speech</option>
                                        <option value="misinformation">Misinformation</option>
                                        <option value="other">Other</option>
                                    </select>
                                    {flagReason.startsWith('other:') && (
                                        <textarea
                                            placeholder="Please specify the reason..."
                                            className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="3"
                                            value={flagReason.replace('other:', '').trim()}
                                            onChange={(e) => setFlagReason(`other: ${e.target.value}`)}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={handleFlagCancel}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleFlagSubmit}
                                        disabled={!flagReason}
                                        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                            flagReason
                                                ? 'bg-red-500 hover:bg-red-600'
                                                : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                    >
                                        Submit Flag
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message Input (UNCHANGED) */}
                    <div className="mt-6 pt-4 border-t border-slate-200">
                        <form onSubmit={handleSendMessage}>
                            <div className="flex items-center gap-3 bg-slate-50 rounded-full px-5 py-3 border border-slate-200">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm"
                                    required
                                    disabled={!isConnected}
                                />
                                <button 
                                    type="button" 
                                    onClick={startVoiceInput}
                                    className={`text-slate-500 hover:text-slate-700 transition ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                                    disabled={!isConnected}
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                                <button type="submit" className={`transition ${isConnected ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'}`} disabled={!isConnected}>
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReachOutPage;