// import React, { useState } from 'react';
// import { Heart, MessageCircle, Flag } from 'lucide-react';
// import CommunityHeader from './CommunityHeader';

// const ListenLearnPage = () => {
//   const [showFlagModal, setShowFlagModal] = useState(false);
//   const [selectedStoryId, setSelectedStoryId] = useState(null);
//   const [flagReason, setFlagReason] = useState('');

//   const [stories, setStories] = useState([
//     {
//       id: 1,
//       user: 'USER 1',
//       avatar: 'https://via.placeholder.com/40',
//       timestamp: '2 days ago',
//       text: "A few years ago, I was overwhelmed by depression and anxiety. It felt impossible to get through each day. But with therapy, support from friends, and self-care, I've gradually found my way back. It's still a journey, but I'm stronger now.",
//       likes: 24,
//       comments: 5,
//       isLiked: false,
//       isFlagged: false,
//     },
//     {
//       id: 2,
//       user: 'USER 2',
//       avatar: 'https://via.placeholder.com/40',
//       timestamp: '5 days ago',
//       text: "For a long time, I ignored my feelings and pushed through the stress. Eventually, it caught up with me — I experienced burnout and panic attacks. Seeking help was hard, but therapy and mindfulness practices changed my life. Now, I prioritize my mental health and feel more balanced every day.",
//       likes: 18,
//       comments: 3,
//       isLiked: false,
//     },
//   ]);

//   const [expandedStories, setExpandedStories] = useState({});

//   const handleLike = (storyId) => {
//     setStories(
//       stories.map((story) =>
//         story.id === storyId
//           ? {
//               ...story,
//               likes: story.isLiked ? story.likes - 1 : story.likes + 1,
//               isLiked: !story.isLiked,
//             }
//           : story
//       )
//     );
//   };

//   const handleFlagClick = (storyId) => {
//     setSelectedStoryId(storyId);
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
    
//     setStories(
//       stories.map((story) =>
//         story.id === selectedStoryId
//           ? {
//               ...story,
//               isFlagged: true,
//               flagReason: flagReason.trim()
//             }
//           : story
//       )
//     );
//     setShowFlagModal(false);
//     setSelectedStoryId(null);
//     setFlagReason('');
//   };

//   const handleFlagCancel = () => {
//     setShowFlagModal(false);
//     setSelectedStoryId(null);
//     setFlagReason('');
//   };

//   const toggleExpand = (storyId) => {
//     setExpandedStories((prev) => ({
//       ...prev,
//       [storyId]: !prev[storyId],
//     }));
//   };

//   return (
//     <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
//       <div className="container mx-auto px-4 py-8 max-w-5xl">
//         {/* Header */}
//         <CommunityHeader activeTab="ListenLearnPage" />

//         {/* Content Area */}
//         <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 min-h-96 relative overflow-hidden">
//           <div className="flex items-center justify-between mb-10 relative z-10">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-full flex items-center justify-center">
//                 <img src="/listen-learn.png" alt="Listen & Learn" className="w-15 h-15 object-contain" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-[#2B5A7A]">Listen & Learn</h2>
//                 <p className="text-sm text-gray-500">Share and discover stories of resilience</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 mb-6 relative z-10">
//             <h3 className="text-lg font-semibold text-[#2B5A7A]">Shared Stories</h3>
//             <div className="flex -space-x-3">
//               <img src="/images/avatar-1.png" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
//               <img src="/images/avatar-2.png" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
//               <img src="/images/avatar-3.png" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
//               <div className="w-8 h-8 rounded-full bg-[#E3F2FA] border-2 border-white flex items-center justify-center text-xs font-medium text-[#2B5A7A]">
//                 +5
//               </div>
//             </div>
//           </div>

//           <div className="space-y-6">
//             {stories.map((story) => (
//               <div
//                 key={story.id}
//                 className="bg-gradient-to-b from-[#EDF3F8] to-white rounded-2xl p-6 hover:shadow-lg transition-all transform hover:scale-[1.01] border border-[#E3F2FA]/50"
//               >
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="relative">
//                     <img
//                       src={`/images/avatar-${story.id}.png`}
//                       alt={story.user}
//                       className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
//                     />
//                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#2B5A7A]">{story.user}</p>
//                     <p className="text-xs text-slate-500 flex items-center gap-1">
//                       <span className="w-2 h-2 rounded-full bg-[#2B5A7A]/30"></span>
//                       {story.timestamp}
//                     </p>
//                   </div>
//                 </div>

