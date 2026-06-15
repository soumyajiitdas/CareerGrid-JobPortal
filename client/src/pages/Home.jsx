import React from 'react';
import { Search, Globe, Zap, FileJson, ArrowRight, CheckCircle2, TrendingUp, Building, Users, ShieldCheck, Briefcase, Star } from 'lucide-react';
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
              Over 20+ Active Opportunities
            </div>

            <h1 className="text-6xl lg:text-[5.5rem] font-black tracking-tight text-slate-900 leading-[1.05]">
              Accelerate your <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                professional journey
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed font-medium">
              Career Grid connects ambitious talent with world-class organizations. Build an ATS-friendly resume, apply seamlessly, and get hired faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/jobs"
                className="bg-blue-700 hover:bg-blue-900 text-white px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2"
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

            <div className="flex items-center gap-8 pt-4 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-100 p-1.5 rounded-full"><CheckCircle2 className="w-4 h-4 text-emerald-600" /></div>
                Free for Jobseekers
              </div>
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-100 p-1.5 rounded-full"><ShieldCheck className="w-4 h-4 text-blue-600" /></div>
                Verified Companies
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl blur-3xl opacity-50 transform rotate-6 scale-105"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Students collaborating"
              className="relative rounded-3xl shadow-2xl border-4 border-white transform hover:-translate-y-2 transition-transform duration-500 object-cover h-[600px] w-full"
            />
            {/* Floating Element 1 */}
            <div className="absolute top-10 -left-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 animate-[float_4s_ease-in-out_infinite]">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Jobs</p>
                <p className="text-xl font-black text-slate-900">+20 this week</p>
              </div>
            </div>

            {/* Floating Element 2 */}
            <div className="absolute bottom-20 -right-10 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 flex items-center gap-4 animate-[float_5s_ease-in-out_infinite_reverse]">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">60+ Hired</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
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
            <div className="text-5xl font-black text-blue-400">20+</div>
            <div className="text-slate-300 font-medium">Active Jobs</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-indigo-400">25+</div>
            <div className="text-slate-300 font-medium">Partner Companies</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-emerald-400">60+</div>
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

      {/* How it Works Section */}
      <section className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="text-center mb-16 space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">How Career Grid Works</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Your journey to a dream job simplified in three easy steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black shadow-sm">1</div>
            <h3 className="text-xl font-bold text-slate-900">Create Profile</h3>
            <p className="text-slate-500 font-medium px-4">Sign up and use our AI-powered resume builder to highlight your skills and education.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-black shadow-sm">2</div>
            <h3 className="text-xl font-bold text-slate-900">Discover Jobs</h3>
            <p className="text-slate-500 font-medium px-4">Browse verified opportunities from top organizations tailored to your profile.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-black shadow-sm">3</div>
            <h3 className="text-xl font-bold text-slate-900">Get Hired</h3>
            <p className="text-slate-500 font-medium px-4">Apply with one click, track your applications, and land your dream role.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="scroll-mt-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900">Success Stories</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Hear from students who found their start through Career Grid.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow relative">
            <div className="text-yellow-400 flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-lg text-slate-700 italic font-medium mb-6">"The resume builder is fantastic. It helped me highlight my projects, and I got hired as a Junior Developer within 2 weeks of applying!"</p>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?img=32" alt="Student" className="w-12 h-12 rounded-full shadow-md" />
              <div>
                <p className="font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-sm text-slate-500">Software Engineer at TechCorp</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow relative">
            <div className="text-yellow-400 flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-lg text-slate-700 italic font-medium mb-6">"I loved how easy it was to filter internships. The platform connected me directly with the hiring managers, skipping the noise."</p>
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/150?img=11" alt="Student" className="w-12 h-12 rounded-full shadow-md" />
              <div>
                <p className="font-bold text-slate-900">David Chen</p>
                <p className="text-sm text-slate-500">Marketing Intern at GlobalBrand</p>
              </div>
            </div>
          </div>
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
