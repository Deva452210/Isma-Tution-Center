'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, FolderOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useGetMaterialsQuery } from '../../../redux/api/materialsApi';

export default function GradeMaterialPage({ params }) {
  const router = useRouter();
  const gradeId = params.gradeId.replace('grade-', ''); // e.g., '8'
  
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'pyqp'
  const [activeSubject, setActiveSubject] = useState('Tamil');
  
  const subjects = ['Tamil', 'English', 'Maths', 'Science', 'Social Science'];
  
  const { data: materials = [], isLoading: loading, isFetching } = useGetMaterialsQuery({
    grade: gradeId,
    category: activeTab,
    subject: activeSubject
  });

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      
      {/* Grade Header */}
      <div className="bg-brand text-white pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/4"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/students-hub" className="inline-flex items-center text-green-100 hover:text-white font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Grades
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{gradeId}th Grade Materials</h1>
          <p className="text-lg text-green-50 font-medium">Access your comprehensive study notes and previous year questions below.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* Main Tab Switcher */}
        <div className="bg-white rounded-2xl shadow-md p-2 flex flex-col md:flex-row mb-8 border border-gray-100">
          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${activeTab === 'notes' ? 'bg-brand text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText className="w-5 h-5 mr-2" /> Hand Written Notes
          </button>
          <button 
            onClick={() => setActiveTab('pyqp')}
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${activeTab === 'pyqp' ? 'bg-brand text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FolderOpen className="w-5 h-5 mr-2" /> Previous Year Papers
          </button>
        </div>

        {/* Subject Nav Pill Selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {subjects.map(sub => (
            <button 
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all border ${activeSubject === sub ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-medium text-gray-500">Loading materials...</p>
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map(item => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-green-50 text-brand rounded-xl flex items-center justify-center mb-6">
                  {activeTab === 'notes' ? <FileText className="w-6 h-6" /> : <FolderOpen className="w-6 h-6" />}
                </div>
                
                <div className="mb-6 flex-1">
                  <span className="inline-block px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold tracking-wider uppercase mb-3">
                    {item.subject}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {item.chapterName}
                  </h3>
                </div>

                <a 
                  href={item.driveLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center py-3 px-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-brand transition-colors shadow-md group-hover:shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" /> View PDF
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 bg-white rounded-3xl border border-gray-100 border-dashed flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No materials found</h3>
            <p className="text-gray-500 max-w-md">The admin hasn't uploaded any {activeTab === 'notes' ? 'hand written notes' : 'previous year question papers'} for {activeSubject} yet. Check back soon!</p>
          </div>
        )}

      </div>
    </div>
  );
}
