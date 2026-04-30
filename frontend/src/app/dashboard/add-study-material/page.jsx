'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Upload } from 'lucide-react';
import { useUpload } from '../../../context/UploadContext';

export default function AddStudyMaterialPage() {
  const router = useRouter();
  const { startUpload } = useUpload();
  
  const [materialForm, setMaterialForm] = useState({
    grade: '8', // default 8th
    category: 'notes', // notes or pyqp
    subject: 'Tamil', // default
    chapterName: '',
    fileBase64: '',
    filename: '',
    mimeType: ''
  });

  const subjects = ['Tamil', 'English', 'Maths', 'Science', 'Social Science'];

  const handleFormChange = (e) => {
    setMaterialForm({ ...materialForm, [e.target.name]: e.target.value });
  };

  const handleMaterialFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setMaterialForm(prev => ({
          ...prev,
          fileBase64: base64String,
          filename: file.name,
          mimeType: file.type
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setMaterialForm(prev => ({
        ...prev,
        fileBase64: '',
        filename: '',
        mimeType: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!materialForm.fileBase64) {
      alert("Please select a file to upload.");
      return;
    }

    // Start background upload
    startUpload({
      id: Date.now().toString(),
      title: materialForm.chapterName,
      url: 'https://script.google.com/macros/s/AKfycbxU0zXHGva3WDb_Jd032fjYY9044K-HbGWFWq6aY96cF77WoVkkujro9dR-Y5t3wYGN/exec',
      payload: materialForm,
      type: 'material'
    });

    // Reset form to allow multiple back-to-back uploads
    setMaterialForm({
      grade: '8',
      category: 'notes',
      subject: 'Tamil',
      chapterName: '',
      fileBase64: '',
      filename: '',
      mimeType: ''
    });
    
    // Clear the file input visually
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
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
                <BookOpen className="w-6 h-6 text-brand" /> Add Study Material
              </h1>
              <p className="text-gray-400 mt-1 font-medium text-sm">Upload notes and question papers</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Grade</label>
                <select name="grade" value={materialForm.grade} onChange={handleFormChange} className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow" required>
                  <option value="8">8th Grade</option>
                  <option value="9">9th Grade</option>
                  <option value="10">10th Grade</option>
                  <option value="11">11th Grade</option>
                  <option value="12">12th Grade</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Category</label>
                <select name="category" value={materialForm.category} onChange={handleFormChange} className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow" required>
                  <option value="notes">Hand Written Notes</option>
                  <option value="pyqp">Previous Year Question Paper</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Subject</label>
              <select name="subject" value={materialForm.subject} onChange={handleFormChange} className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow" required>
                {subjects.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Chapter Name / Title</label>
              <input type="text" name="chapterName" value={materialForm.chapterName} onChange={handleFormChange} placeholder="e.g. Chapter 1: Sets and Relations" className="w-full border border-gray-700 bg-gray-950 text-white rounded-xl p-3.5 focus:ring-2 focus:ring-brand outline-none transition-shadow placeholder:text-gray-600" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">Upload Document (PDF, Word)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Upload className="h-5 w-5 text-gray-400 group-hover:text-brand transition-colors" />
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleMaterialFileChange}
                  className="w-full border border-gray-700 bg-gray-950 text-gray-300 rounded-xl pl-10 p-2.5 focus:ring-2 focus:ring-brand outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <button type="submit" className="w-full py-4 rounded-xl bg-brand text-white font-bold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-brand/20 transition-all flex items-center justify-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Material Background
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