//                 <p className="text-sm text-slate-700 mb-4">
//                   {expandedStories[story.id]
//                     ? story.text
//                     : story.text.length > 150
//                     ? story.text.slice(0, 150) + '...'
//                     : story.text}
//                 </p>

//                 {story.text.length > 150 && (
//                   <button
//                     onClick={() => toggleExpand(story.id)}
//                     className="text-xs text-blue-500 hover:underline"
//                   >
//                     {expandedStories[story.id] ? 'Show less' : 'Read more'}
//                   </button>
//                 )}

//                 <div className="flex items-center gap-6 mt-4">
//                   <button
//                     onClick={() => handleLike(story.id)}
//                     className={`flex items-center gap-2 ${
//                       story.isLiked
//                         ? 'text-red-500'
//                         : 'text-slate-400 hover:text-red-400'
//                     }`}
//                   >
//                     <Heart
//                       className={`w-5 h-5 ${story.isLiked ? 'fill-current' : ''}`}
//                     />
//                     <span className="text-sm font-medium">{story.likes}</span>
//                   </button>

//                   <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500">
//                     <MessageCircle className="w-5 h-5" />
//                     <span className="text-sm font-medium">{story.comments}</span>
//                   </button>

//                   <button
//                     onClick={() => handleFlagClick(story.id)}
//                     className={`flex items-center gap-2 ${
//                       story.isFlagged
//                         ? 'text-yellow-500'
//                         : 'text-slate-400 hover:text-yellow-500'
//                     }`}
//                     title={story.isFlagged ? 'Story has been flagged' : 'Flag this story'}
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
//                   Flag this story
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

//           {/* Post Your Story Button */}
//           <div className="mt-10 pt-6 border-t border-slate-200">
//             <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4 text-center">
//               Your Voice Matters
//             </h3>
//             <button className="w-full bg-[#E8A287] text-white py-3 rounded-full font-medium hover:bg-[#D89277] transition flex items-center justify-center gap-2">
//               POST YOURS
//               <span className="text-xl">+</span>
//             </button>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="text-center mt-10 text-gray-600 text-sm">
//                 <p>Don't worry Be happy</p>
//             </footer>
//       </div>
//     </div>
//   );
// };

// export default ListenLearnPage;


// import React, { useState, useEffect } from 'react';
// import { Heart, MessageCircle, Flag, X } from 'lucide-react';
// import CommunityHeader from './CommunityHeader';

// // Assuming your API is running on localhost:5050
// const API_BASE_URL = "http://localhost:5050/api/stories"; 

// // --- Story Submission Form Component ---
// const StoryForm = ({ onPost, onCancel }) => {
//     const [content, setContent] = useState('');
//     const MAX_LENGTH = 1000;

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (content.trim()) {
//             onPost(content.trim());
//             setContent('');
//         }
//     };

//     return (
//         <div className="p-6 bg-[#EDF3F8] rounded-xl shadow-inner border border-[#E3F2FA]/50 mb-8">
//             <h3 className="text-xl font-bold text-[#2B5A7A] mb-4">Share Your Story</h3>
//             <form onSubmit={handleSubmit}>
//                 <textarea
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     placeholder="What story of resilience or insight would you like to share today? Be gentle and kind."
//                     rows="6"
//                     maxLength={MAX_LENGTH}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AA7E8] outline-none resize-none text-sm text-slate-700"
//                     required
//                 />
//                 <div className="flex justify-between items-center mt-3">
//                     <p className="text-xs text-slate-500">
//                         {content.length} / {MAX_LENGTH} characters
//                     </p>
//                     <div className="flex gap-3">
//                         <button
//                             type="button"
//                             onClick={onCancel}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={content.trim().length === 0}
//                             className={`px-6 py-2 text-sm font-medium text-white rounded-full transition ${
//                                 content.trim().length > 0
//                                     ? 'bg-[#E8A287] hover:bg-[#D89277]'
//                                     : 'bg-gray-300 cursor-not-allowed'
//                             }`}
//                         >
//                             Post Story
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };
// // --- END Story Submission Form ---


