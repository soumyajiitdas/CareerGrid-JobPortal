import React from 'react';
import { Search, Globe, Zap, FileJson, ArrowRight, CheckCircle2, TrendingUp, Building, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-28 pb-22">
      {/* Hero Section - Split Layout */}
      <section className="relative pt-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              Over 10,000 active student jobs
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">dream job</span> faster.
            </h1>

            <p className="text-lg text-slate-600 max-w-lg leading-relaxed font-medium">
              Join thousands of students launching their careers. Build a professional resume, apply to top companies, and get hired.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/jobs"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                Explore Jobs <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                Create Account
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-6 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Free Forever</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /> Top Companies</div>
            </div>
          </div>

          <div className="relative hidden lg:block z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl blur-3xl opacity-50 transform rotate-6 scale-105"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Students collaborating"
              className="relative rounded-3xl shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-transform duration-500 object-cover h-[600px] w-full"
            />
            {/* Floating Stats Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-green-100 p-3 rounded-xl text-green-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Hiring Rate</p>
                <p className="text-2xl font-black text-slate-900">+48%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-5xl font-black text-blue-400">10k+</div>
            <div className="text-slate-300 font-medium">Active Jobs</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-indigo-400">500+</div>
            <div className="text-slate-300 font-medium">Partner Companies</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-emerald-400">50k+</div>
            <div className="text-slate-300 font-medium">Students Hired</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">Everything you need to succeed</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">We provide all the tools necessary to bridge the gap between education and your professional career.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileJson className="w-8 h-8 text-blue-600" />}
            title="Pro Resume Builder"
            description="Create stunning, industry-specific resumes that pass through ATS filters and impress recruiters."
            gradient="from-blue-50 to-blue-100/50"
            border="border-blue-200/50"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-indigo-600" />}
            title="Global Opportunities"
            description="Access exclusive job listings from top organizations worldwide, updated in real-time."
            gradient="from-indigo-50 to-indigo-100/50"
            border="border-indigo-200/50"
          />
          <FeatureCard
            icon={<Building className="w-8 h-8 text-emerald-600" />}
            title="Verified Companies"
            description="Every organization on our platform is manually verified to ensure high-quality opportunities."
            gradient="from-emerald-50 to-emerald-100/50"
            border="border-emerald-200/50"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
          <h2 className="text-4xl font-black">Ready to accelerate your career?</h2>
          <p className="text-blue-100 text-lg">Join thousands of students who have already found their dream jobs through our platform.</p>
          <Link
            to="/register"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl"
          >
            Get Started For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient, border }) => (
  <div className={`group relative p-8 rounded-3xl bg-gradient-to-br ${gradient} border ${border} hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
    <div className="relative z-10 space-y-6">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  </div>
);

export default Home;
