'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Beaker } from 'lucide-react';
import { useUpload } from '../../../context/UploadContext';

export default function AddMathLabQsPage() {
  const router = useRouter();
  const { startUpload } = useUpload();
  
  const [mathLabForm, setMathLabForm] = useState({
    action: 'addQuestion',
    grade: '10',
    chapterName: '',
    title: '',
    marks: '2',
    description: ''
  });

  const handleMathLabFormChange = (e) => {
    setMathLabForm({ ...mathLabForm, [e.target.name]: e.target.value });
  };

  const handleMathLabUpload = (e) => {
    e.preventDefault();

    startUpload({
      id: Date.now().toString(),
      title: mathLabForm.title,
      url: 'https://script.google.com/macros/s/AKfycbz6Zxe3zPPomyRbNS9AuqCUHdjjxILZW7cA2KpVBKQ1GHNvqcGyJ8pDA8mLX1o8yBgF2Q/exec',
      payload: mathLabForm,
      type: 'math-lab'
    });

    // Reset the form
    setMathLabForm(prev => ({
      ...prev,
      title: '',
      description: ''
    }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-950 p-4 md:p-8 relative">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors text-gray-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Beaker className="w-6 h-6 text-orange-500" /> Add Math Lab Question
              </h1>
              <p className="text-gray-400 mt-1 font-medium text-sm">Create an assignment question</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6 md:p-8">
          <form onSubmit={handleMathLabUpload} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Grade</label>
                <select name="grade" value={mathLabForm.grade} onChange={handleMathLabFormChange} className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow" required>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Marks</label>
                <select name="marks" value={mathLabForm.marks} onChange={handleMathLabFormChange} className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow" required>
                  <option value="2">2 Marks</option>
                  <option value="3">3 Marks</option>
                  <option value="5">5 Marks</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Chapter Name</label>
              <input type="text" name="chapterName" value={mathLabForm.chapterName} onChange={handleMathLabFormChange} placeholder="e.g. Relations and Functions" className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow placeholder:text-gray-600" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Question Title</label>
              <input type="text" name="title" value={mathLabForm.title} onChange={handleMathLabFormChange} placeholder="e.g. Assignment 1: Example 1.1" className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow placeholder:text-gray-600" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Question Description (Optional)</label>
              <textarea name="description" value={mathLabForm.description} onChange={handleMathLabFormChange} placeholder="Provide details or steps if any..." rows="4" className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow placeholder:text-gray-600"></textarea>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <button type="submit" className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Add Question Background
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