// const ListenLearnPage = () => {
//     const [stories, setStories] = useState([]); 
//     const [expandedStories, setExpandedStories] = useState({});

//     // State for Community actions
//     const [replyingToStoryId, setReplyingToStoryId] = useState(null);
//     const [commentContent, setCommentContent] = useState('');
//     const [postStatus, setPostStatus] = useState({ type: '', message: '' });
//     const [showFlagModal, setShowFlagModal] = useState(false);
//     const [selectedStoryId, setSelectedStoryId] = useState(null);
//     const [flagReason, setFlagReason] = useState('');
//     const [showPostForm, setShowPostForm] = useState(false); 

//     const currentUserId = '66f3e1b7f3d5b0a8c2f218a0'; 
    
//     // Data Fetching
//     useEffect(() => {
//         const fetchStories = async () => {
//             try {
//                 const response = await fetch(API_BASE_URL);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch stories from API.');
//                 }
//                 const data = await response.json();
//                 setStories(data); 
//             } catch (error) {
//                 console.error("Error fetching stories:", error);
//                 setPostStatus({ type: 'error', message: 'Could not load community stories.' });
//             }
//         };

//         fetchStories();
//     }, []); 

//     // HANDLERS
    
//     const handlePostComment = async (storyId) => {
//         if (!commentContent.trim()) return;

//         setPostStatus({ type: 'info', message: 'Posting comment...' });

//         try {
//             const response = await fetch(`${API_BASE_URL}/${storyId}/comment`, { 
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     userId: currentUserId,
//                     content: commentContent.trim(),
//                 }),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to post comment.');
//             }

//             // SUCCESS: API returns the fully populated story. Update the stories array with it.
//             setStories(prevStories =>
//                 prevStories.map(story =>
//                     story._id === data._id ? data : story 
//                 )
//             );
            
//             setPostStatus({ type: 'success', message: 'Comment posted successfully!' });
//             setReplyingToStoryId(null); // Hide the reply box
//             setCommentContent('');
            
//         } catch (error) {
//             console.error('Comment Post Error:', error);
//             setPostStatus({ type: 'error', message: `Error posting comment: ${error.message}` });
//         }
//     };
    
//     const handlePostStory = async (content) => {
//         setPostStatus({ type: 'info', message: 'Submitting story...' });

//         try {
//             const response = await fetch(API_BASE_URL, { 
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ userId: currentUserId, content }),
//             });
            
//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to post story.');
//             }

//             setStories(prevStories => [data, ...prevStories]);
//             setPostStatus({ type: 'success', message: 'Story posted successfully!' });
//             setShowPostForm(false);

//         } catch (error) {
//             console.error('Story Post Error:', error);
//             setPostStatus({ type: 'error', message: `Error posting story: ${error.message}` });
//         }
//     };

//     const handleLike = (storyId) => {
//         // NOTE: This logic still needs API integration
//         setStories(
//             stories.map((story) =>
//                 story._id === storyId 
//                     ? {
//                           ...story,
//                           likes: story.isLiked ? story.likes - 1 : story.likes + 1,
//                           isLiked: !story.isLiked,
//                       }
//                     : story
//             )
//         );
//     };

//     const handleReplyClick = (storyId) => {
//         // Toggle the reply box if the user clicks the same story again
//         setReplyingToStoryId(prevId => prevId === storyId ? null : storyId);
//         setCommentContent(''); 
//     };

//     const toggleExpand = (storyId) => {
//         setExpandedStories((prev) => ({
//             ...prev,
//             [storyId]: !prev[storyId],
//         }));
//     };
    
//     // Utility functions for rendering populated user data
//     const getAvatarSrc = (user) => (user?.avatarUrl || 'https://placehold.co/40x40/5AA7E8/FFFFFF?text=USER');
//     const getUsername = (user) => (user?.username || 'Community User');

//     // Flag handlers (unchanged)
//     const handleFlagClick = (storyId) => { setSelectedStoryId(storyId); setShowFlagModal(true); setFlagReason(''); };
//     const handleReasonChange = (e) => { const value = e.target.value; setFlagReason(value === 'other' ? 'other:' : value); };
//     const handleFlagSubmit = () => { if (!flagReason.trim()) return; setStories(stories.map((story) => story._id === selectedStoryId ? { ...story, isFlagged: true, flagReason: flagReason.trim() } : story)); setShowFlagModal(false); setSelectedStoryId(null); setFlagReason(''); };
//     const handleFlagCancel = () => { setShowFlagModal(false); setSelectedStoryId(null); setFlagReason(''); };


