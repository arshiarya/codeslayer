// import React, { useState } from 'react';
// import { Heart, MessageCircle, Send, Mic, Flag } from 'lucide-react';
// import CommunityHeader from './CommunityHeader';

// const ReachOutPage = () => {
//   const [messageText, setMessageText] = useState('');
//   const [showFlagModal, setShowFlagModal] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [flagReason, setFlagReason] = useState('');
//   const [posts, setPosts] = useState([
//     {
//       id: 1,
//       user: 'USER 1',
//       avatar: 'https://via.placeholder.com/40',
//       timestamp: '2 days ago',
//       text: "I've been dealing with depression for a while. Some days are really hard, but sharing here makes me feel less isolated.",
//       likes: 12,
//       isLiked: false,
//       isFlagged: false,
//       isResponse: false,
//       parentId: null
//     },
//     {
//       id: 2,
//       user: 'USER 2',
//       avatar: 'https://via.placeholder.com/40',
//       timestamp: '1 day ago',
//       text: "Sending you strength. It's brave to open up like this.",
//       likes: 8,
//       isLiked: false,
//       isResponse: true,
//       parentId: 1
//     }
//   ]);

//   const handleLike = (postId) => {
//     setPosts(posts.map(post =>
//       post.id === postId
//         ? {
//             ...post,
//             likes: post.isLiked ? post.likes - 1 : post.likes + 1,
//             isLiked: !post.isLiked
//           }
//         : post
//     ));
//   };

//   const handleFlagClick = (postId) => {
//     setSelectedPostId(postId);
//     setShowFlagModal(true);
//     setFlagReason('');
//   };

//   const handleReasonChange = (e) => {
//     const value = e.target.value;
//     if (value === 'other') {
//       setFlagReason('other:');
//     } else {
//       setFlagReason(value);
//     }
//   };

//   const handleFlagSubmit = () => {
//     if (!flagReason.trim()) return;
    
//     setPosts(posts.map(post =>
//       post.id === selectedPostId
//         ? {
//             ...post,
//             isFlagged: true,
//             flagReason: flagReason.trim()
//           }
//         : post
//     ));
//     setShowFlagModal(false);
//     setSelectedPostId(null);
//     setFlagReason('');
//   };

//   const handleFlagCancel = () => {
//     setShowFlagModal(false);
//     setSelectedPostId(null);
//     setFlagReason('');
//   };

//   return (
//     <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
//       <div className="container mx-auto px-4 py-8 max-w-5xl">
//         <CommunityHeader activeTab="ReachOut" />

//         <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//           <div className="flex items-center justify-between mb-10 relative z-10">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-full flex items-center justify-center">
//                 <img src="/reach-out.png" alt="Reach Out" className="w-20 h-20 object-contain" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-[#2B5A7A]">Reach Out & Be Heard</h2>
//                 <p className="text-sm text-gray-500">A supportive environment for sharing experiences</p>
//               </div>
//             </div>
//           </div>

//           {/* Support Resources */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//             {[
//               { title: "Share Experiences", desc: "Express your thoughts" },
//               { title: "Community Support", desc: "Connect with others" },
//               { title: "Professional Resources", desc: "Access guidance" }
//             ].map((action, index) => (
//               <div key={index} className="bg-[#EDF3F8] p-4 rounded-xl">
//                 <h3 className="font-semibold text-[#2B5A7A] mb-1">{action.title}</h3>
//                 <p className="text-sm text-slate-600">{action.desc}</p>
//               </div>
//             ))}
//           </div>

//           <div className="space-y-6">
//             {posts.map((post) => (
//               <div
//                 key={post.id}
//                 className={`rounded-2xl p-5 bg-[#EDF3F8] relative ${
//                   post.isResponse ? 'ml-10 border-l-4 border-[#B5D8EB] pl-4' : ''
//                 }`}
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   <img
//                     src={post.avatar}
//                     alt={post.user}
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                   <div>
//                     <p className="font-bold text-sm text-[#2B5A7A]">{post.user}</p>
//                     <p className="text-xs text-slate-500">{post.timestamp}</p>
//                   </div>
//                 </div>

//                 <p className="text-sm text-slate-700 mb-3">{post.text}</p>

//                 <div className="flex items-center gap-4 mt-3">
//                   <button
//                     onClick={() => handleLike(post.id)}
//                     className={`flex items-center gap-2 ${
//                       post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
//                     }`}
//                   >
//                     <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
//                     <span className="text-sm font-medium">{post.likes}</span>
//                   </button>

//                   <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600">
//                     <MessageCircle className="w-5 h-5" />
//                     <span className="text-sm font-medium">Reply</span>
//                   </button>

//                   <button
//                     onClick={() => handleFlagClick(post.id)}
//                     className={`flex items-center gap-2 ${
//                       post.isFlagged
//                         ? 'text-yellow-500'
//                         : 'text-slate-400 hover:text-yellow-500'
//                     }`}
//                     title={post.isFlagged ? 'Post has been flagged' : 'Flag this post'}
//                   >
//                     <Flag className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Flag Modal */}
//           {showFlagModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//                 <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4">
//                   Flag this post
//                 </h3>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Please select a reason for flagging:
//                   </label>
//                   <select
//                     value={flagReason.startsWith('other:') ? 'other' : flagReason}
//                     onChange={handleReasonChange}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select a reason</option>
//                     <option value="inappropriate">Inappropriate Content</option>
//                     <option value="harassment">Harassment</option>
//                     <option value="spam">Spam</option>
//                     <option value="hate_speech">Hate Speech</option>
//                     <option value="misinformation">Misinformation</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {flagReason.startsWith('other:') && (
//                     <textarea
//                       placeholder="Please specify the reason..."
//                       className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       rows="3"
//                       value={flagReason.replace('other:', '').trim()}
//                       onChange={(e) => setFlagReason(`other: ${e.target.value}`)}
//                     />
//                   )}
//                 </div>
//                 <div className="flex justify-end gap-3">
//                   <button
//                     onClick={handleFlagCancel}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleFlagSubmit}
//                     disabled={!flagReason}
//                     className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
//                       flagReason
//                         ? 'bg-red-500 hover:bg-red-600'
//                         : 'bg-gray-300 cursor-not-allowed'
//                     }`}
//                   >
//                     Submit Flag
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Message Input */}
//           <div className="mt-10 pt-6 border-t border-slate-200">
//             <label className="block text-sm font-medium text-[#2B5A7A] mb-2">
//               Share what's on your mind
//             </label>
//             <div className="flex items-center gap-3 bg-slate-50 rounded-full px-5 py-3 border border-slate-200">
//               <input
//                 type="text"
//                 placeholder="Type here..."
//                 value={messageText}
//                 onChange={(e) => setMessageText(e.target.value)}
//                 className="flex-1 bg-transparent border-none outline-none text-sm"
//               />
//               <button className="text-slate-500 hover:text-slate-700">
//                 <Mic className="w-5 h-5" />
//               </button>
//               <button className="text-blue-500 hover:text-blue-600">
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         <footer className="text-center mt-10 text-gray-600 text-sm">
//                 <p>Don't worry Be happy</p>
//             </footer>
//       </div>
//     </div>
//   );
// };

