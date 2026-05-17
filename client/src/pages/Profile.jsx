import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Camera, User } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/uploadImage';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile: {
      fullName: '',
      bio: '',
      companyName: '',
      website: '',
      description: '',
      avatar: ''
    }
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      setFormData(prev => ({ ...prev, profile: { ...prev.profile, avatar: imageUrl } }));
      setMessage({ type: 'success', text: 'Image uploaded successfully. Click Save to keep changes.' });
    } else {
      setMessage({ type: 'error', text: 'Failed to upload image. Please check your internet connection or Cloudinary settings.' });
    }
    setUploadingImage(false);
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      const fetchProfile = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('/api/users/profile', config);
          setFormData({
            username: data.username,
            email: data.email,
            profile: data.profile || {}
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put('/api/users/profile', formData, config);
      login({ ...user, username: data.username, email: data.email });
      setMessage({ type: 'success', text: 'Profile settings saved successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information, contact details, and professional profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Account Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                {formData.profile.avatar ? (
                  <img src={formData.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-sm transition">
                {uploadingImage ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Camera className="w-4 h-4" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{user.role === 'jobseeker' ? 'Profile Picture' : 'Company Logo'}</h2>
              <p className="text-sm text-gray-500 mt-1">Upload a professional photo or logo. It will be visible on your profile.</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-500 mt-1">This information will be displayed publicly so be careful what you share.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm bg-white text-gray-900"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email"
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 cursor-not-allowed sm:text-sm"
                value={formData.email}
                readOnly
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm bg-white text-gray-900"
                value={formData.profile.fullName || ''}
                onChange={(e) => setFormData({...formData, profile: {...formData.profile, fullName: e.target.value}})}
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Role Specific Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user.role === 'jobseeker' ? 'Professional Details' : 'Company Details'}</h2>
            <p className="text-sm text-gray-500 mt-1">Provide information about your {user.role === 'jobseeker' ? 'career objectives' : 'organization'}.</p>
          </div>

          {user.role === 'jobseeker' ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Professional Bio</label>
              <textarea 
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm resize-none bg-white text-gray-900"
                value={formData.profile.bio || ''}
                onChange={(e) => setFormData({...formData, profile: {...formData.profile, bio: e.target.value}})}
                placeholder="Write a few sentences about yourself..."
              ></textarea>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm bg-white text-gray-900"
                  value={formData.profile.companyName || ''}
                  onChange={(e) => setFormData({...formData, profile: {...formData.profile, companyName: e.target.value}})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Website URL</label>
                <input 
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm bg-white text-gray-900"
                  value={formData.profile.website || ''}
                  onChange={(e) => setFormData({...formData, profile: {...formData.profile, website: e.target.value}})}
                />
              </div>
            </div>
          )}
        </section>

        <div className="pt-6 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1">
            {message.text && (
              <div className={`flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'} animate-in fade-in`}>
                {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-md shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Profile;
