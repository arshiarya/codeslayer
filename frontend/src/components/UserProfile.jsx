import React, { useState } from 'react';
import { User, Mail, Edit, Camera, Save } from 'lucide-react';

const UserProfile = ({ user, token, onUpdateProfile }) => {
  // Use state to manage the editable fields (Name)
  const [userName, setUserName] = useState(user?.name || 'Wellness User');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://placehold.co/100x100/93c5fd/ffffff?text=U'); // Placeholder
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  // Function to simulate saving the profile data
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (!user || !user.id) {
        // No authenticated user available — simulate save
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        setIsEditingName(false);
        setIsEditingAvatar(false);
        // Using console.log instead of alert for better practice in production apps
        console.log('Profile saved locally (no authenticated user).');
        alert('Profile saved locally (no authenticated user).');
        return;
      }

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ username: userName, avatarUrl })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to save profile (${res.status})`);
      }

      const updated = await res.json();
      // If backend returns the updated user doc/object, call parent's callback
      if (onUpdateProfile) onUpdateProfile(updated);

      setIsSaving(false);
      setIsEditingName(false);
      setIsEditingAvatar(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsSaving(false);
      alert('Failed to save profile. See console for details.');
    }
  };
  
  // Avatar edit: toggle a simple URL input (no file upload required)
  const handleAvatarEdit = () => {
    setIsEditingAvatar(!isEditingAvatar);
  };

  const handleAvatarUrlChange = (e) => setAvatarUrl(e.target.value);

  // Upload file from user's PC to backend
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!user || !user.id) {
      alert('You must be signed in to upload an avatar.');
      return;
    }

    const form = new FormData();
    form.append('avatar', file);

    try {
      const res = await fetch(`/api/users/${user.id}/avatar`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: form
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Upload failed (${res.status})`);
      }

      const body = await res.json();
      setAvatarUrl(body.avatarUrl);
      if (onUpdateProfile) onUpdateProfile(body.user || { avatarUrl: body.avatarUrl });
      setIsEditingAvatar(false);
      alert('Avatar uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload avatar. See console for details.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) handleFileUpload(file);
  };

  // Preset avatars (three existing choices)
  const presetAvatars = [
    '/avatar-1.png',
    '/avatar-2.png',
    '/avatar-3.png'
  ];

  const choosePreset = async (src) => {
    setAvatarUrl(src);
    // Persist choice to backend if signed in
    if (user && user.id) {
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ avatarUrl: src })
        });
        if (res.ok) {
          const updated = await res.json();
          if (onUpdateProfile) onUpdateProfile(updated);
        }
      } catch (err) {
        console.error('Failed to set preset avatar', err);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl mt-10">
        
        <h1 className="text-3xl font-bold text-gray-800 border-b pb-3 mb-8 flex items-center space-x-3">
          <User className="w-7 h-7 text-blue-600" /> 
          <span>My Profile Settings</span>
        </h1>

        {/* 1. Avatar Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-28 h-28 rounded-full shadow-lg border-4 border-white ring-4 ring-blue-200">
            <img 
              src={avatarUrl} 
              alt="User Avatar" 
              className="w-full h-full object-cover rounded-full" 
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/93c5fd/ffffff?text=U" }}
            />
            {/* Edit Button for Avatar */}
            <button
              onClick={handleAvatarEdit}
              className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-150 shadow-md"
              title="Change Avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          {isEditingAvatar && (
            <div className="mt-3 w-full max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <div className="flex items-center space-x-2">
                <input type="url" value={avatarUrl} onChange={handleAvatarUrlChange} placeholder="https://..." className="flex-1 py-2 px-3 rounded-md border" />
                <button type="button" onClick={() => setIsEditingAvatar(false)} className="text-sm text-gray-500">Done</button>
              </div>
            </div>
          )}
          {/* File upload and preset avatars */}
          <div className="mt-4 w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload from your device</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3" />

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Or choose a preset avatar</label>
              <div className="flex space-x-3">
                {presetAvatars.map((src, idx) => (
                  <button key={idx} type="button" onClick={() => choosePreset(src)} className="border rounded-full overflow-hidden w-12 h-12 p-0">
                    <img src={src} alt={`preset-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* <p className="mt-3 text-xl font-semibold text-gray-800">{userName}</p> */}
        </div>

        {/* 2. Profile Details Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Editable Name Field */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={!isEditingName}
                className={`w-full py-2 px-3 text-lg rounded-md outline-none transition duration-150 ${
                    isEditingName 
                        ? 'bg-white border border-blue-400 focus:ring-2 focus:ring-blue-200'
                        : 'bg-transparent text-gray-800'
                }`}
                required
              />
              <button 
                type="button"
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-blue-500 hover:text-blue-700 transition duration-150 p-1 rounded-full"
                title={isEditingName ? "Cancel Editing" : "Edit Name"}
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Non-Editable Email Field */}
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Non-Editable)</label>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <p className="w-full py-2 px-0 text-lg text-gray-600 font-medium select-text">
                {user?.email || ''}
              </p>
            </div>
          </div>

          {/* Save Button - **FIX APPLIED HERE** */}
          {/* The button now shows if *either* the name is being edited OR the avatar input is shown. */}
          {(isEditingName || isEditingAvatar) && (
            <div className="pt-4 border-t mt-8">
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition duration-150 shadow-md disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                    <>
                        <span className="animate-spin h-5 w-5 border-4 border-t-white border-green-200 rounded-full"></span>
                        <span>Saving...</span>
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                    </>
                )}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
};

export default UserProfile;