// export default ReachOutPage;


// import React, { useState, useEffect } from 'react';
// import { Heart, MessageCircle, Send, Mic, Flag, X } from 'lucide-react';

// // Assuming shared components and API base URL
// import CommunityHeader from './CommunityHeader'; 
// const API_BASE_URL = "http://localhost:5050/api/stories"; 

// const ReachOutPage = () => {
//     // --- STATE MANAGEMENT ---
//     const [posts, setPosts] = useState([]); // Will hold fetched posts/stories
//     const [messageText, setMessageText] = useState(''); // For the persistent post input
//     const [postStatus, setPostStatus] = useState({ type: '', message: '' });

//     const [showFlagModal, setShowFlagModal] = useState(false);
//     const [selectedPostId, setSelectedPostId] = useState(null);
//     const [flagReason, setFlagReason] = useState('');

//     const currentUserId = '66f3e1b7f3d5b0a8c2f218a0'; // Mock User ID
    
//     // Utility functions for rendering populated user data (from ListenLearnPage)
//     const getAvatarSrc = (user) => (user?.avatarUrl || 'https://placehold.co/40x40/E8A287/FFFFFF?text=USER');
//     const getUsername = (user) => (user?.username || 'Community User');

//     // =======================================================
//     // 1. DATA FETCHING ON LOAD
//     // =======================================================
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await fetch(API_BASE_URL);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch posts from API.');
//                 }
//                 const data = await response.json();
//                 setPosts(data); 
//             } catch (error) {
//                 console.error("Error fetching posts:", error);
//                 setPostStatus({ type: 'error', message: 'Could not load community posts.' });
//             }
//         };

//         fetchPosts();
//     }, []); 

//     // =======================================================
//     // 2. HANDLERS
//     // =======================================================

//     const handleLike = (postId) => {
//         // NOTE: This logic still needs API integration
//         setPosts(
//             posts.map((post) =>
//                 post._id === postId // Use post._id
//                     ? {
//                           ...post,
//                           likes: post.isLiked ? post.likes - 1 : post.likes + 1,
//                           isLiked: !post.isLiked,
//                       }
//                     : post
//             )
//         );
//     };

//     const handleFlagClick = (postId) => {
//         setSelectedPostId(postId);
//         setShowFlagModal(true);
//         setFlagReason('');
//     };

//     const handleReasonChange = (e) => {
//         const value = e.target.value;
//         setFlagReason(value === 'other' ? 'other:' : value);
//     };

//     // Implements the deletion logic (copied from ListenLearnPage)
//     const handleFlagSubmit = async () => {
//         if (!flagReason.trim() || !selectedPostId) return;

//         setPostStatus({ type: 'info', message: 'Submitting flag for review...' });

//         try {
//             const response = await fetch(`${API_BASE_URL}/${selectedPostId}/flag`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ reason: flagReason }), 
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to flag post.');
//             }

//             if (data.status === 'deleted') {
//                  // Remove the post from the list
//                 setPosts(prevPosts => prevPosts.filter(post => post._id !== selectedPostId));
//                 setPostStatus({ type: 'success', message: data.message || 'Post deleted after reaching flag limit.' });
//             } else {
//                 // Update the state to reflect that the post is flagged
//                 setPosts(prevPosts =>
//                     prevPosts.map(post =>
//                         post._id === selectedPostId
//                             ? { ...post, isFlagged: true } 
//                             : post
//                     )
//                 );
//                 setPostStatus({ type: 'success', message: data.message || 'Post flagged successfully.' });
//             }
//         } catch (error) {
//             console.error('Flag Submission Error:', error);
//             setPostStatus({ type: 'error', message: `Error flagging post: ${error.message}` });
//         } finally {
//             setShowFlagModal(false);
//             setSelectedPostId(null);
//             setFlagReason('');
//         }
//     };

//     const handleFlagCancel = () => {
//         setShowFlagModal(false);
//         setSelectedPostId(null);
//         setFlagReason('');
//     };
    
//     // Handler for creating a new main post (like the StoryForm submission)
//     const handleCreateNewPost = async (e) => {
//         e.preventDefault();
//         if (!messageText.trim()) return;

//         setPostStatus({ type: 'info', message: 'Posting conversation starter...' });

//         try {
//             const response = await fetch(API_BASE_URL, { 
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ userId: currentUserId, content: messageText.trim() }),
//             });
            
//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to post message.');
//             }

//             // Add the new, populated post to the top of the feed
//             setPosts(prevPosts => [data, ...prevPosts]);
//             setPostStatus({ type: 'success', message: 'Conversation starter posted successfully!' });
//             setMessageText(''); // Clear input