//     return (
//         <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
//             <div className="container mx-auto px-4 py-8 max-w-5xl">
//                 {/* Header */}
//                 <CommunityHeader activeTab="ListenLearnPage" />

//                 {/* Content Area */}
//                 <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 min-h-96 relative overflow-hidden">
//                     {/* ... (Header and Shared Stories Avatars section) ... */}
//                     <div className="flex items-center justify-between mb-10 relative z-10">
//                         <div className="flex items-center gap-4">
//                             <div className="w-16 h-16 rounded-full flex items-center justify-center">
//                                 {/* Using placeholder image URL */}
//                                 <img src="https://placehold.co/64x64/B5D8EB/000459?text=L&L" alt="Listen & Learn" className="w-15 h-15 object-contain" /> 
//                             </div>
//                             <div>
//                                 <h2 className="text-2xl font-bold text-[#2B5A7A]">Listen & Learn</h2>
//                                 <p className="text-sm text-gray-500">Share and discover stories of resilience</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3 mb-6 relative z-10">
//                         <h3 className="text-lg font-semibold text-[#2B5A7A]">Shared Stories</h3>
//                         <div className="flex -space-x-3">
//                             {/* NOTE: You should map over a real contributors array from API here */}
//                             <img src="https://placehold.co/32x32/5AA7E8/FFFFFF?text=A" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
//                             <img src="https://placehold.co/32x32/5AA7E8/FFFFFF?text=B" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
//                             <img src="https://placehold.co/32x32/5AA7E8/FFFFFF?text=C" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
//                             <div className="w-8 h-8 rounded-full bg-[#E3F2FA] border-2 border-white flex items-center justify-center text-xs font-medium text-[#2B5A7A]">
//                                 +5
//                             </div>
//                         </div>
//                     </div>

//                     {/* Story Form */}
//                     {showPostForm && (
//                         <StoryForm 
//                             onPost={handlePostStory}
//                             onCancel={() => setShowPostForm(false)}
//                         />
//                     )}

//                     {/* Status Message for Posts/Comments */}
//                     {postStatus.message && (
//                         <div className={`p-3 rounded-lg mb-4 text-sm ${postStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                             {postStatus.message}
//                         </div>
//                     )}
                    
//                     {/* Story Feed */}
//                     <div className="space-y-6">
//                         {stories.map((story) => (
//                             <div
//                                 key={story._id} 
//                                 className="bg-gradient-to-b from-[#EDF3F8] to-white rounded-2xl p-6 hover:shadow-lg transition-all transform hover:scale-[1.01] border border-[#E3F2FA]/50"
//                             >
//                                 {/* Story Header */}
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="relative">
//                                         <img
//                                             src={getAvatarSrc(story.userId)} // Use populated data
//                                             alt={getUsername(story.userId)}
//                                             className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
//                                         />
//                                         <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
//                                     </div>
//                                     <div>
//                                         <p className="font-bold text-sm text-[#2B5A7A]">{getUsername(story.userId)}</p>
//                                         <p className="text-xs text-slate-500 flex items-center gap-1">
//                                             <span className="w-2 h-2 rounded-full bg-[#2B5A7A]/30"></span>
//                                             {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'just now'}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* Story Content */}
//                                 <p className="text-sm text-slate-700 mb-4">
//                                     {expandedStories[story._id]
//                                         ? story.content 
//                                         : story.content.length > 150 
//                                         ? story.content.slice(0, 150) + '...'
//                                         : story.content}
//                                 </p>

//                                 {story.content.length > 150 && (
//                                     <button
//                                         onClick={() => toggleExpand(story._id)} 
//                                         className="text-xs text-blue-500 hover:underline"
//                                     >
//                                         {expandedStories[story._id] ? 'Show less' : 'Read more'}
//                                     </button>
//                                 )}

