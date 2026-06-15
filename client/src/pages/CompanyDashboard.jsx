import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, CheckCircle, ArrowRight, Building, Plus, Activity, Star } from 'lucide-react';

const CompanyDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0 });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/jobs');
      const myJobs = data.filter(j => j.company._id === user._id || j.company === user._id);
      setJobs(myJobs);

      let totalApplicants = 0;
      let activeJobs = 0;

      myJobs.forEach(job => {
        totalApplicants += (job.applications?.length || 0);
        const isClosed = job.applicationDeadline && new Date() > new Date(job.applicationDeadline);
        if (!isClosed) activeJobs++;
      });

      setStats({ activeJobs, totalApplicants });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const companyName = user.profile?.companyName || user.username;
  const recentJobs = jobs.slice(0, 4);

  return (
    <div className="space-y-8 min-h-[75vh] max-w-7xl mx-auto mt-4 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center shadow-inner flex-shrink-0">
            {user.profile?.avatar ? (
              <img src={user.profile.avatar} alt="Company Logo" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Building className="w-12 h-12 text-blue-200" />
            )}
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 text-xs font-bold backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Company Account Active
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{companyName}</h1>
            <p className="text-blue-200 font-medium text-lg">Manage your recruitment pipeline efficiently.</p>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link to="/manage-jobs" className="bg-white text-blue-900 px-6 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Post New Job
          </Link>
          <Link to="/applicants" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold hover:bg-white/20 transition flex items-center justify-center gap-2">
            <Users className="w-5 h-5" /> Review Candidates
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
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Total Jobs Posted</p>
                <p className="text-4xl font-black text-slate-900">{jobs.length}</p>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg">Lifetime</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-100 transition-colors"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-4">
              <div className="bg-emerald-100 p-3.5 rounded-2xl text-emerald-600 inline-block">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Active Jobs</p>
                <p className="text-4xl font-black text-slate-900">{stats.activeJobs}</p>
              </div>
            </div>
            <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-lg">Currently Live</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-purple-200 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:bg-purple-100 transition-colors"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-4">
              <div className="bg-purple-100 p-3.5 rounded-2xl text-purple-600 inline-block">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Total Applicants</p>
                <p className="text-4xl font-black text-slate-900">{stats.totalApplicants}</p>
              </div>
            </div>
            <div className="bg-purple-50 text-purple-600 text-xs font-bold px-2 py-1 rounded-lg">All Time</div>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600"/> Recent Postings
              </h2>
              <Link to="/manage-jobs" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
                View All <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
            <div className="p-6 flex-1">
              {jobs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <Briefcase className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No jobs posted</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-xs">You haven't posted any jobs yet. Create your first listing to start hiring.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentJobs.map(job => {
                    const isClosed = job.applicationDeadline && new Date() > new Date(job.applicationDeadline);
                    return (
                      <div key={job._id} className="group flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all shadow-sm hover:shadow-md">
                        <div className="flex gap-4 items-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${isClosed ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'}`}>
                            {job.title.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-700 transition-colors">{job.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-slate-500 font-medium">{job.location}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-sm text-slate-500 font-medium">{job.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${isClosed ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-700'}`}>
                            {isClosed ? 'Closed' : 'Active'}
                          </span>
                          <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {job.applications?.length || 0} Apps
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Hiring Tips & Insights */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" /> Pro Tips
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <h4 className="font-bold text-white mb-1 text-sm">Write Clear Descriptions</h4>
                  <p className="text-indigo-100 text-xs leading-relaxed">Jobs with clear, detailed descriptions and requirements receive 40% more qualified applicants.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <h4 className="font-bold text-white mb-1 text-sm">Review Promptly</h4>
                  <p className="text-indigo-100 text-xs leading-relaxed">Top candidates are off the market in 10 days. Review applicants frequently to secure the best talent.</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <h4 className="font-bold text-white mb-1 text-sm">Complete Your Profile</h4>
                  <p className="text-indigo-100 text-xs leading-relaxed">Students are more likely to apply to organizations with complete profiles and logos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDashboard;
