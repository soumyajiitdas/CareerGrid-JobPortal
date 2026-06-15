import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, DollarSign, Clock, Filter, Briefcase, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/uploadImage';

const FindJobs = () => {
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    title: '',
    location: '',
    type: 'Any',
    experience: 'Any',
    education: 'Any',
    salaryMin: 0,   // minimum salary filter (LPA)
    status: 'Ongoing',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('/api/jobs');
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const hasApplied = (job) => {
    if (!user) return false;
    return job.applications?.some(
      app => (app.user?._id || app.user)?.toString() === user._id?.toString()
    );
  };

  const handleApplyClick = (job) => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'jobseeker') { alert('Only jobseekers can apply.'); return; }
    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      alert('The application deadline for this job has passed.');
      return;
    }
    if (hasApplied(job)) {
      alert('You have already applied to this job.');
      return;
    }
    setSelectedJob(job);
    setResumeUrl(user.profile?.resume || '');
    setAgreedTerms(false);
    setApplyModalOpen(true);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are accepted.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be 5 MB or less.');
      e.target.value = '';
      return;
    }
    setUploadingResume(true);
    const url = await uploadToCloudinary(file);
    if (url) {
      setResumeUrl(url);
    } else {
      alert('Failed to upload resume. Please check Cloudinary settings.');
    }
    setUploadingResume(false);
  };

  const submitApplication = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`/api/jobs/${selectedJob._id}/apply`, { resume: resumeUrl }, config);
      alert('Applied successfully!');
      setApplyModalOpen(false);
      // Refresh jobs so the button updates to "Already Applied"
      const { data } = await axios.get('/api/jobs');
      setJobs(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchTitle = job.title.toLowerCase().includes(filters.title.toLowerCase()) || 
                       job.title.toLowerCase().includes(search.toLowerCase());
    const matchLoc = job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchType = filters.type === 'Any' || job.type === filters.type;
    const matchExp = filters.experience === 'Any' || job.experienceLevel === filters.experience;
    const matchEdu = filters.education === 'Any' || job.educationLevel === filters.education;
    // Salary filter: if filter is 0 show all; otherwise show jobs where salaryMax >= filter (or negotiable)
    const matchSalary = filters.salaryMin === 0 || 
                        (job.salaryMin === 0 && job.salaryMax === 0) || 
                        (job.salaryMax >= filters.salaryMin);
    
    const isClosed = job.applicationDeadline && new Date() > new Date(job.applicationDeadline);
    const matchStatus = filters.status === 'All' || 
                        (filters.status === 'Ongoing' && !isClosed) || 
                        (filters.status === 'Expired' && isClosed);

    return matchTitle && matchLoc && matchType && matchExp && matchEdu && matchSalary && matchStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto mt-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Find Your Dream Job</h1>
          <p className="text-slate-500">Browse thousands of opportunities tailored for you.</p>
        </div>
        <form 
          className="w-full md:w-96 relative"
          onSubmit={(e) => {
            e.preventDefault();
            if (search.trim() !== '') {
              window.open(`https://www.google.com/search?q=${encodeURIComponent(search)}`, '_blank');
            }
          }}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-20 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-slate-50 focus:bg-white"
            placeholder="Search on Google..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6 sticky top-24">
            <div className="flex items-center gap-2 text-blue-900 font-bold border-b pb-4">
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  placeholder="e.g. Remote, New York"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Job Status</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all text-sm"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Expired">Expired</option>
                  <option value="All">All</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Job Type</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all text-sm"
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="Any">Any Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Experience Level</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all text-sm"
                  value={filters.experience}
                  onChange={(e) => setFilters({...filters, experience: e.target.value})}
                >
                  <option value="Any">Any Experience</option>
                  <option value="Internship">Internship</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Associate">Associate</option>
                  <option value="Mid-Senior">Mid-Senior</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Education Required</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all text-sm"
                  value={filters.education}
                  onChange={(e) => setFilters({...filters, education: e.target.value})}
                >
                  <option value="Any">Any Education</option>
                  <option value="High School">High School</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="Masters">Masters</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Min. Salary (LPA)</label>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>{filters.salaryMin === 0 ? 'Any' : `₹${filters.salaryMin}+ LPA`}</span>
                  <span>₹50 LPA</span>
                </div>
                <input
                  type="range"
                  min={0} max={50} step={1}
                  value={filters.salaryMin}
                  onChange={e => setFilters({ ...filters, salaryMin: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <p className="text-xs text-slate-400 text-center">
                  {filters.salaryMin === 0 ? 'All salaries (incl. Negotiable)' : `≥ ₹${filters.salaryMin} LPA`}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <main className="md:col-span-3 space-y-6">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Results ({filteredJobs.length})</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Clock className="w-4 h-4" /> Latest Postings
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid gap-6">
              {filteredJobs.map(job => (
                <JobCard key={job._id} job={job} onApply={() => handleApplyClick(job)} user={user} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-16 text-center rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
              <div className="bg-slate-50 p-6 rounded-full mb-6 text-slate-300">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No jobs found</h3>
              <p className="text-slate-500 mt-2 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
          )}
        </main>
      </div>

      {applyModalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setApplyModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Apply for {selectedJob.title}</h2>
            
            {selectedJob.termsAndConditions && (
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-40 overflow-y-auto text-sm text-slate-600">
                <h4 className="font-bold text-slate-900 mb-2">Terms & Conditions</h4>
                <p className="whitespace-pre-wrap">{selectedJob.termsAndConditions}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Upload Resume <span className="font-normal text-slate-400">(PDF only, max 5 MB)</span></label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors cursor-pointer"
                />
                {uploadingResume && <p className="text-xs text-blue-600 animate-pulse font-medium mt-1">Uploading...</p>}
                {resumeUrl && !uploadingResume && <p className="text-xs text-green-600 font-bold mt-1">✓ Resume ready</p>}
              </div>

              {selectedJob.termsAndConditions && (
                <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <input 
                    type="checkbox" 
                    id="terms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-700 font-medium cursor-pointer">
                    I have read and agree to the Terms & Conditions of this application.
                  </label>
                </div>
              )}

              <button 
                onClick={submitApplication}
                disabled={uploadingResume || !resumeUrl || (selectedJob.termsAndConditions && !agreedTerms)}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition shadow-md"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const JobCard = ({ job, onApply, user }) => {
  const isClosed = job.applicationDeadline && new Date() > new Date(job.applicationDeadline);
  const applied = user && job.applications?.some(
    app => (app.user?._id || app.user)?.toString() === user._id?.toString()
  );
  const btnDisabled = isClosed || applied;
  const btnLabel = isClosed ? 'Closed' : applied ? 'Applied ✓' : (user ? 'Apply Now' : 'Login to Apply');
  const btnStyle = isClosed
    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
    : applied
    ? 'bg-green-100 text-green-700 cursor-not-allowed shadow-none'
    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20';

  return (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 group flex flex-col md:flex-row justify-between gap-6">
    <div className="space-y-4 flex-1">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{job.title}</h3>
          {isClosed && (
            <span className="shrink-0 bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">Application Closed</span>
          )}
          {!isClosed && applied && (
            <span className="shrink-0 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">Applied</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span className="text-slate-600 font-medium">{job.company?.profile?.companyName || job.company?.username || 'Unknown Company'}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 text-sm font-medium">
        <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
        </div>
        <div className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg flex items-center gap-1.5 text-sm font-medium">
          {(job.salaryMin === 0 && job.salaryMax === 0)
            ? <><DollarSign className="w-3.5 h-3.5 text-slate-500" /> Negotiable</>
            : <><DollarSign className="w-3.5 h-3.5 text-slate-500" /> ₹{job.salaryMin}–₹{job.salaryMax} LPA</>
          }
        </div>
        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-bold">{job.type}</div>
        {job.experienceLevel && (
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg">{job.experienceLevel}</div>
        )}
        {job.educationLevel && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg">{job.educationLevel}</div>
        )}
      </div>
      
      <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">{job.description}</p>

      {job.applicationDeadline && (
        <p className={`text-xs font-medium flex items-center gap-1 ${isClosed ? 'text-red-500' : 'text-slate-400'}`}>
          <Clock className="w-3.5 h-3.5" />
          {isClosed ? 'Deadline passed: ' : 'Apply by: '}
          {new Date(job.applicationDeadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      )}
    </div>
    
    <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
      <button 
        onClick={onApply}
        disabled={btnDisabled}
        className={`w-full px-6 py-3 rounded-xl font-bold transition-colors active:scale-95 shadow-md ${btnStyle}`}
      >
        {btnLabel}
      </button>
      <div className="text-center mt-3 text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
        <Clock className="w-3.5 h-3.5" /> 
        {new Date(job.createdAt).toLocaleDateString()}
      </div>
    </div>
  </div>
);
};

export default FindJobs;