//         } catch (error) {
//             console.error('Post Creation Error:', error);
//             setPostStatus({ type: 'error', message: `Error posting message: ${error.message}` });
//         }
//     };
    
//     // Handler for replies (similar to comment logic, but tailored for this thread structure)
//     const handleReplyToPost = (postId) => {
//         // NOTE: In this view, 'Reply' should probably open the main input field
//         // pre-filled with an @mention, or open a simple modal/input specific to the reply.
//         // For simplicity, we'll open a confirmation prompt to show where the reply goes.
//         if (window.confirm(`Are you sure you want to reply directly to this post? This feature needs its own dedicated input/modal.`)) {
//             // Since this component uses a simple flat list for posts, the reply structure is complex.
//             // For now, we'll direct them to the main input.
//              setPostStatus({ type: 'info', message: `Feature placeholder: Starting reply to ${postId}. Use the input below.` });
//         }
//     };


//     return (
//         <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
//             <div className="container mx-auto px-4 py-8 max-w-5xl">
//                 <CommunityHeader activeTab="ReachOutPage" />

//                 <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//                     <div className="flex items-center justify-between mb-10 relative z-10">
//                         <div className="flex items-center gap-4">
//                             <div className="w-16 h-16 rounded-full flex items-center justify-center">
//                                 {/* Using placeholder image URL */}
//                                 <img src="https://placehold.co/80x80/FFF9C4/E8A287?text=🗣️" alt="Reach Out" className="w-20 h-20 object-contain" />
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold text-[#2B5A7A]">Reach Out & Be Heard</h2>
//                                 <p className="text-sm text-gray-500">A supportive environment for sharing experiences</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Status Message */}
//                     {postStatus.message && (
//                         <div className={`p-3 rounded-lg mb-4 text-sm ${postStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                             {postStatus.message}
//                         </div>
//                     )}
                    
//                     {/* Support Resources */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                         {[
//                             { title: "Share Experiences", desc: "Express your thoughts" },
//                             { title: "Community Support", desc: "Connect with others" },
//                             { title: "Professional Resources", desc: "Access guidance" }
//                         ].map((action, index) => (
//                             <div key={index} className="bg-[#EDF3F8] p-4 rounded-xl">
//                                 <h3 className="font-semibold text-[#2B5A7A] mb-1">{action.title}</h3>
//                                 <p className="text-sm text-slate-600">{action.desc}</p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Post Feed */}
//                     <div className="space-y-6">
//                         {posts.map((post) => (
//                             <div
//                                 key={post._id} // Use post._id
//                                 className={`rounded-2xl p-5 bg-[#EDF3F8] relative ${
//                                     // NOTE: The backend API returns a flat list, so we treat comments (replies) as separate posts here
//                                     post.comments?.length > 0 ? 'border-l-4 border-[#B5D8EB] pl-6' : ''
//                                 }`}
//                             >
//                                 <div className="flex items-center gap-3 mb-3">
//                                     <img
//                                         src={getAvatarSrc(post.userId)}
//                                         alt={getUsername(post.userId)}
//                                         className="w-8 h-8 rounded-full object-cover"
//                                     />
//                                     <div>
//                                         <p className="font-bold text-sm text-[#2B5A7A]">{getUsername(post.userId)}</p>
//                                         <p className="text-xs text-slate-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'just now'}</p>
//                                     </div>
//                                 </div>

//                                 <p className="text-sm text-slate-700 mb-3">{post.content}</p>

//                                 <div className="flex items-center gap-4 mt-3">
//                                     <button
//                                         onClick={() => handleLike(post._id)}
//                                         className={`flex items-center gap-2 ${
//                                             post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
//                                         }`}
//                                     >
//                                         <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
//                                         <span className="text-sm font-medium">{post.likes}</span>
//                                     </button>

//                                     <button 
//                                         onClick={() => handleReplyToPost(post._id)}
//                                         className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
//                                     >
//                                         <MessageCircle className="w-5 h-5" />
//                                         <span className="text-sm font-medium">Reply ({post.comments ? post.comments.length : 0})</span>
//                                     </button>

//                                     <button
//                                         onClick={() => handleFlagClick(post._id)}
//                                         className={`flex items-center gap-2 ${
//                                             post.isFlagged
//                                                 ? 'text-yellow-500'
//                                                 : 'text-slate-400 hover:text-yellow-500'
//                                         }`}
//                                         title={post.isFlagged ? 'Post has been flagged' : 'Flag this post'}
//                                     >
//                                         <Flag className="w-5 h-5" />
//                                     </button>
//                                 </div>
                                
//                                 {/* Render Replies/Comments nested within the main post */}
//                                 {post.comments && post.comments.length > 0 && (
//                                     <div className="mt-4 border-t border-slate-300 pt-3 space-y-3">
//                                         {post.comments.map((comment) => (
//                                             <div key={comment._id || comment.createdAt} className="flex gap-3 text-xs">
//                                                 <img 
//                                                     src={getAvatarSrc(comment.userId)} 
//                                                     alt={getUsername(comment.userId)}
//                                                     className="w-6 h-6 rounded-full object-cover"
//                                                 />
//                                                 <div>
//                                                     <p className="font-bold text-[#2B5A7A] inline mr-2">{getUsername(comment.userId)}</p>
//                                                     <span className="text-slate-600">{comment.content}</span>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* Flag Modal (UNCHANGED) */}
//                     {showFlagModal && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//                                 <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4">
//                                     Flag this post
//                                 </h3>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Please select a reason for flagging:
//                                     </label>
//                                     <select
//                                         value={flagReason.startsWith('other:') ? 'other' : flagReason}
//                                         onChange={handleReasonChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     >
//                                         <option value="">Select a reason</option>
//                                         <option value="inappropriate">Inappropriate Content</option>
//                                         <option value="harassment">Harassment</option>
//                                         <option value="spam">Spam</option>
//                                         <option value="hate_speech">Hate Speech</option>
//                                         <option value="misinformation">Misinformation</option>
//                                         <option value="other">Other</option>
//                                     </select>
//                                     {flagReason.startsWith('other:') && (
//                                         <textarea
//                                             placeholder="Please specify the reason..."
//                                             className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             rows="3"
//                                             value={flagReason.replace('other:', '').trim()}
//                                             onChange={(e) => setFlagReason(`other: ${e.target.value}`)}
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="flex justify-end gap-3">
//                                     <button
//                                         onClick={handleFlagCancel}
//                                         className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleFlagSubmit}
//                                         disabled={!flagReason}
//                                         className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
//                                             flagReason
//                                                 ? 'bg-red-500 hover:bg-red-600'
//                                                 : 'bg-gray-300 cursor-not-allowed'
//                                         }`}
//                                     >
//                                         Submit Flag
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Message Input (MODIFIED TO BE A FORM) */}
//                     <div className="mt-10 pt-6 border-t border-slate-200">
//                         <label className="block text-sm font-medium text-[#2B5A7A] mb-2">
//                             Share what's on your mind
//                         </label>
//                         <form onSubmit={handleCreateNewPost}>
//                             <div className="flex items-center gap-3 bg-slate-50 rounded-full px-5 py-3 border border-slate-200">
//                                 <input
//                                     type="text"
//                                     placeholder="Type here..."
//                                     value={messageText}
//                                     onChange={(e) => setMessageText(e.target.value)}
//                                     className="flex-1 bg-transparent border-none outline-none text-sm"
//                                     required
//                                 />
//                                 <button type="button" className="text-slate-500 hover:text-slate-700">
//                                     <Mic className="w-5 h-5" />
//                                 </button>
//                                 <button type="submit" className="text-blue-500 hover:text-blue-600">
//                                     <Send className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//                 <footer className="text-center mt-10 text-gray-600 text-sm">
//                         <p>Don't worry Be happy</p>
//                     </footer>
//             </div>
//         </div>
//     );
// };

