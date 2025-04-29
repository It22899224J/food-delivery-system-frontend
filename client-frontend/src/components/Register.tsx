import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Truck, Key, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RegisterDriverData, RegisterUserData } from '../types';

const Register = () => {
  // Form state
  const [formData, setFormData] = useState<{
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    contact: string,
    address: string,
    role: 'CUSTOMER' | 'DRIVER' | 'RESTAURANT_ADMIN',
    vehicleType: 'BIKE' | 'CAR' | 'VAN',
    licensePlate: string,
  }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    address: '',
    role: 'CUSTOMER',
    vehicleType: 'BIKE',
    licensePlate: '',
  });
  
  // UI state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formSide, setFormSide] = useState(1); // 1 = first side, 2 = second side
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e:{ target: { name: string, value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateFirstPage = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields on this page');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (passwordStrength < 3) {
      setError('Please create a stronger password');
      return false;
    }
    
    return true;
  };

  const validateSecondPage = () => {
    if (!formData.contact || !formData.address) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (formData.role === 'DRIVER' && !formData.licensePlate) {
      setError('License plate is required for drivers');
      return false;
    }
    
    return true;
  };

  const goToNextPage = () => {
    if (validateFirstPage()) {
      setError("");
      setFormSide(2);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousPage = () => {
    setFormSide(1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateSecondPage()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      // Create registration data object
      const registrationData: RegisterDriverData | RegisterUserData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        contact: formData.contact,
        address: formData.address,
        role: formData.role,
      };
      
      // Add driver-specific fields if registering as a driver
      if (formData.role === 'DRIVER') {
        (registrationData as RegisterDriverData).vehicleType = formData.vehicleType;
        (registrationData as RegisterDriverData).licensePlate = formData.licensePlate;
      }
      
      // Call the register function from AuthContext
      const success = await register(registrationData);
      
      if (success) {
        navigate('/');
      }
      debugger;
    } catch (err) {
      setError(err.response.data.message || 'An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Progress bar and indicator
  const ProgressIndicator = () => (
    <div className="mx-8 my-6">
      <div className="flex justify-between mb-1">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formSide === 1 ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
            {formSide === 1 ? '1' : <CheckCircle size={16} />}
          </div>
          <span className="ml-2 text-sm font-medium">Account Details</span>
        </div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formSide === 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <span className="ml-2 text-sm font-medium">Personal Info</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-orange-500 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: formSide === 1 ? '50%' : '100%' }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Create Your Account</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ProgressIndicator />
        
        <div className="p-4 md:p-6">
          <form onSubmit={formSide === 1 ? (e) => { e.preventDefault(); goToNextPage(); } : handleSubmit}>
            {/* Account Type Selection - Always visible on both sides */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-lg border border-gray-200">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-l-lg ${
                    formData.role === 'CUSTOMER'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-500 hover:text-orange-500'
                  }`}
                  onClick={() => handleInputChange({ target: { name: 'role', value: 'CUSTOMER' } })}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 ${
                    formData.role === 'DRIVER'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-500 hover:text-orange-500'
                  }`}
                  onClick={() => handleInputChange({ target: { name: 'role', value: 'DRIVER' } })}
                >
                  Driver
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-r-lg ${
                    formData.role === 'RESTAURANT_ADMIN'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-500 hover:text-orange-500'
                  }`}
                  onClick={() => handleInputChange({ target: { name: 'role', value: 'RESTAURANT_ADMIN' } })}
                >
                  Restaurant Owner
                </button>
              </div>
            </div>

            {/* First side of the form */}
            {formSide === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 pb-2 border-b">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-2">
                        <User size={16} className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">
                        <Mail size={16} className="inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-gray-700 mb-2">
                        <Key size={16} className="inline mr-2" />
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      
                      {/* Password strength indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs">Password strength: </span>
                            <span className="text-xs font-medium">
                              {passwordStrength === 0 && 'Very weak'}
                              {passwordStrength === 1 && 'Weak'}
                              {passwordStrength === 2 && 'Medium'}
                              {passwordStrength === 3 && 'Strong'}
                              {passwordStrength === 4 && 'Very strong'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full ${
                                passwordStrength <= 1 ? 'bg-red-500' : 
                                passwordStrength === 2 ? 'bg-yellow-500' : 
                                'bg-green-500'
                              }`} 
                              style={{ width: `${passwordStrength * 25}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                        <Key size={16} className="inline mr-2" />
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                      
                      {/* Password match indicator */}
                      {formData.password && formData.confirmPassword && (
                        <p className={`text-xs mt-1 ${
                          formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formData.password === formData.confirmPassword 
                            ? 'Passwords match' 
                            : 'Passwords do not match'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors ml-auto"
                >
                  Continue <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            )}

            {/* Second side of the form */}
            {formSide === 2 && (
              <div className="space-y-6">
                {/* Contact Information Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700 pb-2 border-b">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact" className="block text-gray-700 mb-2">
                        <Phone size={16} className="inline mr-2" />
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your contact number"
                        value={formData.contact}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-gray-700 mb-2">
                        <MapPin size={16} className="inline mr-2" />
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Driver Specific Information */}
                {formData.role === 'DRIVER' && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700 pb-2 border-b">Driver Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="vehicleType" className="block text-gray-700 mb-2">
                          <Truck size={16} className="inline mr-2" />
                          Vehicle Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="vehicleType"
                          name="vehicleType"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={formData.vehicleType}
                          onChange={handleInputChange}
                        >
                          <option value="BIKE">Bike</option>
                          <option value="CAR">Car</option>
                          <option value="VAN">Van</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="licensePlate" className="block text-gray-700 mb-2">
                          <Key size={16} className="inline mr-2" />
                          License Plate <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="licensePlate"
                          name="licensePlate"
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter plate number"
                          value={formData.licensePlate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    className="order-2 sm:order-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft size={16} className="mr-2" /> Back
                  </button>
                  
                  <button
                    type="submit"
                    className="order-1 sm:order-2 py-3 px-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;