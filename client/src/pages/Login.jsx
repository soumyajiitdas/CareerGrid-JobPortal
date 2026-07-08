import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requireOTP, setRequireOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      
      if (data.role !== role) {
        setError(`Please log in using the correct account type. This email belongs to an ${data.role} account.`);
        setLoading(false);
        return;
      }

      login(data);
      
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'organisation') {
        navigate('/dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      if (err.response?.data?.requireOTP) {
        setRequireOTP(true);
        setUserId(err.response.data.userId);
        setError('');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
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
      if (data.role === 'admin') {
        navigate('/admin');
      } else if (data.role === 'organisation') {
        navigate('/dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the OTP.');
    } finally {
      setLoading(false);
    }
  };

  if (requireOTP) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-10 border border-gray-100">
        <div className="bg-blue-900 py-8 text-center">
          <AlertCircle className="w-12 h-12 text-white mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
          <p className="text-blue-200">We sent an OTP to your email.</p>
        </div>
        <form onSubmit={handleVerifyOTP} className="p-8 space-y-6">
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
              className="w-full px-4 py-3 text-center text-xl tracking-widest rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition transform active:scale-95 disabled:bg-gray-400"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-10 border border-gray-100">
      <div className="bg-blue-900 py-8 text-center">
        <LogIn className="w-12 h-12 text-white mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-blue-200">Sign in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Address
          </label>
          <input 
            type="email" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-3 pb-2">
          <label className="text-sm font-semibold text-gray-700">Account Type</label>
          <div className="grid grid-cols-3 gap-3">
            <label className={`cursor-pointer border rounded-lg py-2 px-3 text-center text-sm font-medium transition ${role === 'jobseeker' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input type="radio" name="role" className="hidden" checked={role === 'jobseeker'} onChange={() => setRole('jobseeker')} />
              Student
            </label>
            <label className={`cursor-pointer border rounded-lg py-2 px-3 text-center text-sm font-medium transition ${role === 'organisation' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input type="radio" name="role" className="hidden" checked={role === 'organisation'} onChange={() => setRole('organisation')} />
              Organization
            </label>
            <label className={`cursor-pointer border rounded-lg py-2 px-3 text-center text-sm font-medium transition ${role === 'admin' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <input type="radio" name="role" className="hidden" checked={role === 'admin'} onChange={() => setRole('admin')} />
              Admin
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-900 hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition transform active:scale-95 disabled:bg-gray-400"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Don't have an account? {' '}
          <Link to="/register" className="text-blue-900 font-bold hover:underline">
            Register now
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
