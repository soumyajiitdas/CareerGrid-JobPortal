import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, FileText, User, ArrowRight, Clock, CheckCircle, Search, Sparkles, Building2, MapPin } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const { data } = await axios.get('/api/jobs');
        const userApplications = data.filter(job => 
          job.applications?.some(app => (app.user?._id || app.user)?.toString() === user._id?.toString())
        );
        // Sort by most recently applied (approximate using job creation date for now, or actual app date if available)
        // Since we don't have exactly the app date easily accessible here, we'll just reverse it to show newest.
        setAppliedJobs(userApplications.reverse());
      } catch (error) {
        console.error('Error fetching jobs for dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchAppliedJobs();
    }
  }, [user]);

  if (!user) return null;

  const profileCompleteness = user.profile?.resume ? 100 : (user.profile?.skills?.length > 0 ? 70 : 40);

  return (
    <div className="space-y-8 max-w-7xl mx-auto mt-4 pb-20">
      {/* Premium Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-inner flex-shrink-0 overflow-hidden">
            {user.profile?.avatar ? (
              <img src={user.profile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-purple-200" />
            )}
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-100 text-xs font-bold backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Jobseeker Profile Active
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">Welcome, {user.profile?.fullName || user.username}</h1>
            <p className="text-purple-200 font-medium text-lg">Your next big opportunity is just around the corner.</p>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link to="/" className="bg-white text-indigo-900 px-6 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2">
            <Search className="w-5 h-5" /> Explore Jobs
          </Link>
          <Link to="/profile" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold hover:bg-white/20 transition flex items-center justify-center gap-2">
            <User className="w-5 h-5" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-100 transition-colors"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-4">
              <div className="bg-blue-100 p-3.5 rounded-2xl text-blue-600 inline-block">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Total Applications</p>
                <p className="text-4xl font-black text-slate-900">{appliedJobs.length}</p>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">All Time</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-100 transition-colors"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-4 w-full">
              <div className="bg-emerald-100 p-3.5 rounded-2xl text-emerald-600 inline-block">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="w-full">
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1 flex justify-between items-center w-full">
                  Profile Strength <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{profileCompleteness}%</span>
                </p>
                <div className="w-full bg-slate-100 rounded-full h-3 mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${profileCompleteness}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-purple-200 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-100 transition-colors"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-4">
              <div className="bg-purple-100 p-3.5 rounded-2xl text-purple-600 inline-block">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Resume Status</p>
                <p className={`text-2xl font-black ${user.profile?.resume ? 'text-slate-900' : 'text-amber-600'}`}>
                  {user.profile?.resume ? 'Uploaded' : 'Missing'}
                </p>
                {!user.profile?.resume && (
                  <Link to="/resume-builder" className="text-xs font-bold text-purple-600 hover:text-purple-800 mt-1 inline-block">Create one now &rarr;</Link>
                )}
              </div>
            </div>
            {user.profile?.resume && (
              <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-lg">Ready</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600"/> Application History
              </h2>
              <Link to="/" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                Find Jobs <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
            
            <div className="p-6 flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : appliedJobs.length > 0 ? (
                <div className="space-y-4">
                  {appliedJobs.slice(0, 5).map(job => (
                    <div key={job._id} className="group flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xl text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors overflow-hidden">
                          {job.company?.profile?.avatar ? (
                            <img src={job.company.profile.avatar} alt="Company" className="w-full h-full object-cover" />
                          ) : (
                            job.company?.profile?.companyName?.charAt(0).toUpperCase() || 'C'
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5"/> {job.company?.profile?.companyName || 'Unknown Company'}</span>
                            <span className="hidden sm:flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {job.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> Application Sent
                        </span>
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {/* Fallback to job creation date if actual apply date isn't stored in this payload */}
                          Applied Recently
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <Search className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No applications yet</h3>
                  <p className="text-slate-500 text-sm mt-1 mb-6 max-w-xs">You haven't applied to any jobs yet. Your next big career move is waiting for you.</p>
                  <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                    Browse Available Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Tips */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/" className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 p-4 rounded-2xl transition border border-slate-100 group">
                <span className="font-bold flex items-center gap-3"><Search className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" /> Search Jobs</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/resume-builder" className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 p-4 rounded-2xl transition border border-slate-100 group">
                <span className="font-bold flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" /> Build Resume</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/profile" className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 p-4 rounded-2xl transition border border-slate-100 group">
                <span className="font-bold flex items-center gap-3"><User className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" /> Update Profile</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-300" /> Career Tips
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <h4 className="font-bold text-white mb-1 text-sm">Tailor Your Resume</h4>
                  <p className="text-emerald-50 text-xs leading-relaxed">Customize your resume for the specific job you're applying for to stand out to recruiters.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <h4 className="font-bold text-white mb-1 text-sm">Add Your Skills</h4>
                  <p className="text-emerald-50 text-xs leading-relaxed">Profiles with 5 or more skills are 60% more likely to be contacted by employers.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