// export default ReachOutPage;


// import React, { useState, useEffect } from 'react';
// import { Heart, MessageCircle, Send, Mic, Flag, X } from 'lucide-react';

// // Assuming shared components and API base URL
// import CommunityHeader from './CommunityHeader'; 
// const API_BASE_URL = "http://localhost:5050/api/stories"; 

// const ReachOutPage = () => {
//     // --- STATE MANAGEMENT ---
//     const [posts, setPosts] = useState([]); // Will hold fetched posts/stories
//     const [messageText, setMessageText] = useState(''); // For the persistent post input
//     const [postStatus, setPostStatus] = useState({ type: '', message: '' });

//     const [showFlagModal, setShowFlagModal] = useState(false);
//     const [selectedPostId, setSelectedPostId] = useState(null);
//     const [flagReason, setFlagReason] = useState('');
    
//     // --- NEW VOICE INPUT STATE ---
//     const [isListening, setIsListening] = useState(false);

//     const [replyingToPostId, setReplyingToPostId] = useState(null);
//     const [replyCommentContent, setReplyCommentContent] = useState('');

//     const currentUserId = '66f3e1b7f3d5b0a8c2f218a0'; // Mock User ID
    
//     // Utility functions for rendering populated user data (from ListenLearnPage)
//     const getAvatarSrc = (user) => (user?.avatarUrl || 'https://placehold.co/40x40/E8A287/FFFFFF?text=USER');
//     const getUsername = (user) => (user?.username || 'Community User');

//     // =======================================================
//     // 1. DATA FETCHING ON LOAD
//     // =======================================================
//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const response = await fetch(API_BASE_URL);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch posts from API.');
//                 }
//                 const data = await response.json();
//                 setPosts(data); 
//             } catch (error) {
//                 console.error("Error fetching posts:", error);
//                 setPostStatus({ type: 'error', message: 'Could not load community posts.' });
//             }
//         };

//         fetchPosts();
//     }, []); 

//     // =======================================================
//     // 2. VOICE INPUT HANDLER (Web Speech API)
//     // =======================================================
//     const startVoiceInput = () => {
//         if (!('webkitSpeechRecognition' in window)) {
//             setPostStatus({ type: 'error', message: 'Voice input not supported by your browser.' });
//             return;
//         }

//         const recognition = new window.webkitSpeechRecognition();
//         recognition.continuous = false; // Only listen until a pause is detected
//         recognition.lang = 'en-US';

//         recognition.onstart = () => {
//             setIsListening(true);
//             setPostStatus({ type: 'info', message: 'Listening... start speaking now.' });
//         };

//         recognition.onerror = (event) => {
//             setIsListening(false);
//             console.error('Speech recognition error:', event.error);
//             if (event.error !== 'no-speech') {
//                 setPostStatus({ type: 'error', message: `Voice error: ${event.error}. Ensure microphone is available.` });
//             } else {
//                 setPostStatus({ type: 'error', message: `No speech detected. Try again.` });
//             }
//         };

//         recognition.onend = () => {
//             setIsListening(false);
//             setPostStatus({ type: 'success', message: 'Voice input stopped.' });
//         };

//         recognition.onresult = (event) => {
//             const transcript = event.results[0][0].transcript;
//             // Append the transcript to the existing message text
//             setMessageText(prevText => (prevText + ' ' + transcript).trim());
//         };

//         recognition.start();
//     };

//     // =======================================================
//     // 3. HANDLERS (Unchanged core logic)
//     // =======================================================

//     const handleLike = (postId) => {
//         // NOTE: This logic still needs API integration
//         setPosts(
//             posts.map((post) =>
//                 post._id === postId // Use post._id
//                     ? {
//                           ...post,
//                           likes: post.isLiked ? post.likes - 1 : post.likes + 1,
//                           isLiked: !post.isLiked,
//                       }
//                     : post
//             )
//         );
//     };

//     const handleFlagClick = (postId) => {
//         setSelectedPostId(postId);
//         setShowFlagModal(true);
//         setFlagReason('');
//     };