//                                 {/* Action Buttons */}
//                                 <div className="flex items-center gap-6 mt-4">
//                                     <button
//                                         onClick={() => handleLike(story._id)} 
//                                         className={`flex items-center gap-2 ${story.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
//                                     >
//                                         <Heart className={`w-5 h-5 ${story.isLiked ? 'fill-current' : ''}`}/>
//                                         <span className="text-sm font-medium">{story.likes}</span>
//                                     </button>

//                                     <button 
//                                         onClick={() => handleReplyClick(story._id)} 
//                                         className={`flex items-center gap-2 ${replyingToStoryId === story._id ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'}`}
//                                     >
//                                         <MessageCircle className="w-5 h-5" />
//                                         <span className="text-sm font-medium">{story.comments ? story.comments.length : 0}</span>
//                                     </button>

//                                     <button
//                                         onClick={() => handleFlagClick(story._id)} 
//                                         className={`flex items-center gap-2 ${story.isFlagged ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
//                                         title={story.isFlagged ? 'Story has been flagged' : 'Flag this story'}
//                                     >
//                                         <Flag className="w-5 h-5" />
//                                     </button>
//                                 </div>
                                
//                                 {/* --- FIX 2: CONDITIONAL COMMENT DISPLAY --- */}
//                                 {(story.comments && story.comments.length > 0) && (
//                                     <div className="mt-4 border-t border-slate-200 pt-3 space-y-3">
//                                         <h4 className="text-sm font-semibold text-[#2B5A7A]">
//                                             Replies ({story.comments.length})
//                                         </h4>
//                                         {/* Display comments, showing newest first (optional) */}
//                                         {story.comments.slice().reverse().map((comment) => (
//                                             <div key={comment._id || comment.createdAt} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
//                                                 <img 
//                                                     src={getAvatarSrc(comment.userId)} 
//                                                     alt={getUsername(comment.userId)}
//                                                     className="w-8 h-8 rounded-full object-cover"
//                                                 />
//                                                 <div className="text-xs">
//                                                     <p className="font-bold text-[#2B5A7A]">{getUsername(comment.userId)}</p>
//                                                     <p className="text-slate-600">{comment.content}</p>
//                                                     <p className="text-slate-400 mt-1">
//                                                         {new Date(comment.createdAt).toLocaleTimeString()} - {new Date(comment.createdAt).toLocaleDateString()}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 {/* CONDITIONAL COMMENT INPUT BOX */}
//                                 {replyingToStoryId === story._id && ( 
//                                     <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
//                                         <textarea
//                                             value={commentContent}
//                                             onChange={(e) => setCommentContent(e.target.value)}
//                                             placeholder="Write your gentle reply here..."
//                                             rows="2"
//                                             className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none"
//                                         />
//                                         <div className="flex justify-end gap-2 mt-2">
//                                             <button
//                                                 onClick={() => setReplyingToStoryId(null)}
//                                                 className="px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 onClick={() => handlePostComment(story._id)} 
//                                                 disabled={!commentContent.trim()}
//                                                 className={`px-3 py-1 text-xs font-medium text-white rounded-full transition ${
//                                                     commentContent.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
//                                                 }`}
//                                             >
//                                                 Reply
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     {/* ... (Flag Modal remains the same) ... */}

//                     {/* Post Your Story Button */}
//                     {!showPostForm && (
//                         <div className="mt-10 pt-6 border-t border-slate-200">
//                             <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4 text-center">Your Voice Matters</h3>
//                             <button 
//                                 onClick={() => setShowPostForm(true)}
//                                 className="w-full bg-[#E8A287] text-white py-3 rounded-full font-medium hover:bg-[#D89277] transition flex items-center justify-center gap-2"
//                             >
//                                 POST YOURS
//                                 <span className="text-xl">+</span>
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <footer className="text-center mt-10 text-gray-600 text-sm">
//                     <p>Don't worry Be happy</p>
//                 </footer>
//             </div>
//         </div>
//     );
// };

// export default ListenLearnPage;

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Flag, X } from 'lucide-react';
import CommunityHeader from './CommunityHeader';

// Assuming your API is running on localhost:5050
const API_BASE_URL = "http://localhost:5050/api/stories"; 

