import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, Building, FileText, Trash2, CheckCircle, Clock } from 'lucide-react';

const AlertCircle = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobseekers');
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const [usersRes, jobsRes] = await Promise.all([
        axios.get('/api/users/all', config),
        axios.get('/api/jobs')
      ]);
      setUsers(usersRes.data.filter(u => u.role !== 'admin'));
      setJobs(jobsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/users/${id}/approve`, {}, config);
      fetchData();
    } catch (err) {
      alert('Failed to approve organisation');
    }
  };

  const jobseekers = users.filter(u => u.role === 'jobseeker');
  const orgs = users.filter(u => u.role === 'organisation');

  const tabs = [
    { id: 'jobseekers', label: 'Jobseekers', icon: <Users className="w-4 h-4" />, count: jobseekers.length },
    { id: 'orgs', label: 'Organisations', icon: <Building className="w-4 h-4" />, count: orgs.length },
    { id: 'jobs', label: 'Jobs', icon: <FileText className="w-4 h-4" />, count: jobs.length },
  ];

  return (
    <div className="space-y-8 min-h-[75vh]">
      <div className="flex items-center gap-3">
        <Shield className="w-10 h-10 text-blue-900" />
        <h1 className="text-3xl font-bold text-blue-900">Admin Control Center</h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard icon={<Users className="text-blue-600 w-6 h-6" />} label="Jobseekers" value={jobseekers.length} color="blue" />
        <StatCard icon={<Building className="text-emerald-600 w-6 h-6" />} label="Organisations" value={orgs.length} color="emerald" />
        <StatCard icon={<FileText className="text-purple-600 w-6 h-6" />} label="Live Jobs" value={jobs.length} color="purple" />
      </div>

      {/* Main Panel - vertical tabs */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-52 bg-slate-50 border-r border-slate-100 flex flex-col pt-4 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold text-left transition-all border-l-4 ${
                activeTab === tab.id
                  ? 'border-blue-600 bg-white text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white'
              }`}
            >
              {tab.icon}
              <span className="flex-1">{tab.label}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full py-20 text-slate-400">Loading...</div>
          ) : activeTab === 'jobs' ? (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-bold">Job Title</th>
                  <th className="px-6 py-3 font-bold">Company</th>
                  <th className="px-6 py-3 font-bold">Location</th>
                  <th className="px-6 py-3 font-bold">Applications</th>
                  <th className="px-6 py-3 font-bold">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-400">No jobs found.</td></tr>
                ) : jobs.map(j => (
                  <tr key={j._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{j.title}</td>
                    <td className="px-6 py-4 text-gray-600">{j.company?.profile?.companyName || j.company?.username || 'Unknown'}</td>
                    <td className="px-6 py-4 text-gray-600">{j.location}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 font-bold text-xs px-2 py-1 rounded-full">{j.applications?.length || 0} applicants</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {formatDate(j.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 font-bold">Name</th>
                  <th className="px-6 py-3 font-bold">Email</th>
                  <th className="px-6 py-3 font-bold">Contact</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold">Created At</th>
                  <th className="px-6 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(activeTab === 'orgs' ? orgs : jobseekers).length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-400">No records found.</td></tr>
                ) : (activeTab === 'orgs' ? orgs : jobseekers).map(u => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {u.profile?.fullName || u.profile?.companyName || '—'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">@{u.username}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{u.contact || '—'}</td>
                    <td className="px-6 py-4">
                      {u.role === 'organisation' ? (
                        u.isApproved ? (
                          <span className="text-green-600 flex items-center gap-1 font-bold text-xs bg-green-50 px-2 py-1 rounded-full w-fit">
                            <CheckCircle className="w-3.5 h-3.5" /> Approved
                          </span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1 font-bold text-xs bg-amber-50 px-2 py-1 rounded-full w-fit">
                            <AlertCircle className="w-3.5 h-3.5" /> Pending
                          </span>
                        )
                      ) : (
                        <span className="text-green-600 flex items-center gap-1 font-bold text-xs bg-green-50 px-2 py-1 rounded-full w-fit">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(u.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {u.role === 'organisation' && !u.isApproved && (
                        <button
                          onClick={() => handleApprove(u._id)}
                          className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-700 transition"
                        >
                          Approve
                        </button>
                      )}
                      <button className="text-red-400 hover:text-red-600 transition p-1 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colorMap = {
    blue: 'bg-blue-50',
    emerald: 'bg-emerald-50',
    purple: 'bg-purple-50',
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorMap[color] || 'bg-gray-50'}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
