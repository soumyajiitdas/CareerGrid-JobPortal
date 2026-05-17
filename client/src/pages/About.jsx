import React, { useState } from 'react';
import { Mail, Send, Code, Users, CheckCircle2 } from 'lucide-react';

const About = () => {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback({ name: '', email: '', message: '' });
    }, 3000);
  };

  const developers = [
    {
      name: "Nurful Shaikh",
      role: "Lead Developer",
      about: "Architecting scalable systems and managing core backend operations.",
      github: "#",
      linkedin: "#",
      email: "mailto:#"
    },
    {
      name: "Md. Azam",
      role: "Frontend Engineer",
      about: "Crafting beautiful, responsive, and accessible user interfaces.",
      github: "mdazam9137-ship-it",
      linkedin: "#",
      email: "mailto:#"
    },
    {
      name: "Suhana Khatun",
      role: "Backend Developer",
      about: "Building robust API endpoints and maintaining database integrity.",
      github: "#",
      linkedin: "#",
      email: "mailto:#"
    },
    {
      name: "Debojyoti Kundu",
      role: "UI/UX Designer",
      about: "Designing intuitive user flows and bringing concepts to life.",
      github: "#",
      linkedin: "#",
      email: "mailto:#"
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-12 space-y-6">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">About Smart Assistant</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Smart Student Assistant is a comprehensive platform designed to bridge the gap between talented students and top organizations. We provide powerful tools to help students build professional resumes, explore career opportunities, and connect directly with verified employers. Our mission is to make the transition from education to professional life as seamless as possible.
        </p>
      </section>

      {/* Feedback Form Section */}
      <section className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <Mail className="w-10 h-10 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900">We Value Your Feedback</h2>
          <p className="text-slate-600 mt-2">Help us improve the platform by sharing your thoughts.</p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-300">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="font-bold text-lg">Thank you for your feedback!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Your Name"
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="you@example.com"
                  value={feedback.email}
                  onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message</label>
              <textarea
                required
                rows="5"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                placeholder="What do you think about our platform?"
                value={feedback.message}
                onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-md"
            >
              <Send className="w-5 h-5" /> Send Feedback
            </button>
          </form>
        )}
      </section>

      {/* Developers Section */}
      <section className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-3 mb-12">
          <Code className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-slate-900">Meet the Developers</h2>
          <p className="text-slate-500 text-center max-w-2xl">The passionate team behind Smart Assistant, dedicated to building tools that empower students and organizations.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={`https://github.com/${dev.github}.png?size=200`} 
                    alt={dev.name} 
                    className="w-full h-full object-cover bg-slate-100"
                    onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + dev.name + '&background=random' }}
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 text-center">{dev.name}</h3>
              <p className="text-sm font-semibold text-blue-600 mb-2 text-center">{dev.role}</p>
              <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed px-2">{dev.about}</p>
              
              <div className="flex items-center justify-center gap-3 mt-auto">
                <a href={`https://github.com/${dev.github}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">GitHub</a>
                <span className="text-slate-200">•</span>
                <a href={dev.linkedin} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">LinkedIn</a>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
};

export default About;
