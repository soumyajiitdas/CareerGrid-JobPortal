import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Shield, AlertCircle, Phone } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'jobseeker',
    contact: ''
  });
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [suffix] = useState(Math.random().toString(36).substring(2, 6).toLowerCase());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [requireOTP, setRequireOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'username') {
      setUsernameEdited(true);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFullNameChange = (e) => {
    const newName = e.target.value;
    const firstName = newName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    
    setFormData(prev => ({
      ...prev,
      fullName: newName,
      username: usernameEdited ? prev.username : (firstName ? `${firstName}@${suffix}` : '')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/users/register', formData);
      if (data.requireOTP) {
        setRequireOTP(true);
        setUserId(data.userId);
      } else {
        login(data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/users/verify-otp', { userId, otp });
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (requireOTP) {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-100">
        <div className="bg-blue-900 py-6 text-center">
          <Shield className="w-10 h-10 text-white mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
          <p className="text-blue-200">We sent an OTP to {formData.email}</p>
        </div>
        <form onSubmit={handleVerifyOTP} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Enter OTP
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-2 text-center text-xl tracking-widest rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition transform active:scale-95 disabled:bg-gray-400 mt-4"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-100">
      <div className="bg-blue-900 py-6 text-center">
        <UserPlus className="w-10 h-10 text-white mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-blue-200">Join our community today</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input 
              name="fullName"
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Your Name"
              value={formData.fullName}
              onChange={handleFullNameChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Username
            </label>
            <input 
              name="username"
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="yourname@abcd"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="w-4 h-4" /> Contact
            </label>
            <input 
              name="contact"
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="+91..."
              value={formData.contact}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          <input 
            name="email"
            type="email" 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Password
          </label>
          <input 
            name="password"
            type="password" 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Account Type
          </label>
          <select 
            name="role"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="jobseeker">Jobseeker (Student)</option>
            <option value="organisation">Organisation (Employer)</option>
          </select>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input 
            type="checkbox" 
            id="privacy"
            className="mt-1 border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            required
          />
          <label htmlFor="privacy" className="text-sm text-gray-600 leading-tight cursor-pointer">
            I agree to the <Link to="/privacy" className="text-blue-900 font-bold hover:underline" target="_blank">Privacy Policy</Link> and <Link to="/privacy" className="text-blue-900 font-bold hover:underline" target="_blank">Terms of Service</Link>.
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition transform active:scale-95 disabled:bg-gray-400 mt-4"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <div className="text-center text-sm text-gray-600 pt-2">
          Already have an account? {' '}
          <Link to="/login" className="text-blue-900 font-bold hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