//     const handleReasonChange = (e) => {
//         const value = e.target.value;
//         setFlagReason(value === 'other' ? 'other:' : value);
//     };

//     const handleFlagSubmit = async () => {
//         if (!flagReason.trim() || !selectedPostId) return;

//         setPostStatus({ type: 'info', message: 'Submitting flag for review...' });

//         try {
//             const response = await fetch(`${API_BASE_URL}/${selectedPostId}/flag`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ reason: flagReason }), 
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to flag post.');
//             }

//             if (data.status === 'deleted') {
//                 setPosts(prevPosts => prevPosts.filter(post => post._id !== selectedPostId));
//                 setPostStatus({ type: 'success', message: data.message || 'Post deleted after reaching flag limit.' });
//             } else {
//                 setPosts(prevPosts =>
//                     prevPosts.map(post =>
//                         post._id === selectedPostId
//                             ? { ...post, isFlagged: true } 
//                             : post
//                     )
//                 );
//                 setPostStatus({ type: 'success', message: data.message || 'Post flagged successfully.' });
//             }
//         } catch (error) {
//             console.error('Flag Submission Error:', error);
//             setPostStatus({ type: 'error', message: `Error flagging post: ${error.message}` });
//         } finally {
//             setShowFlagModal(false);
//             setSelectedPostId(null);
//             setFlagReason('');
//         }
//     };

//     const handleFlagCancel = () => {
//         setShowFlagModal(false);
//         setSelectedPostId(null);
//         setFlagReason('');
//     };
    
//     const handleCreateNewPost = async (e) => {
//         e.preventDefault();
//         if (!messageText.trim()) return;

//         setPostStatus({ type: 'info', message: 'Posting conversation starter...' });

//         try {
//             const response = await fetch(API_BASE_URL, { 
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ userId: currentUserId, content: messageText.trim() }),
//             });
            
//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to post message.');
//             }

//             setPosts(prevPosts => [data, ...prevPosts]);
//             setPostStatus({ type: 'success', message: 'Conversation starter posted successfully!' });
//             setMessageText(''); // Clear input

//         } catch (error) {
//             console.error('Post Creation Error:', error);
//             setPostStatus({ type: 'error', message: `Error posting message: ${error.message}` });
//         }
//     };
    
//     const handlePostReply = async (postId) => {
//         if (!replyCommentContent.trim()) return;

//         setPostStatus({ type: 'info', message: 'Posting reply...' });

//         try {
//             const response = await fetch(`${API_BASE_URL}/${postId}/comment`, { 
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     userId: currentUserId,
//                     content: replyCommentContent.trim(),
//                 }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to post reply.');
//             }

//             setPosts(prevPosts =>
//                 prevPosts.map(post =>
//                     post._id === data._id ? data : post 
//                 )
//             );
            
//             setPostStatus({ type: 'success', message: 'Reply posted successfully!' });
//             setReplyingToPostId(null); 
//             setReplyCommentContent('');
            
//         } catch (error) {
//             console.error('Reply Post Error:', error);
//             setPostStatus({ type: 'error', message: `Error posting reply: ${error.message}` });
//         }
//     };
    
//     const handleReplyToPost = (postId) => {
//         setReplyingToPostId(prevId => prevId === postId ? null : postId);
//         setReplyCommentContent(''); 
//     };


//     return (
//         <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
//             <div className="container mx-auto px-4 py-8 max-w-5xl">
//                 <CommunityHeader activeTab="ReachOutPage" />

