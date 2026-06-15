import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getSafePdfUrl } from '../utils/uploadImage';
import { Users, FileText, ExternalLink, Briefcase } from 'lucide-react';

const CompanyApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('all');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMyJobs();
    }
  }, [user]);

  useEffect(() => {
    if (jobs.length > 0) {
      fetchApplicants(selectedJobId);
    }
  }, [selectedJobId, jobs]);

  const fetchMyJobs = async () => {
    try {
      const { data } = await axios.get('/api/jobs');
      const myJobs = data.filter(j => j.company._id === user._id || j.company === user._id);
      setJobs(myJobs);
      // Fetch all applicants initially
      if (myJobs.length > 0) {
        fetchAllApplicants(myJobs);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchAllApplicants = async (myJobs) => {
    setLoadingApplicants(true);
    let allApps = [];
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      for (const job of myJobs) {
        const { data } = await axios.get(`/api/jobs/${job._id}/applicants`, config);
        const appsWithJob = data.map(app => ({ ...app, jobTitle: job.title }));
        allApps = [...allApps, ...appsWithJob];
      }
      // Sort by latest applied
      allApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      setApplicants(allApps);
    } catch (err) {
      console.error('Error fetching all applicants', err);
    } finally {
      setLoadingApplicants(false);
      setLoading(false);
    }
  };

  const fetchApplicants = async (jobId) => {
    if (jobId === 'all') {
      fetchAllApplicants(jobs);
      return;
    }
    setLoadingApplicants(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/jobs/${jobId}/applicants`, config);
      const jobTitle = jobs.find(j => j._id === jobId)?.title;
      const appsWithJob = data.map(app => ({ ...app, jobTitle }));
      setApplicants(appsWithJob);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  return (
    <div className="space-y-8 min-h-[75vh] max-w-7xl mx-auto mt-4">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-2">
          <Users className="w-8 h-8" /> Applicants
        </h1>
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-slate-700">Filter by Job:</label>
          <select 
            value={selectedJobId} 
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Jobs</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>{job.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading || loadingApplicants ? (
          <div className="p-10 text-center text-slate-400">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center gap-4 text-slate-500">
            <div className="bg-slate-50 p-6 rounded-full"><Users className="w-12 h-12 text-slate-300" /></div>
            <p className="text-lg font-medium">No applicants found for this selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Candidate</th>
                  <th className="px-6 py-4 font-bold">Applied For</th>
                  <th className="px-6 py-4 font-bold">Contact</th>
                  <th className="px-6 py-4 font-bold">Applied On</th>
                  <th className="px-6 py-4 font-bold">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((app, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{app.user?.profile?.fullName || '—'}</p>
                      <p className="text-xs text-slate-500">@{app.user?.username}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                        <Briefcase className="w-3.5 h-3.5" /> {app.jobTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700">{app.user?.email}</p>
                      <p className="text-xs text-slate-500">{app.user?.contact || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {new Date(app.appliedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-6 py-4">
                      {app.resume ? (
                        <a
                          href={getSafePdfUrl(app.resume)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-800 transition"
                        >
                          <FileText className="w-4 h-4" /> View PDF
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-300 italic text-xs">Not provided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyApplicants;
