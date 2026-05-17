import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getSafePdfUrl } from '../utils/uploadImage';
import { PlusCircle, List, Send, CheckCircle, XCircle, Edit2, X, Clock, Calendar, IndianRupee, Users, FileText, Phone, Mail, ExternalLink } from 'lucide-react';

const MAX_SALARY = 50; // in LPA

const toLocalDatetimeValue = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const isDeadlinePassed = (deadline) => deadline && new Date() > new Date(deadline);

const formatSalary = (min, max) => {
  if (!min && !max) return 'Negotiable';
  if (min === max) return `₹${min} LPA`;
  return `₹${min} – ₹${max} LPA`;
};

/* ── Dual-handle range slider ─────────────────────────────────── */
const SalaryRangeSlider = ({ min, max, onChange }) => {
  const trackRef = useRef(null);

  const getPercent = (val) => Math.round((val / MAX_SALARY) * 100);

  const leftPct = getPercent(min);
  const rightPct = getPercent(max);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm font-semibold">
        <span className="text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
          {min === 0 && max === 0 ? '🤝 Negotiable' : `₹${min} – ₹${max} LPA`}
        </span>
        <span className="text-slate-400 text-xs">Max {MAX_SALARY} LPA</span>
      </div>

      <div className="relative h-6 flex items-center" ref={trackRef}>
        {/* Track background */}
        <div className="absolute w-full h-2 bg-slate-200 rounded-full"></div>
        {/* Active fill */}
        <div
          className="absolute h-2 bg-blue-500 rounded-full"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        ></div>

        {/* Min thumb */}
        <input
          type="range"
          min={0}
          max={MAX_SALARY}
          step={1}
          value={min}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), max);
            onChange(val, max);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer range-thumb"
          style={{ zIndex: min > MAX_SALARY - 2 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={0}
          max={MAX_SALARY}
          step={1}
          value={max}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), min);
            onChange(min, val);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-auto cursor-pointer range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-400 font-medium">
        <span>₹0 (Negotiable)</span>
        <span>₹{MAX_SALARY} LPA</span>
      </div>

      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          box-shadow: 0 1px 4px rgba(0,0,0,0.18);
          cursor: pointer;
          pointer-events: all;
          transition: border-color 0.2s;
        }
        .range-thumb::-webkit-slider-thumb:hover {
          border-color: #2563eb;
        }
        .range-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #3b82f6;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

