import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "How do I create a resume?",
    answer: "You can create a resume by registering as a 'Jobseeker', logging in, and navigating to the 'Resume Builder' from the top menu. Fill in your personal, experience, education, and project details, then click 'Save' and you can download it as a PDF."
  },
  {
    question: "Is Smart Student Assistant free to use?",
    answer: "Yes! Our core features for students, including the Resume Builder and Job Search, are completely free to use."
  },
  {
    question: "How do I apply for jobs?",
    answer: "Once you have created your profile and filled out your resume, you can browse the 'Find Jobs' page. When you find a job you like, click on it and use the 'Apply' button to submit your profile directly to the employer."
  },
  {
    question: "I am an employer. How do I post a job?",
    answer: "Register an account and select 'Organisation' as your account type. Once our admins approve your account, you can log into the Company Dashboard to post and manage job listings."
  },
  {
    question: "Why is my organisation account pending?",
    answer: "To ensure the quality of job postings and protect our students, all new organisation accounts must be manually reviewed and approved by our administrative team. This usually takes 1-2 business days."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 min-h-[70vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">Find answers to common questions about using our platform.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-blue-300"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-gray-900">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 animate-in slide-in-from-top-2 duration-200">
                <p className="pt-2 border-t border-gray-100">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Still have questions?</h3>
        <p className="text-blue-700 mb-6">We're here to help. Send us an email and we'll get back to you shortly.</p>
        <a href="mailto:support@smartassistant.com" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQ;