// --- Story Submission Form Component (UNCHANGED) ---
const StoryForm = ({ onPost, onCancel }) => {
    const [content, setContent] = useState('');
    const MAX_LENGTH = 1000;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onPost(content.trim());
            setContent('');
        }
    };

    return (
        <div className="p-6 bg-[#EDF3F8] rounded-xl shadow-inner border border-[#E3F2FA]/50 mb-8">
            <h3 className="text-xl font-bold text-[#2B5A7A] mb-4">Share Your Story</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What story of resilience or insight would you like to share today? Be gentle and kind."
                    rows="6"
                    maxLength={MAX_LENGTH}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AA7E8] outline-none resize-none text-sm text-slate-700"
                    required
                />
                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-slate-500">
                        {content.length} / {MAX_LENGTH} characters
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={content.trim().length === 0}
                            className={`px-6 py-2 text-sm font-medium text-white rounded-full transition ${
                                content.trim().length > 0
                                    ? 'bg-[#E8A287] hover:bg-[#D89277]'
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            Post Story
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
// --- END Story Submission Form ---


const ListenLearnPage = () => {
    const [stories, setStories] = useState([]); 
    const [expandedStories, setExpandedStories] = useState({});

    // State for Community actions
    const [replyingToStoryId, setReplyingToStoryId] = useState(null);
    const [commentContent, setCommentContent] = useState('');
    const [postStatus, setPostStatus] = useState({ type: '', message: '' });
    const [showFlagModal, setShowFlagModal] = useState(false);
    const [selectedStoryId, setSelectedStoryId] = useState(null);
    const [flagReason, setFlagReason] = useState('');
    const [showPostForm, setShowPostForm] = useState(false); 

    const currentUserId = '66f3e1b7f3d5b0a8c2f218a0'; 
    
    // Data Fetching
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch(API_BASE_URL);
                if (!response.ok) {
                    throw new Error('Failed to fetch stories from API.');
                }
                const data = await response.json();
                setStories(data); 
            } catch (error) {
                console.error("Error fetching stories:", error);
                setPostStatus({ type: 'error', message: 'Could not load community stories.' });
            }
        };

        fetchStories();
    }, []); 

    // HANDLERS
    
    const handlePostComment = async (storyId) => {
        if (!commentContent.trim()) return;

        setPostStatus({ type: 'info', message: 'Posting comment...' });

        try {
            const response = await fetch(`${API_BASE_URL}/${storyId}/comment`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUserId,
                    content: commentContent.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to post comment.');
            }

            setStories(prevStories =>
                prevStories.map(story =>
                    story._id === data._id ? data : story 
                )
            );
            
            setPostStatus({ type: 'success', message: 'Comment posted successfully!' });
            setReplyingToStoryId(null); 
            setCommentContent('');
            
        } catch (error) {
            console.error('Comment Post Error:', error);
            setPostStatus({ type: 'error', message: `Error posting comment: ${error.message}` });
        }
    };
    
    // --- UPDATED: handleFlagSubmit to handle deletion based on API response ---
    const handleFlagSubmit = async () => {
        if (!flagReason.trim() || !selectedStoryId) return;

        setPostStatus({ type: 'info', message: 'Submitting flag for review...' });

        try {
            // API CALL: POST /api/stories/:id/flag
            const response = await fetch(`${API_BASE_URL}/${selectedStoryId}/flag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: flagReason }), 
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to flag story.');
            }

            // --- CRITICAL FRONTEND DELETION LOGIC ---
            if (data.status === 'deleted') {
                // 1. Filter the stories array to remove the deleted story
                setStories(prevStories => prevStories.filter(story => story._id !== selectedStoryId));
                setPostStatus({ type: 'success', message: data.message || 'Story deleted after reaching flag limit.' });
            } else {
                // 2. Update the state to reflect that the story is flagged (optional styling)
                setStories(prevStories =>
                    prevStories.map(story =>
                        story._id === selectedStoryId
                            ? { ...story, isFlagged: true } // Update the local flag status
                            : story
                    )
                );
                setPostStatus({ type: 'success', message: data.message || 'Story flagged successfully.' });
            }
        } catch (error) {
            console.error('Flag Submission Error:', error);
            setPostStatus({ type: 'error', message: `Error flagging story: ${error.message}` });
        } finally {
            // 3. Reset modal state regardless of success/failure
            setShowFlagModal(false);
            setSelectedStoryId(null);
            setFlagReason('');
        }
    };
    // --- END UPDATED handleFlagSubmit ---

    
    const handlePostStory = async (content) => {
        setPostStatus({ type: 'info', message: 'Submitting story...' });

        try {
            const response = await fetch(API_BASE_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUserId, content }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to post story.');
            }

            setStories(prevStories => [data, ...prevStories]);
            setPostStatus({ type: 'success', message: 'Story posted successfully!' });
            setShowPostForm(false);

        } catch (error) {
            console.error('Story Post Error:', error);
            setPostStatus({ type: 'error', message: `Error posting story: ${error.message}` });
        }
    };

    const handleLike = (storyId) => {
        // NOTE: This logic still needs API integration
        setStories(
            stories.map((story) =>
                story._id === storyId 
                    ? {
                          ...story,
                          likes: story.isLiked ? story.likes - 1 : story.likes + 1,
                          isLiked: !story.isLiked,
                      }
                    : story
            )
        );
    };

    const handleReplyClick = (storyId) => {
        // Toggle the reply box if the user clicks the same story again
        setReplyingToStoryId(prevId => prevId === storyId ? null : storyId);
        setCommentContent(''); 
    };

    const toggleExpand = (storyId) => {
        setExpandedStories((prev) => ({
            ...prev,
            [storyId]: !prev[storyId],
        }));
    };
    
    // Utility functions for rendering populated user data
    const getAvatarSrc = (user) => (user?.avatarUrl || 'https://placehold.co/40x40/5AA7E8/FFFFFF?text=USER');
    const getUsername = (user) => (user?.username || 'Community User');

    // Flag handlers (partial/modal logic remains the same)
    const handleFlagClick = (storyId) => { setSelectedStoryId(storyId); setShowFlagModal(true); setFlagReason(''); };
    const handleReasonChange = (e) => { const value = e.target.value; setFlagReason(value === 'other' ? 'other:' : value); };
    const handleFlagCancel = () => { setShowFlagModal(false); setSelectedStoryId(null); setFlagReason(''); };


    return (
        <div className="min-h-screen font-sans bg-gradient-to-b from-[#B5D8EB] to-[#F4F8FB]">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <CommunityHeader activeTab="ListenLearnPage" />

                {/* Content Area */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 min-h-96 relative overflow-hidden">
                    {/* ... (Header and Shared Stories Avatars section) ... */}
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center">
                                {/* Using placeholder image URL */}
                                <img src="https://placehold.co/64x64/B5D8EB/000459?text=L&L" alt="Listen & Learn" className="w-15 h-15 object-contain" /> 
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#2B5A7A]">Listen & Learn</h2>
                                <p className="text-sm text-gray-500">Share and discover stories of resilience</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <h3 className="text-lg font-semibold text-[#2B5A7A]">Shared Stories</h3>
                        <div className="flex -space-x-3">
                            {/* NOTE: You should map over a real contributors array from API here */}
                            <img src="https://placehold.co/32x32/5AA7E8/FFFFFF?text=A" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://placehold.co/32x32/5AA7E8/FFFFFF?text=B" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://placehold.co/32x32/5AA7E8/FFFFFF?text=C" alt="Community Member" className="w-8 h-8 rounded-full border-2 border-white" />
                            <div className="w-8 h-8 rounded-full bg-[#E3F2FA] border-2 border-white flex items-center justify-center text-xs font-medium text-[#2B5A7A]">
                                +5
                            </div>
                        </div>
                    </div>

                    {/* Story Form */}
                    {showPostForm && (
                        <StoryForm 
                            onPost={handlePostStory}
                            onCancel={() => setShowPostForm(false)}
                        />
                    )}

                    {/* Status Message for Posts/Comments/Flags */}
                    {postStatus.message && (
                        <div className={`p-3 rounded-lg mb-4 text-sm ${postStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {postStatus.message}
                        </div>
                    )}
                    
                    {/* Story Feed */}
                    <div className="space-y-6">
                        {stories.map((story) => (
                            <div
                                key={story._id} 
                                className="bg-gradient-to-b from-[#EDF3F8] to-white rounded-2xl p-6 hover:shadow-lg transition-all transform hover:scale-[1.01] border border-[#E3F2FA]/50"
                            >
                                {/* Story Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative">
                                        <img
                                            src={getAvatarSrc(story.userId)} // Use populated data
                                            alt={getUsername(story.userId)}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-[#2B5A7A]">{getUsername(story.userId)}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-[#2B5A7A]/30"></span>
                                            {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : 'just now'}
                                        </p>
                                    </div>
                                </div>

                                {/* Story Content */}
                                <p className="text-sm text-slate-700 mb-4">
                                    {expandedStories[story._id]
                                        ? story.content 
                                        : story.content.length > 150 
                                        ? story.content.slice(0, 150) + '...'
                                        : story.content}
                                </p>

                                {story.content.length > 150 && (
                                    <button
                                        onClick={() => toggleExpand(story._id)} 
                                        className="text-xs text-blue-500 hover:underline"
                                    >
                                        {expandedStories[story._id] ? 'Show less' : 'Read more'}
                                    </button>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center gap-6 mt-4">
                                    <button
                                        onClick={() => handleLike(story._id)} 
                                        className={`flex items-center gap-2 ${story.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${story.isLiked ? 'fill-current' : ''}`}/>
                                        <span className="text-sm font-medium">{story.likes}</span>
                                    </button>

                                    <button 
                                        onClick={() => handleReplyClick(story._id)} 
                                        className={`flex items-center gap-2 ${replyingToStoryId === story._id ? 'text-blue-500' : 'text-slate-400 hover:text-blue-500'}`}
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">{story.comments ? story.comments.length : 0}</span>
                                    </button>

                                    <button
                                        onClick={() => handleFlagClick(story._id)} 
                                        className={`flex items-center gap-2 ${story.isFlagged ? 'text-yellow-500' : 'text-slate-400 hover:text-yellow-500'}`}
                                        title={story.isFlagged ? 'Story has been flagged' : 'Flag this story'}
                                    >
                                        <Flag className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                {/* CONDITIONAL COMMENT DISPLAY */}
                                {(story.comments && story.comments.length > 0) && (
                                    <div className="mt-4 border-t border-slate-200 pt-3 space-y-3">
                                        <h4 className="text-sm font-semibold text-[#2B5A7A]">
                                            Replies ({story.comments.length})
                                        </h4>
                                        {/* Display comments, showing newest first (optional) */}
                                        {story.comments.slice().reverse().map((comment) => (
                                            <div key={comment._id || comment.createdAt} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                                                <img 
                                                    src={getAvatarSrc(comment.userId)} 
                                                    alt={getUsername(comment.userId)}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <div className="text-xs">
                                                    <p className="font-bold text-[#2B5A7A]">{getUsername(comment.userId)}</p>
                                                    <p className="text-slate-600">{comment.content}</p>
                                                    <p className="text-slate-400 mt-1">
                                                        {new Date(comment.createdAt).toLocaleTimeString()} - {new Date(comment.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* CONDITIONAL COMMENT INPUT BOX */}
                                {replyingToStoryId === story._id && ( 
                                    <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
                                        <textarea
                                            value={commentContent}
                                            onChange={(e) => setCommentContent(e.target.value)}
                                            placeholder="Write your gentle reply here..."
                                            rows="2"
                                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none text-sm resize-none"
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                            <button
                                                onClick={() => setReplyingToStoryId(null)}
                                                className="px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-full transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handlePostComment(story._id)} 
                                                disabled={!commentContent.trim()}
                                                className={`px-3 py-1 text-xs font-medium text-white rounded-full transition ${
                                                    commentContent.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                                                }`}
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Flag Modal - Ensure handleFlagSubmit is called here! */}
                    {showFlagModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                                <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4">
                                    Flag this story
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
                                        // CRITICAL FIX: Ensure the API call runs on submit
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


                    {/* Post Your Story Button */}
                    {!showPostForm && (
                        <div className="mt-10 pt-6 border-t border-slate-200">
                            <h3 className="text-lg font-semibold text-[#2B5A7A] mb-4 text-center">Your Voice Matters</h3>
                            <button 
                                onClick={() => setShowPostForm(true)}
                                className="w-full bg-[#E8A287] text-white py-3 rounded-full font-medium hover:bg-[#D89277] transition flex items-center justify-center gap-2"
                            >
                                POST YOURS
                                <span className="text-xl">+</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="text-center mt-10 text-gray-600 text-sm">
                    <p>Don't worry Be happy</p>
                </footer>
            </div>
        </div>
    );
};

export default ListenLearnPage;