/* ── Main Component ───────────────────────────────────────────── */
const CompanyDashboard = () => {
  const [view, setView] = useState('list');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [editJob, setEditJob] = useState(null);
  const [editForm, setEditForm] = useState({ applicationDeadline: '', termsAndConditions: '', salaryMin: 0, salaryMax: 0 });
  const [editSaving, setEditSaving] = useState(false);

  // Collapsible rows: { [jobId]: { open, applicants, loading } }
  const [expandedJobs, setExpandedJobs] = useState({});

  const toggleJob = async (job) => {
    const id = job._id;
    const alreadyOpen = expandedJobs[id]?.open;
    if (alreadyOpen) {
      setExpandedJobs(prev => ({ ...prev, [id]: { ...prev[id], open: false } }));
      return;
    }
    // Already fetched before — just re-open
    if (expandedJobs[id]?.applicants) {
      setExpandedJobs(prev => ({ ...prev, [id]: { ...prev[id], open: true } }));
      return;
    }
    // First time — fetch
    setExpandedJobs(prev => ({ ...prev, [id]: { open: true, loading: true, applicants: [] } }));
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/jobs/${id}/applicants`, config);
      setExpandedJobs(prev => ({ ...prev, [id]: { open: true, loading: false, applicants: data } }));
    } catch (err) {
      alert('Failed to load applicants: ' + (err.response?.data?.message || err.message));
      setExpandedJobs(prev => ({ ...prev, [id]: { open: false, loading: false, applicants: [] } }));
    }
  };

  const emptyForm = {
    title: '', description: '', location: '', type: 'Full-time',
    salaryMin: 0, salaryMax: 0,
    experienceLevel: 'Entry Level', educationLevel: 'Any',
    requirements: '', termsAndConditions: '', applicationDeadline: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => { 
    if (user) {
      fetchMyJobs(); 
    }
  }, [user]);

  const fetchMyJobs = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get('/api/jobs');
      const myJobs = data.filter(j => j.company._id === user._id || j.company === user._id);
      setJobs(myJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicationDeadline) {
      alert('Application deadline is required.');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const jobData = {
        ...formData,
        requirements: formData.requirements.split(',').map(s => s.trim()).filter(Boolean),
      };
      await axios.post('/api/jobs', jobData, config);
      alert('Job posted successfully!');
      setFormData(emptyForm);
      setView('list');
      fetchMyJobs();
    } catch (err) {
      alert('Error posting job');
    }
  };

  const openEdit = (job) => {
    setEditJob(job);
    setEditForm({
      applicationDeadline: toLocalDatetimeValue(job.applicationDeadline),
      termsAndConditions: job.termsAndConditions || '',
      salaryMin: job.salaryMin ?? 0,
      salaryMax: job.salaryMax ?? 0,
    });
  };

  const saveEdit = async () => {
    if (!editForm.applicationDeadline) {
      alert('Application deadline is required.');
      return;
    }
    setEditSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/jobs/${editJob._id}`, {
        applicationDeadline: editForm.applicationDeadline,
        termsAndConditions: editForm.termsAndConditions,
        salaryMin: editForm.salaryMin,
        salaryMax: editForm.salaryMax,
      }, config);
      setEditJob(null);
      fetchMyJobs();
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.message || err.message));
    } finally {
      setEditSaving(false);
    }
  };

  const f = formData;
  const setF = (patch) => setFormData(prev => ({ ...prev, ...patch }));

  return (
    <div className="space-y-8 min-h-[75vh]">

      {editJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditJob(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Edit Job Settings</h3>
            <p className="text-sm text-slate-500 mb-6">{editJob.title}</p>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-blue-600" /> Salary Range
                </label>
                <SalaryRangeSlider
                  min={editForm.salaryMin}
                  max={editForm.salaryMax}
                  onChange={(mn, mx) => setEditForm(p => ({ ...p, salaryMin: mn, salaryMax: mx }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Application Deadline <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  value={editForm.applicationDeadline}
                  onChange={(e) => setEditForm(p => ({ ...p, applicationDeadline: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Terms & Conditions</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  value={editForm.termsAndConditions}
                  onChange={(e) => setEditForm(p => ({ ...p, termsAndConditions: e.target.value }))}
                  placeholder="Update terms for this job..."
                />
              </div>

              <button
                onClick={saveEdit}
                disabled={editSaving}
                className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-bold hover:bg-blue-800 transition disabled:opacity-50"
              >
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-900">Organisation Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => setView('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${view === 'list' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900 border border-blue-900'}`}>
            <List className="w-5 h-5" /> My Jobs
          </button>
          <button onClick={() => setView('create')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${view === 'create' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900 border border-blue-900'}`}>
            <PlusCircle className="w-5 h-5" /> Post New Job
          </button>
        </div>
      </div>

      {/* ── Job List ── */}
      {view === 'list' ? (
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-2xl p-10 text-center text-slate-400 shadow-sm">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-slate-400 shadow-sm">No jobs posted yet.</div>
          ) : jobs.map(job => {
            const closed = isDeadlinePassed(job.applicationDeadline);
            const expanded = expandedJobs[job._id];
            const isOpen = expanded?.open;

            return (
              <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* ── Job summary row (always visible) ── */}
                <div
                  className="flex flex-wrap items-center gap-3 px-6 py-4 cursor-pointer hover:bg-slate-50 transition select-none"
                  onClick={() => toggleJob(job)}
                >
                  {/* Chevron */}
                  <span className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-blue-900 truncate">{job.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{job.type} &bull; {formatSalary(job.salaryMin, job.salaryMax)}</p>
                  </div>

                  {/* Deadline */}
                  <span className={`text-xs font-medium flex items-center gap-1 ${closed ? 'text-red-500' : 'text-slate-500'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    {job.applicationDeadline
                      ? new Date(job.applicationDeadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                      : 'No deadline'}
                  </span>

                  {/* Status badge */}
                  {closed ? (
                    <span className="text-red-600 text-xs font-bold bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Closed
                    </span>
                  ) : (
                    <span className="text-green-600 text-xs font-bold bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  )}

                  {/* Applicant count */}
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    {job.applications?.length || 0} Applicants
                  </span>

                  {/* Edit button — stops propagation so clicking it doesn't toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); openEdit(job); }}
                    className="text-blue-500 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition"
                    title="Edit job"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* ── Collapsible applicants panel ── */}
                {isOpen && (
                  <div className="border-t border-slate-100">
                    {expanded.loading ? (
                      <div className="px-6 py-8 text-center text-slate-400 text-sm">Loading applicants...</div>
                    ) : expanded.applicants.length === 0 ? (
                      <div className="px-6 py-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 opacity-30" />
                        No applicants yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                            <tr>
                              <th className="px-6 py-3 font-bold">#</th>
                              <th className="px-6 py-3 font-bold">Full Name</th>
                              <th className="px-6 py-3 font-bold">Email</th>
                              <th className="px-6 py-3 font-bold">Contact</th>
                              <th className="px-6 py-3 font-bold">Applied On</th>
                              <th className="px-6 py-3 font-bold">Resume</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {expanded.applicants.map((app, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-3 text-slate-400 font-medium">{i + 1}</td>
                                <td className="px-6 py-3">
                                  <p className="font-semibold text-slate-800">{app.user?.profile?.fullName || '—'}</p>
                                  <p className="text-xs text-slate-400">@{app.user?.username}</p>
                                </td>
                                <td className="px-6 py-3 text-slate-600">{app.user?.email}</td>
                                <td className="px-6 py-3 text-slate-600">{app.user?.contact || <span className="italic text-slate-300">—</span>}</td>
                                <td className="px-6 py-3 text-slate-500">
                                  {new Date(app.appliedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                                </td>
                                <td className="px-6 py-3">
                                  {app.resume ? (
                                    <a
                                      href={getSafePdfUrl(app.resume)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-800 text-xs"
                                    >
                                      <FileText className="w-4 h-4" /> Download PDF
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <span className="text-slate-300 italic text-xs">Not uploaded</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Create Form ── */
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Opportunity</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Job Title <span className="text-red-500">*</span></label>
              <input required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior React Developer" value={f.title} onChange={e => setF({ title: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Location <span className="text-red-500">*</span></label>
                <input required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Remote" value={f.location} onChange={e => setF({ location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Job Type</label>
                <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={f.type} onChange={e => setF({ type: e.target.value })}>
                  <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option>
                </select>
              </div>
            </div>

            {/* Salary Range Slider */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-blue-600" /> Salary Range (LPA)
              </label>
              <p className="text-xs text-slate-400">Drag both handles. Set both to 0 for Negotiable.</p>
              <SalaryRangeSlider
                min={f.salaryMin}
                max={f.salaryMax}
                onChange={(mn, mx) => setF({ salaryMin: mn, salaryMax: mx })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Experience</label>
                <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={f.experienceLevel} onChange={e => setF({ experienceLevel: e.target.value })}>
                  <option>Internship</option><option>Entry Level</option><option>Associate</option><option>Mid-Senior</option><option>Director</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Education</label>
                <select className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={f.educationLevel} onChange={e => setF({ educationLevel: e.target.value })}>
                  <option>Any</option><option>High School</option><option>Bachelors</option><option>Masters</option><option>PhD</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Requirements (comma separated)</label>
              <textarea className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="React, Node.js, TypeScript..." rows="2" value={f.requirements} onChange={e => setF({ requirements: e.target.value })}></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Job Description <span className="text-red-500">*</span></label>
              <textarea required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the role..." rows="4" value={f.description} onChange={e => setF({ description: e.target.value })}></textarea>
            </div>

            {/* Mandatory Deadline */}
            <div className="space-y-2 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" /> Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none text-sm bg-white"
                value={f.applicationDeadline}
                onChange={e => setF({ applicationDeadline: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-amber-600 font-medium">After this date/time, jobseekers cannot apply. You can edit this after posting.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Terms & Conditions (Optional)</label>
              <textarea className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" placeholder="List any specific terms or agreements..." rows="3" value={f.termsAndConditions} onChange={e => setF({ termsAndConditions: e.target.value })}></textarea>
            </div>

            <button type="submit" className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Post Job
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;
