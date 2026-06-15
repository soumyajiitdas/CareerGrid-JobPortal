import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <span>CarrierGrid</span>
            </Link>
            <p className="text-sm text-gray-400">
              Connecting talented students with top organizations. Build your resume, find your dream job, and launch your career.
            </p>
            <div className="flex space-x-4 pt-2">
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer font-semibold text-sm">Twitter</span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer font-semibold text-sm">LinkedIn</span>
              <span className="text-gray-400 hover:text-white transition-colors cursor-pointer font-semibold text-sm">GitHub</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-blue-400 transition-colors">Find Jobs</Link></li>
              <li><Link to="/resume-builder" className="hover:text-blue-400 transition-colors">Resume Builder</Link></li>
              <li><Link to="/profile" className="hover:text-blue-400 transition-colors">Career Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-blue-400 transition-colors">Post a Job</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Company Dashboard</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">Pricing & Plans</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal & Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors">FAQ & Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Smart Student Assistant. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
