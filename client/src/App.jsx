import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CompanyDashboard from './pages/CompanyDashboard';
import ManageJobs from './pages/ManageJobs';
import CompanyApplicants from './pages/CompanyApplicants';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ResumeBuilder from './pages/ResumeBuilder';
import FindJobs from './pages/FindJobs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import About from './pages/About';
import StudentDashboard from './pages/StudentDashboard';
import Footer from './components/Footer';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<FindJobs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<DashboardSelector />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
              <Route path="/applicants" element={<CompanyApplicants />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

// Helper component to redirect to correct dashboard based on role
const DashboardSelector = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) return <Login />;
  
  if (userInfo.role === 'organisation') return <CompanyDashboard />;
  if (userInfo.role === 'admin') return <AdminDashboard />;
  if (userInfo.role === 'jobseeker') return <StudentDashboard />;
  
  window.location.href = '/profile';
  return null;
};

export default App;
