import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Trash2, Save, Briefcase, GraduationCap, User, Wrench, Eye, Download, Code, Award, Camera } from 'lucide-react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { uploadToCloudinary } from '../utils/uploadImage';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState({
    fullName: '',
    profilePic: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    summary: '',
    experience: [],
    education: [],
    projects: [],
    achievements: [],
    skills: ''
  });
  
  const [activeTab, setActiveTab] = useState('personal'); // personal, experience, education, skills
  const componentRef = useRef();
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user?.profile?.resumeData) {
      setResumeData(prev => ({
        ...user.profile.resumeData,
        profilePic: user.profile.resumeData.profilePic !== undefined ? user.profile.resumeData.profilePic : (user.profile.avatar || '')
      }));
    } else if (user) {
      setResumeData(prev => ({
        ...prev,
        fullName: user.profile?.fullName || user.profile?.companyName || user.username,
        profilePic: user.profile?.avatar || ''
      }));
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const url = await uploadToCloudinary(file);
    if (url) {
      setResumeData({ ...resumeData, profilePic: url });
    } else {
      alert('Failed to upload image. Please check Cloudinary settings.');
    }
    setUploadingImage(false);
  };

  const handleRemoveImage = () => {
    setResumeData({ ...resumeData, profilePic: '' });
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: resumeData.fullName ? `${resumeData.fullName}_Resume` : 'Resume',
  });

  const handleSave = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('/api/users/profile', {
        profile: { 
          resumeData, 
          fullName: resumeData.fullName, 
          skills: typeof resumeData.skills === 'string' ? resumeData.skills.split(',').map(s => s.trim()).filter(s => s) : resumeData.skills,
          experience: resumeData.experience,
          education: resumeData.education,
          projects: resumeData.projects,
          achievements: resumeData.achievements,
          linkedin: resumeData.linkedin,
          github: resumeData.github
        }
      }, config);
      alert('Resume saved to profile!');
    } catch (err) {
      alert('Failed to save resume');
    }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { title: '', company: '', location: '', from: '', to: '', description: '' }]
    });
  };

  const removeExperience = (index) => {
    const newExp = [...resumeData.experience];
    newExp.splice(index, 1);
    setResumeData({ ...resumeData, experience: newExp });
  };

  const updateExperience = (index, field, value) => {
    const newExp = [...resumeData.experience];
    newExp[index][field] = value;
    setResumeData({ ...resumeData, experience: newExp });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { school: '', degree: '', fieldOfStudy: '', from: '', to: '' }]
    });
  };

  const removeEducation = (index) => {
    const newEdu = [...resumeData.education];
    newEdu.splice(index, 1);
    setResumeData({ ...resumeData, education: newEdu });
  };

  const updateEducation = (index, field, value) => {
    const newEdu = [...resumeData.education];
    newEdu[index][field] = value;
    setResumeData({ ...resumeData, education: newEdu });
  };

  const addProject = () => {
    setResumeData({ ...resumeData, projects: [...resumeData.projects, { title: '', link: '', description: '' }] });
  };

  const removeProject = (index) => {
    const newProj = [...resumeData.projects];
    newProj.splice(index, 1);
    setResumeData({ ...resumeData, projects: newProj });
  };

  const updateProject = (index, field, value) => {
    const newProj = [...resumeData.projects];
    newProj[index][field] = value;
    setResumeData({ ...resumeData, projects: newProj });
  };

  const addAchievement = () => {
    setResumeData({ ...resumeData, achievements: [...resumeData.achievements, { title: '', date: '', description: '' }] });
  };

  const removeAchievement = (index) => {
    const newAch = [...resumeData.achievements];
    newAch.splice(index, 1);
    setResumeData({ ...resumeData, achievements: newAch });
  };

  const updateAchievement = (index, field, value) => {
    const newAch = [...resumeData.achievements];
    newAch[index][field] = value;
    setResumeData({ ...resumeData, achievements: newAch });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-120px)] mt-4">
      {/* Editor Side */}
      <div className="w-full md:w-1/2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            Resume Builder
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint} 
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-slate-500/20 flex items-center gap-2 font-medium"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-100 px-6 pt-4 gap-2 no-scrollbar">
          <TabButton active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} icon={<User size={16} />} label="Personal" />
          <TabButton active={activeTab === 'experience'} onClick={() => setActiveTab('experience')} icon={<Briefcase size={16} />} label="Experience" />
          <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} icon={<GraduationCap size={16} />} label="Education" />
          <TabButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Code size={16} />} label="Projects" />
          <TabButton active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} icon={<Award size={16} />} label="Achievements" />
          <TabButton active={activeTab === 'skills'} onClick={() => setActiveTab('skills')} icon={<Wrench size={16} />} label="Skills" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {activeTab === 'personal' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200 flex items-center justify-center relative group">
                    {resumeData.profilePic ? (
                      <img src={resumeData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      {uploadingImage ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Camera className="w-6 h-6 text-white" />}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>
                  {resumeData.profilePic && (
                    <button 
                      onClick={handleRemoveImage} 
                      className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" /> Remove Photo
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <Input label="Full Name" value={resumeData.fullName} onChange={v => setResumeData({...resumeData, fullName: v})} placeholder="John Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" value={resumeData.phone} onChange={v => setResumeData({...resumeData, phone: v})} placeholder="+91 00000 00000" />
                <Input label="Email" value={resumeData.email} onChange={v => setResumeData({...resumeData, email: v})} placeholder="yourname@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="LinkedIn URL" value={resumeData.linkedin} onChange={v => setResumeData({...resumeData, linkedin: v})} placeholder="linkedin.com/in/yourname" />
                <Input label="GitHub URL" value={resumeData.github} onChange={v => setResumeData({...resumeData, github: v})} placeholder="github.com/yourname" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Professional Summary</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" 
                  rows="4"
                  placeholder="A brief overview of your professional background and goals..."
                  value={resumeData.summary}
                  onChange={e => setResumeData({...resumeData, summary: e.target.value})}
                ></textarea>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 relative group">
                  <button onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Job Title" value={exp.title} onChange={v => updateExperience(index, 'title', v)} placeholder="Software Engineer" />
                    <Input label="Company" value={exp.company} onChange={v => updateExperience(index, 'company', v)} placeholder="Tech Inc." />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Location" value={exp.location} onChange={v => updateExperience(index, 'location', v)} placeholder="New York, NY" />
                    <Input label="From (Year/Month)" value={exp.from} onChange={v => updateExperience(index, 'from', v)} placeholder="Jan 2020" />
                    <Input label="To (Year/Month)" value={exp.to} onChange={v => updateExperience(index, 'to', v)} placeholder="Present" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm" 
                      rows="3"
                      placeholder="Describe your responsibilities and achievements..."
                      value={exp.description}
                      onChange={e => updateExperience(index, 'description', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              ))}
              <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-600 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> Add Experience
              </button>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 relative group">
                  <button onClick={() => removeEducation(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="School / University" value={edu.school} onChange={v => updateEducation(index, 'school', v)} placeholder="State University" />
                    <Input label="Degree" value={edu.degree} onChange={v => updateEducation(index, 'degree', v)} placeholder="Bachelor of Science" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Input label="Field of Study" value={edu.fieldOfStudy} onChange={v => updateEducation(index, 'fieldOfStudy', v)} placeholder="Computer Science" />
                    <Input label="From" value={edu.from} onChange={v => updateEducation(index, 'from', v)} placeholder="2018" />
                    <Input label="To" value={edu.to} onChange={v => updateEducation(index, 'to', v)} placeholder="2022" />
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-600 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> Add Education
              </button>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {resumeData.projects.map((proj, index) => (
                <div key={index} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 relative group">
                  <button onClick={() => removeProject(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Project Title" value={proj.title} onChange={v => updateProject(index, 'title', v)} placeholder="E-commerce App" />
                    <Input label="Project Link / URL" value={proj.link} onChange={v => updateProject(index, 'link', v)} placeholder="https://github.com/my-project" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm" 
                      rows="3"
                      placeholder="Describe what you built and the technologies used..."
                      value={proj.description}
                      onChange={e => updateProject(index, 'description', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              ))}
              <button onClick={addProject} className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-600 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> Add Project
              </button>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {resumeData.achievements.map((ach, index) => (
                <div key={index} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 relative group">
                  <button onClick={() => removeAchievement(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Title / Award" value={ach.title} onChange={v => updateAchievement(index, 'title', v)} placeholder="First Place Hackathon" />
                    <Input label="Date / Year" value={ach.date} onChange={v => updateAchievement(index, 'date', v)} placeholder="2023" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-sm" 
                      rows="2"
                      placeholder="Briefly describe the achievement..."
                      value={ach.description}
                      onChange={e => updateAchievement(index, 'description', e.target.value)}
                    ></textarea>
                  </div>
                </div>
              ))}
              <button onClick={addAchievement} className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-600 rounded-2xl hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center justify-center gap-2 font-medium">
                <Plus className="w-5 h-5" /> Add Achievement
              </button>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Skills (Comma separated)</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  rows="4"
                  placeholder="JavaScript, React, Node.js, Project Management, Graphic Design..."
                  value={resumeData.skills}
                  onChange={e => setResumeData({...resumeData, skills: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Side */}
      <div className="w-full md:w-1/2 bg-slate-900 rounded-3xl shadow-xl overflow-hidden flex flex-col relative hidden md:flex">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="p-4 border-b border-slate-800 flex justify-between items-center z-10 bg-slate-900/80 backdrop-blur-sm">
          <h3 className="text-slate-300 font-medium text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" /> Live Preview
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 z-10 flex justify-center items-start">
          {/* A4 Paper Size Aspect Ratio container */}
          <div ref={componentRef} className="bg-white w-full max-w-[800px] shadow-2xl rounded-sm p-10 text-slate-800 flex flex-col gap-6 h-fit" style={{ minHeight: '1056px' }}>
            {/* Header */}
            <div className="flex items-center gap-8 border-b-2 border-slate-900 pb-6">
              {resumeData.profilePic && (
                <img src={resumeData.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-sm shrink-0" />
              )}
              <div className={resumeData.profilePic ? "flex-1" : "text-center w-full"}>
                <h1 className="text-4xl font-black uppercase tracking-widest text-slate-900">
                  {resumeData.fullName || 'Your Name'}
                </h1>
                <div className={`flex items-center gap-3 mt-3 text-slate-600 text-sm font-medium ${resumeData.profilePic ? '' : 'justify-center'}`}>
                  {resumeData.email && <span>{resumeData.email}</span>}
                  {resumeData.email && resumeData.phone && <span>•</span>}
                  {resumeData.phone && <span>{resumeData.phone}</span>}
                </div>
                <div className={`flex items-center gap-3 mt-1.5 text-slate-500 text-xs font-medium ${resumeData.profilePic ? '' : 'justify-center'}`}>
                  {resumeData.linkedin && <span>{resumeData.linkedin}</span>}
                  {resumeData.linkedin && resumeData.github && <span>|</span>}
                  {resumeData.github && <span>{resumeData.github}</span>}
                </div>
              </div>
            </div>

            {/* Summary */}
            {(resumeData.summary) && (
              <div className="w-full">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 uppercase mb-3 pb-1 w-full">Professional Summary</h3>
                <p className="text-sm leading-relaxed text-slate-700 text-justify w-full block break-words">{resumeData.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 uppercase mb-4 pb-1">Experience</h3>
                <div className="space-y-5">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-base font-bold text-slate-800">{exp.title || 'Job Title'}</h4>
                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                          {exp.from || 'Start'} - {exp.to || 'End'}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div className="text-sm font-semibold text-slate-600">{exp.company || 'Company Name'}</div>
                        <div className="text-sm text-slate-500 italic">{exp.location}</div>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 uppercase mb-4 pb-1">Education</h3>
                <div className="space-y-4">
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-bold text-slate-800">{edu.school || 'School/University Name'}</h4>
                        <div className="text-sm font-medium text-slate-700 mt-0.5">
                          {edu.degree && `${edu.degree}`} {edu.degree && edu.fieldOfStudy && 'in'} {edu.fieldOfStudy}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-slate-500 whitespace-nowrap text-right">
                        {edu.from || 'Start'} - {edu.to || 'End'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 uppercase mb-4 pb-1">Projects</h3>
                <div className="space-y-4">
                  {resumeData.projects.map((proj, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-base font-bold text-slate-800">{proj.title || 'Project Name'}</h4>
                        {proj.link && (
                          <span className="text-sm font-medium text-blue-600 truncate max-w-[200px]">
                            {proj.link}
                          </span>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed">{proj.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {resumeData.achievements && resumeData.achievements.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 uppercase mb-4 pb-1">Achievements</h3>
                <div className="space-y-3">
                  {resumeData.achievements.map((ach, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-sm font-bold text-slate-800">{ach.title || 'Achievement Title'}</h4>
                        <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                          {ach.date}
                        </span>
                      </div>
                      {ach.description && (
                        <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap leading-relaxed">{ach.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 uppercase mb-3 pb-1">Skills</h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {typeof resumeData.skills === 'string' 
                    ? resumeData.skills.split(',').map((s, i) => s.trim() && (
                        <span key={i} className="bg-slate-100 px-3 py-1 rounded-md text-sm font-semibold text-slate-700 border border-slate-200">
                          {s.trim()}
                        </span>
                      ))
                    : resumeData.skills.map((s, i) => (
                        <span key={i} className="bg-slate-100 px-3 py-1 rounded-md text-sm font-semibold text-slate-700 border border-slate-200">
                          {s}
                        </span>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm rounded-t-xl transition-all border-b-2 ${
      active 
        ? 'bg-white text-blue-600 border-blue-600' 
        : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100'
    }`}
  >
    {icon}
    {label}
  </button>
);

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input 
      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default ResumeBuilder;
