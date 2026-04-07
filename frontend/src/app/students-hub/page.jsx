import React from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

const grades = [
  { level: '8th', desc: 'Foundation & Basics', color: 'bg-blue-500', shadow: 'shadow-blue-200' },
  { level: '9th', desc: 'Core Concepts', color: 'bg-purple-500', shadow: 'shadow-purple-200' },
  { level: '10th', desc: 'Board Exam Prep', color: 'bg-rose-500', shadow: 'shadow-rose-200' },
  { level: '11th', desc: 'Advanced Stream', color: 'bg-amber-500', shadow: 'shadow-amber-200' },
  { level: '12th', desc: 'Finals & Entrance', color: 'bg-brand', shadow: 'shadow-green-200' },
];

const StudentsHubPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen bg-gray-50/50">
      
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Student's Hub</h1>
        <p className="text-lg text-gray-500 font-medium">Select your grade below to access your class materials, assignments, and announcements.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {grades.map((grade, index) => (
          <Link href={`/students-hub/grade-${grade.level.replace('th', '')}`} key={index} className="group">
            <div className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-md ${grade.shadow} hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2 relative overflow-hidden flex flex-col h-full`}>
              
              {/* Decorative Background Blob */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${grade.color} opacity-10 group-hover:scale-150 transition-transform duration-500`}></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${grade.color} text-white flex items-center justify-center shadow-inner`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                </div>
              </div>

              <div className="mt-auto relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{grade.level} Grade</h3>
                <p className="text-sm font-medium text-gray-500">{grade.desc}</p>
              </div>

            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};

export default StudentsHubPage;
