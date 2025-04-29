import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, AlertCircle, Trash2, Camera, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, isAuthenticated, updateProfile, deleteProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact: user?.contact || '',
    address: user?.address || '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      
      // Call the updateProfile function from AuthContext
      const success = await updateProfile({
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        address: formData.address,
      });
      
      if (success) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await deleteProfile();
      
      if (success) {
        // Redirect to home page after successful deletion
        navigate('/');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (err) {
      setError(err ? err.message : 'An error occurred while deleting your account');
      setShowDeleteConfirmation(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  // Get role badge color based on user role
  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'RESTAURANT_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'CUSTOMER':
        return 'bg-red-100 text-red-800';
      case 'DRIVER':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="mx-auto px-4 py-8">
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 rounded-t-xl bg-gradient-to-r from-orange-400 to-orange-600 overflow-hidden"></div>
        
        {/* Profile Header with Avatar */}
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-12 px-6 pb-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                  <User size={64} className="text-orange-500" />
                </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                    {user.role === 'RESTAURANT_ADMIN' ? capitalizeFirstLetter('restaurant admin') : capitalizeFirstLetter(user.role.toLowerCase())}
                  </span>
                  <span className="ml-3 text-gray-500 flex items-center">
                    <Mail size={14} className="mr-1" />
                    {user.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSubmitting}
                className="mt-4 md:mt-0 px-4 py-2 flex items-center bg-white border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors disabled:text-gray-400 disabled:border-gray-400"
              >
                {isEditing ? 'Cancel' : (
                  <>
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-b-xl shadow-md p-6 mb-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Profile form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <Phone size={16} className="inline mr-2" />
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <MapPin size={16} className="inline mr-2" />
                Delivery Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="mt-8 w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              <Save size={18} className="mr-2" />
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          )}
        </form>

        {/* Delete Account Button - Only visible when editing */}
        {isEditing && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="w-full py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              <Trash2 size={18} className="mr-2" />
              Delete Account
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-2">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold">Delete Account</h3>
              </div>
              <p className="mb-6 text-gray-600 text-center">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;