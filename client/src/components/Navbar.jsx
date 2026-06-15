import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Briefcase, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
        isActive(to) 
          ? 'bg-blue-800 text-white shadow-inner border border-blue-700' 
          : 'text-blue-100 hover:bg-blue-800 hover:text-white border border-transparent'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-blue-900 shadow-lg border-b border-blue-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-black tracking-tight flex items-center gap-2 group text-white">
              <div className="bg-white p-1.5 rounded-lg group-hover:bg-blue-50 transition-colors shadow-sm">
                <Briefcase className="w-5 h-5 text-blue-900" />
              </div>
              <span>Carrier<span className="text-blue-300">Grid</span></span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {!user && (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/jobs">Find Jobs</NavLink>
                <NavLink to="/about">About</NavLink>
              </>
            )}
            {user && (
              <>
                {user.role === 'jobseeker' && (
                  <>
                    <NavLink to="/student-dashboard">Dashboard</NavLink>
                    <NavLink to="/jobs">Find Jobs</NavLink>
                    <NavLink to="/resume-builder">Resume Builder</NavLink>
                  </>
                )}
                {user.role === 'organisation' && (
                  <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/manage-jobs">Manage Jobs</NavLink>
                    <NavLink to="/applicants">Applicants</NavLink>
                  </>
                )}
                {user.role === 'admin' && (
                  <NavLink to="/admin">Control Center</NavLink>
                )}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2 md:gap-4 pl-4 md:border-l md:border-blue-700/50">
                {user.role !== 'admin' ? (
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-blue-800 transition-colors group border border-transparent hover:border-blue-700/50"
                  >
                    <div className="bg-blue-800 p-1 rounded-full group-hover:bg-blue-700 transition-colors overflow-hidden flex items-center justify-center w-8 h-8">
                      {user.profile?.avatar ? (
                        <img src={user.profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-blue-200 group-hover:text-white" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-blue-50 hidden sm:block">{user.username}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-default bg-blue-800 border border-blue-700/50 shadow-inner">
                    <div className="bg-purple-900 p-1 rounded-full">
                      <Shield className="w-4 h-4 text-purple-300" />
                    </div>
                    <span className="text-sm font-bold text-purple-200 hidden sm:block">{user.username}</span>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-blue-300 hover:text-white hover:bg-red-500 rounded-full transition-all shadow-sm hover:shadow-md"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-sm font-bold text-blue-100 hover:text-white px-3 py-2 transition-colors hidden sm:block"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white hover:bg-blue-50 text-blue-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-blue-900/50 transition-all hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
