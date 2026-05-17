import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-gray-700 leading-relaxed">
        
        <section>
          <div className="flex items-center gap-3 mb-4 text-blue-900">
            <Shield className="w-6 h-6" />
            <h2 className="text-2xl font-bold">1. Introduction</h2>
          </div>
          <p>
            Welcome to Smart Student Assistant. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4 text-blue-900">
            <FileText className="w-6 h-6" />
            <h2 className="text-2xl font-bold">2. The Data We Collect About You</h2>
          </div>
          <p className="mb-3">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong>Professional Data</strong> includes your resume, education history, work experience, and skills.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4 text-blue-900">
            <Eye className="w-6 h-6" />
            <h2 className="text-2xl font-bold">3. How We Use Your Personal Data</h2>
          </div>
          <p className="mb-3">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing job matching services).</li>
            <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4 text-blue-900">
            <Lock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">4. Data Security</h2>
          </div>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
