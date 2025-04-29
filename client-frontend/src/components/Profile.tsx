import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact: user?.contact || '',
    address: user?.address || ''
  });
  console.log(user)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would make an API call here to update the user profile
    setIsEditing(false);
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
            className="px-4 py-2 text-orange-500 hover:text-orange-600 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

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
            >
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;