//                 <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
//                     <div className="flex items-center justify-between mb-10 relative z-10">
//                         <div className="flex items-center gap-4">
//                             <div className="w-16 h-16 rounded-full flex items-center justify-center">
//                                 {/* Using placeholder image URL */}
//                                 <img src="https://placehold.co/80x80/FFF9C4/E8A287?text=🗣️" alt="Reach Out" className="w-20 h-20 object-contain" />
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold text-[#2B5A7A]">Reach Out & Be Heard</h2>
//                                 <p className="text-sm text-gray-500">A supportive environment for sharing experiences</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Status Message */}
//                     {postStatus.message && (
//                         <div className={`p-3 rounded-lg mb-4 text-sm ${postStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                             {postStatus.message}
//                         </div>
//                     )}
                    
//                     {/* Support Resources */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                         {[
//                             { title: "Share Experiences", desc: "Express your thoughts" },
//                             { title: "Community Support", desc: "Connect with others" },
//                             { title: "Professional Resources", desc: "Access guidance" }
//                         ].map((action, index) => (
//                             <div key={index} className="bg-[#EDF3F8] p-4 rounded-xl">
//                                 <h3 className="font-semibold text-[#2B5A7A] mb-1">{action.title}</h3>
//                                 <p className="text-sm text-slate-600">{action.desc}</p>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Post Feed */}
//                     <div className="space-y-6">
//                         {posts.map((post) => (
//                             <div
//                                 key={post._id} // Use post._id
//                                 className={`rounded-2xl p-5 bg-[#EDF3F8] relative ${
//                                     post.comments && post.comments.length > 0 ? 'border-l-4 border-[#B5D8EB] pl-6' : ''
//                                 }`}
//                             >
//                                 <div className="flex items-center gap-3 mb-3">
//                                     <img
//                                         src={getAvatarSrc(post.userId)}
//                                         alt={getUsername(post.userId)}
//                                         className="w-8 h-8 rounded-full object-cover"
//                                     />
//                                     <div>
//                                         <p className="font-bold text-sm text-[#2B5A7A]">{getUsername(post.userId)}</p>
//                                         <p className="text-xs text-slate-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'just now'}</p>
//                                     </div>
//                                 </div>

//                                 <p className="text-sm text-slate-700 mb-3">{post.content}</p>

//                                 <div className="flex items-center gap-4 mt-3">
//                                     <button
//                                         onClick={() => handleLike(post._id)}
//                                         className={`flex items-center gap-2 ${
//                                             post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
//                                         }`}
//                                     >
//                                         <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
//                                         <span className="text-sm font-medium">{post.likes}</span>
//                                     </button>

//                                     <button 
//                                         onClick={() => handleReplyToPost(post._id)} // Toggles the dedicated reply box
//                                         className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
//                                     >
//                                         <MessageCircle className="w-5 h-5" />
//                                         <span className="text-sm font-medium">Reply ({post.comments ? post.comments.length : 0})</span>
//                                     </button>

//                                     <button
//                                         onClick={() => handleFlagClick(post._id)}
//                                         className={`flex items-center gap-2 ${
//                                             post.isFlagged
//                                                 ? 'text-yellow-500'
//                                                 : 'text-slate-400 hover:text-yellow-500'
//                                         }`}
//                                         title={post.isFlagged ? 'Post has been flagged' : 'Flag this post'}
//                                     >
//                                         <Flag className="w-5 h-5" />
//                                     </button>
//                                 </div>
                                
//                                 {/* RENDER DEDICATED REPLY INPUT BOX */}
//                                 {replyingToPostId === post._id && (
//                                     <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
//                                         <textarea
//                                             value={replyCommentContent}
//                                             onChange={(e) => setReplyCommentContent(e.target.value)}
//                                             placeholder="Write your direct reply here..."
//                                             rows="2"
//                                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none"
//                                         />
//                                         <div className="flex justify-end gap-2 mt-2">
//                                             <button
//                                                 onClick={() => setReplyingToPostId(null)}
//                                                 className="px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 onClick={() => handlePostReply(post._id)} // Uses the new post reply handler
//                                                 disabled={!replyCommentContent.trim()}
//                                                 className={`px-3 py-1 text-xs font-medium text-white rounded-full transition ${
//                                                     replyCommentContent.trim()
//                                                         ? 'bg-blue-500 hover:bg-blue-600'
//                                                         : 'bg-gray-300 cursor-not-allowed'
//                                                 }`}
//                                             >
//                                                 Post Reply
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
                                
//                                 {/* Render Replies/Comments nested within the main post (unchanged) */}
//                                 {post.comments && post.comments.length > 0 && (
//                                     <div className="mt-4 border-t border-slate-300 pt-3 space-y-3">
//                                         {post.comments.map((comment) => (
//                                             <div key={comment._id || comment.createdAt} className="flex gap-3 text-xs">
//                                                 <img 
//                                                     src={getAvatarSrc(comment.userId)} 
//                                                     alt={getUsername(comment.userId)}
//                                                     className="w-6 h-6 rounded-full object-cover"
//                                                 />
//                                                 <div>
//                                                     <p className="font-bold text-[#2B5A7A] inline mr-2">{getUsername(comment.userId)}</p>
//                                                     <span className="text-slate-600">{comment.content}</span>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* Flag Modal (UNCHANGED) */}
//                     {showFlagModal && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
//                                 <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4">
//                                     Flag this post
//                                 </h3>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                                         Please select a reason for flagging:
//                                     </label>
//                                     <select
//                                         value={flagReason.startsWith('other:') ? 'other' : flagReason}
//                                         onChange={handleReasonChange}
//                                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                     >
//                                         <option value="">Select a reason</option>
//                                         <option value="inappropriate">Inappropriate Content</option>
//                                         <option value="harassment">Harassment</option>
//                                         <option value="spam">Spam</option>
//                                         <option value="hate_speech">Hate Speech</option>
//                                         <option value="misinformation">Misinformation</option>
//                                         <option value="other">Other</option>
//                                     </select>
//                                     {flagReason.startsWith('other:') && (
//                                         <textarea
//                                             placeholder="Please specify the reason..."
//                                             className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                             rows="3"
//                                             value={flagReason.replace('other:', '').trim()}
//                                             onChange={(e) => setFlagReason(`other: ${e.target.value}`)}
//                                         />
//                                     )}
//                                 </div>
//                                 <div className="flex justify-end gap-3">
//                                     <button
//                                         onClick={handleFlagCancel}
//                                         className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         onClick={handleFlagSubmit}
//                                         disabled={!flagReason}
//                                         className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
//                                             flagReason
//                                                 ? 'bg-red-500 hover:bg-red-600'
//                                                 : 'bg-gray-300 cursor-not-allowed'
//                                         }`}
//                                     >
//                                         Submit Flag
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Message Input (FOR CREATING A NEW MAIN POST) */}
//                     <div className="mt-10 pt-6 border-t border-slate-200">
//                         <label className="block text-sm font-medium text-[#2B5A7A] mb-2">
//                             Share what's on your mind
//                         </label>
//                         <form onSubmit={handleCreateNewPost}>
//                             <div className="flex items-center gap-3 bg-slate-50 rounded-full px-5 py-3 border border-slate-200">
//                                 <input
//                                     type="text"
//                                     placeholder="Type here..."
//                                     value={messageText}
//                                     onChange={(e) => setMessageText(e.target.value)}
//                                     className="flex-1 bg-transparent border-none outline-none text-sm"
//                                     required
//                                 />
//                                 <button 
//                                     type="button" 
//                                     onClick={startVoiceInput}
//                                     className={`text-slate-500 hover:text-slate-700 transition ${isListening ? 'text-red-500 animate-pulse' : ''}`}
//                                 >
//                                     <Mic className="w-5 h-5" />
//                                 </button>
//                                 <button type="submit" className="text-blue-500 hover:text-blue-600">
//                                     <Send className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>

//                 <footer className="text-center mt-10 text-gray-600 text-sm">
//                         <p>Don't worry Be happy</p>
//                     </footer>
//             </div>
//         </div>
//     );
// };

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send, Mic, Flag, X } from 'lucide-react';

// Assuming shared components and API base URL
import CommunityHeader from './CommunityHeader'; 
const API_BASE_URL = "http://localhost:5050/api/stories"; 

