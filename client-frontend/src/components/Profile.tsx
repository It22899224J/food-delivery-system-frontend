import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, isAuthenticated, updateProfile, deleteProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact: user?.contact || '',
    address: user?.address || ''
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
        address: user.address || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        address: formData.address
      });
      
      if (success) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      setError(err instanceof Error ? err.message : 'An error occurred while deleting your account');
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="mr-2 mt-0.5 flex-shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}
        
        {/* Profile header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-orange-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.role === 'RESTAURANT_ADMIN' ? capitalizeFirstLetter('restaurant admin') : capitalizeFirstLetter(user.role.toLocaleLowerCase())}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSubmitting}
            className="px-4 py-2 text-orange-500 hover:text-orange-600 transition-colors disabled:text-gray-400"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={isEditing ? formData.name : user.name}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Mail size={16} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={isEditing ? formData.email : user.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                value={isEditing ? formData.contact : user.contact}
                onChange={handleInputChange}
                readOnly={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  !isEditing && 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <MapPin size={16} className="inline mr-2" />
                Delivery Address
              </label>
              <input
                type="text"
                name="address"
                value={isEditing ? formData.address : user.address}
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
              className="mt-6 w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          )}
        </form>

        {/* Delete Account Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Danger Zone</h3>
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="w-full py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
            disabled={isSubmitting}
          >
            <Trash2 size={18} className="mr-2" />
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Delete Account</h3>
              <p className="mb-6 text-gray-600">
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