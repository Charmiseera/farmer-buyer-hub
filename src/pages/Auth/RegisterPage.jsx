
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { Tractor, ShoppingBag, Eye, EyeOff, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phone: '',
    role: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, state, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  const handleRoleSelect = (role) => {
    setFormData(prevData => ({
      ...prevData,
      role
    }));
    
    if (errors.role) {
      setErrors(prevErrors => ({
        ...prevErrors,
        role: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.location,
        formData.phone
      );
      
      // If registration successful, redirect based on role
      if (state.user?.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 shadow-md rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-agri-dark">Create Your Account</h2>
              <p className="text-gray-600 mt-2">
                Join AgriConnect and start buying or selling agricultural products
              </p>
            </div>
            
            {state.error && (
              <div className="bg-red-50 text-red-700 p-3 mb-6 rounded-md text-sm">
                {state.error}
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-agri-dark mb-4">I want to join as:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('farmer')}
                  className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                    formData.role === 'farmer'
                      ? 'border-agri-green bg-agri-green/10 text-agri-dark'
                      : 'border-gray-200 hover:border-agri-green/50 text-gray-700'
                  }`}
                >
                  <div className={`rounded-full p-2 mr-3 ${
                    formData.role === 'farmer' ? 'bg-agri-green/20' : 'bg-gray-100'
                  }`}>
                    <Tractor className={`h-6 w-6 ${
                      formData.role === 'farmer' ? 'text-agri-green' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Farmer</h4>
                    <p className="text-sm text-gray-500">I want to sell agricultural products</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRoleSelect('buyer')}
                  className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                    formData.role === 'buyer'
                      ? 'border-agri-orange bg-agri-orange/10 text-agri-dark'
                      : 'border-gray-200 hover:border-agri-orange/50 text-gray-700'
                  }`}
                >
                  <div className={`rounded-full p-2 mr-3 ${
                    formData.role === 'buyer' ? 'bg-agri-orange/20' : 'bg-gray-100'
                  }`}>
                    <ShoppingBag className={`h-6 w-6 ${
                      formData.role === 'buyer' ? 'text-agri-orange' : 'text-gray-500'
                    }`} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium">Buyer</h4>
                    <p className="text-sm text-gray-500">I want to buy fresh products</p>
                  </div>
                </button>
              </div>
              
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`agri-input w-full ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`agri-input w-full ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`agri-input w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`agri-input w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className={`agri-input w-full ${errors.location ? 'border-red-500' : ''}`}
                    placeholder="City, State"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`agri-input w-full ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`agri-button-primary w-full flex justify-center items-center ${
                    formData.role === 'buyer' ? 'bg-agri-orange hover:bg-orange-600' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-agri-green hover:text-green-700">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