const ReachOutPage = () => {
    // --- STATE MANAGEMENT ---
    const [posts, setPosts] = useState([]); // Will hold fetched posts/stories
    const [messageText, setMessageText] = useState(''); // For the persistent post input
    const [postStatus, setPostStatus] = useState({ type: '', message: '' });

    const [showFlagModal, setShowFlagModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [flagReason, setFlagReason] = useState('');
    
    // --- VOICE INPUT STATE ---
    const [isListening, setIsListening] = useState(false);

    const [replyingToPostId, setReplyingToPostId] = useState(null);
    const [replyCommentContent, setReplyCommentContent] = useState('');

    const currentUserId = '66f3e1b7f3d5b0a8c2f218a0'; // Mock User ID
    
    // Utility functions for rendering populated user data (from ListenLearnPage)
    const getAvatarSrc = (user) => (user?.avatarUrl || 'https://placehold.co/40x40/E8A287/FFFFFF?text=USER');
    const getUsername = (user) => (user?.username || 'Community User');

    // =======================================================
    // 1. DATA FETCHING ON LOAD
    // =======================================================
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(API_BASE_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts from API.');
                }
                const data = await response.json();
                // Initialize the isLiked property for the frontend based on user session/history later, 
                // but for now, just load the posts.
                setPosts(data); 
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPostStatus({ type: 'error', message: 'Could not load community posts.' });
            }
        };

        fetchPosts();
    }, []); 

    // =======================================================
    // 2. VOICE INPUT HANDLER (Web Speech API)
    // =======================================================
    const startVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            setPostStatus({ type: 'error', message: 'Voice input not supported by your browser.' });
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false; // Only listen until a pause is detected
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setPostStatus({ type: 'info', message: 'Listening... start speaking now.' });
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            console.error('Speech recognition error:', event.error);
            if (event.error !== 'no-speech') {
                setPostStatus({ type: 'error', message: `Voice error: ${event.error}. Ensure microphone is available.` });
            } else {
                setPostStatus({ type: 'error', message: `No speech detected. Try again.` });
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            setPostStatus({ type: 'success', message: 'Voice input stopped.' });
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            // Append the transcript to the existing message text
            setMessageText(prevText => (prevText + ' ' + transcript).trim());
        };

        recognition.start();
    };

    // =======================================================
    // 3. HANDLERS
    // =======================================================

    // --- UPDATED: handleLike with API CALL ---
    const handleLike = async (postId) => {
        setPostStatus({ type: 'info', message: 'Updating like status...' });
        
        // 1. Optimistically update local state (for fast UX)
        let isCurrentlyLiked = false;
        let newLikesCount = 0;

        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id === postId) {
                    // Toggle the visual state
                    isCurrentlyLiked = !post.isLiked;
                    newLikesCount = post.likes + (isCurrentlyLiked ? 1 : -1);
                    return {
                        ...post,
                        likes: newLikesCount,
                        isLiked: isCurrentlyLiked,
                    };
                }
                return post;
            })
        );
        
        // 2. Call API to persist the change
        try {
            // Note: The API call logic (POST /:id/like) currently only increments.
            // For a full system, you'd need a PUT or DELETE to handle unliking, 
            // but we'll stick to the current POST /:id/like structure for now, 
            // assuming the backend handles the toggle logic if needed, or simply increments.
            
            const response = await fetch(`${API_BASE_URL}/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // You might need to send userId if your backend uses it for tracking likes:
                // body: JSON.stringify({ userId: currentUserId }),
            });

            const data = await response.json();

            if (!response.ok) {
                 // If API fails, revert the state change (ROLLBACK)
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === postId
                            ? { ...post, likes: post.likes + (isCurrentlyLiked ? -1 : 1), isLiked: !isCurrentlyLiked }
                            : post
                    )
                );
                throw new Error(data.message || 'Failed to update like on server.');
            }
            
            setPostStatus({ type: 'success', message: 'Like status updated.' });

        } catch (error) {
            console.error('Like API Error:', error);
            setPostStatus({ type: 'error', message: `Error: ${error.message}. Please try again.` });
        }
    };
    // --- END UPDATED handleLike ---

    const handleFlagClick = (postId) => {
        setSelectedPostId(postId);
        setShowFlagModal(true);
        setFlagReason('');
    };

    const handleReasonChange = (e) => {
        const value = e.target.value;
        setFlagReason(value === 'other' ? 'other:' : value);
    };

    const handleFlagSubmit = async () => {
        if (!flagReason.trim() || !selectedPostId) return;

        setPostStatus({ type: 'info', message: 'Submitting flag for review...' });

        try {
            const response = await fetch(`${API_BASE_URL}/${selectedPostId}/flag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: flagReason }), 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to flag post.');
            }

            if (data.status === 'deleted') {
                setPosts(prevPosts => prevPosts.filter(post => post._id !== selectedPostId));
                setPostStatus({ type: 'success', message: data.message || 'Post deleted after reaching flag limit.' });
            } else {
                setPosts(prevPosts =>
                    prevPosts.map(post =>
                        post._id === selectedPostId
                            ? { ...post, isFlagged: true } 
                            : post
                    )
                );
                setPostStatus({ type: 'success', message: data.message || 'Post flagged successfully.' });
            }
        } catch (error) {
            console.error('Flag Submission Error:', error);
            setPostStatus({ type: 'error', message: `Error flagging post: ${error.message}` });
        } finally {
            setShowFlagModal(false);
            setSelectedPostId(null);
            setFlagReason('');
        }
    };

    const handleFlagCancel = () => {
        setShowFlagModal(false);
        setSelectedPostId(null);
        setFlagReason('');
    };
    
    const handleCreateNewPost = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        setPostStatus({ type: 'info', message: 'Posting conversation starter...' });

        try {
            const response = await fetch(API_BASE_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUserId, content: messageText.trim() }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to post message.');
            }

            setPosts(prevPosts => [data, ...prevPosts]);
            setPostStatus({ type: 'success', message: 'Conversation starter posted successfully!' });
            setMessageText(''); // Clear input

        } catch (error) {
            console.error('Post Creation Error:', error);
            setPostStatus({ type: 'error', message: `Error posting message: ${error.message}` });
        }
    };
    
    const handlePostReply = async (postId) => {
        if (!replyCommentContent.trim()) return;

        setPostStatus({ type: 'info', message: 'Posting reply...' });

        try {
            const response = await fetch(`${API_BASE_URL}/${postId}/comment`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    content: replyCommentContent.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to post reply.');
            }

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === data._id ? data : post 
                )
            );
            
            setPostStatus({ type: 'success', message: 'Reply posted successfully!' });
            setReplyingToPostId(null); 
            setReplyCommentContent('');
            
        } catch (error) {
            console.error('Reply Post Error:', error);
            setPostStatus({ type: 'error', message: `Error posting reply: ${error.message}` });
        }
    };
    
    const handleReplyToPost = (postId) => {
        setReplyingToPostId(prevId => prevId === postId ? null : postId);
        setReplyCommentContent(''); 
    };


    return (
        <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <CommunityHeader activeTab="ReachOutPage" />

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center">
                                {/* Using placeholder image URL */}
                                <img src="https://placehold.co/80x80/FFF9C4/E8A287?text=🗣️" alt="Reach Out" className="w-20 h-20 object-contain" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#2B5A7A]">Reach Out & Be Heard</h2>
                                <p className="text-sm text-gray-500">A supportive environment for sharing experiences</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Message */}
                    {postStatus.message && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${postStatus.type === 'error' ? 'bg-red-100 text-red-700' : postStatus.type === 'info' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                            {postStatus.message}
                        </div>
                    )}
                    
                    {/* Support Resources */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { title: "Share Experiences", desc: "Express your thoughts" },
                            { title: "Community Support", desc: "Connect with others" },
                            { title: "Professional Resources", desc: "Access guidance" }
                        ].map((action, index) => (
                            <div key={index} className="bg-[#EDF3F8] p-4 rounded-xl">
                                <h3 className="font-semibold text-[#2B5A7A] mb-1">{action.title}</h3>
                                <p className="text-sm text-slate-600">{action.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Post Feed */}
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div
                                key={post._id} // Use post._id
                                className={`rounded-2xl p-5 bg-[#EDF3F8] relative ${
                                    post.comments && post.comments.length > 0 ? 'border-l-4 border-[#B5D8EB] pl-6' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={getAvatarSrc(post.userId)}
                                        alt={getUsername(post.userId)}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-bold text-sm text-[#2B5A7A]">{getUsername(post.userId)}</p>
                                        <p className="text-xs text-slate-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'just now'}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-700 mb-3">{post.content}</p>

                                <div className="flex items-center gap-4 mt-3">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-2 ${
                                            post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'
                                        }`}
                                    >
                                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                        <span className="text-sm font-medium">{post.likes}</span>
                                    </button>

                                    <button 
                                        onClick={() => handleReplyToPost(post._id)} // Toggles the dedicated reply box
                                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">Reply ({post.comments ? post.comments.length : 0})</span>
                                    </button>

                                    <button
                                        onClick={() => handleFlagClick(post._id)}
                                        className={`flex items-center gap-2 ${
                                            post.isFlagged
                                                ? 'text-yellow-500'
                                                : 'text-slate-400 hover:text-yellow-500'
                                        }`}
                                        title={post.isFlagged ? 'Post has been flagged' : 'Flag this post'}
                                    >
                                        <Flag className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                {/* RENDER DEDICATED REPLY INPUT BOX */}
                                {replyingToPostId === post._id && (
                                    <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
                                        <textarea
                                            value={replyCommentContent}
                                            onChange={(e) => setReplyCommentContent(e.target.value)}
                                            placeholder="Write your direct reply here..."
                                            rows="2"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none"
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setReplyingToPostId(null)}
                                                className="px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handlePostReply(post._id)} // Uses the new post reply handler
                                                disabled={!replyCommentContent.trim()}
                                                className={`px-3 py-1 text-xs font-medium text-white rounded-full transition ${
                                                    replyCommentContent.trim()
                                                        ? 'bg-blue-500 hover:bg-blue-600'
                                                        : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                            >
                                                Post Reply
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Render Replies/Comments nested within the main post (unchanged) */}
                                {post.comments && post.comments.length > 0 && (
                                    <div className="mt-4 border-t border-slate-300 pt-3 space-y-3">
                                        {post.comments.map((comment) => (
                                            <div key={comment._id || comment.createdAt} className="flex gap-3 text-xs">
                                                <img 
                                                    src={getAvatarSrc(comment.userId)} 
                                                    alt={getUsername(comment.userId)}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-bold text-[#2B5A7A] inline mr-2">{getUsername(comment.userId)}</p>
                                                    <span className="text-slate-600">{comment.content}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Flag Modal (UNCHANGED) */}
                    {showFlagModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                             <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4">
                                    Flag this post
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
                                        disabled={!flagReason || flagReason === 'other:'}
                                        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                            flagReason && flagReason !== 'other:' && (flagReason.startsWith('other:') ? flagReason.replace('other:', '').trim() : true)
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

                    {/* Message Input (FOR CREATING A NEW MAIN POST) */}
                    <div className="mt-10 pt-6 border-t border-slate-200">
                        <label className="block text-sm font-medium text-[#2B5A7A] mb-2">
                            Share what's on your mind
                        </label>
                        <form onSubmit={handleCreateNewPost}>
                            <div className="flex items-center gap-3 bg-slate-50 rounded-full px-5 py-3 border border-slate-200">
                                <input
                                    type="text"
                                    placeholder="Type here..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={startVoiceInput}
                                    className={`text-slate-500 hover:text-slate-700 transition ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                                <button type="submit" className="text-blue-500 hover:text-blue-600">
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <footer className="text-center mt-10 text-gray-600 text-sm">
                    <p>Don't worry Be happy</p>
                </footer>
            </div>
        </div>
    );
};

export default ReachOutPage;