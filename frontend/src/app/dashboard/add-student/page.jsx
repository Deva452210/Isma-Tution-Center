'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Phone, MapPin, Hash, Calendar, BookOpen, Plus } from 'lucide-react';
import { useUpload } from '../../../context/UploadContext';

export default function AddStudentPage() {
  const router = useRouter();
  const { startUpload } = useUpload();
  
  const [studentForm, setStudentForm] = useState({
    name: '',
    rollNumber: '',
    phone: '',
    address: '',
    grade: '',
    dob: '',
    password: '',
    photoBase64: '',
    filename: '',
    mimeType: '',
  });

  const handleStudentFormChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleStudentPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setStudentForm(prev => ({
          ...prev,
          photoBase64: base64String,
          filename: file.name,
          mimeType: file.type
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setStudentForm(prev => ({
        ...prev,
        photoBase64: '',
        filename: '',
        mimeType: ''
      }));
    }
  };

  const handleCreateStudent = (e) => {
    e.preventDefault();

    startUpload({
      id: Date.now().toString(),
      title: studentForm.name,
      url: 'https://script.google.com/macros/s/AKfycbwvVmlFewZ4mqrIg0t5tzx2mZiKmIXaRKXUB2N0L6AzlQXGkzzEwuzC-mXeFMObFa58/exec',
      payload: studentForm,
      type: 'student'
    });

    // Reset the form
    setStudentForm({
      name: '',
      rollNumber: '',
      phone: '',
      address: '',
      grade: '',
      dob: '',
      password: '',
      photoBase64: '',
      filename: '',
      mimeType: '',
    });
    
    // Clear the file input visually
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-950 p-4 md:p-8 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        
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
                <User className="w-6 h-6 text-brand" /> Add New Student
              </h1>
              <p className="text-gray-400 mt-1 font-medium text-sm">Create a student account</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6 md:p-8">
          <form onSubmit={handleCreateStudent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={studentForm.name}
                    onChange={handleStudentFormChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-950 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-100 placeholder:text-gray-600"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Roll Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="rollNumber"
                    value={studentForm.rollNumber}
                    onChange={handleStudentFormChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-950 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-100 placeholder:text-gray-600"
                    placeholder="E.g. ISM2024"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={studentForm.phone}
                    onChange={handleStudentFormChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-950 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-100 placeholder:text-gray-600"
                    placeholder="E.g. 9876543210"
                    required
                  />
                </div>
              </div>

              {/* Class/Grade */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Class (Grade)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="grade"
                    value={studentForm.grade}
                    onChange={handleStudentFormChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-950 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-100"
                    required
                  >
                    <option value="" disabled>Select class</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Date of Birth</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dob"
                    value={studentForm.dob}
                    onChange={handleStudentFormChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-950 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-100 placeholder:text-gray-600"
                    required
                  />
                </div>
              </div>

              {/* Initial Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">Initial Password</label>
                <input
                  type="password"
                  name="password"
                  value={studentForm.password}
                  onChange={handleStudentFormChange}
                  className="block w-full px-4 py-3 border border-gray-700 bg-gray-950 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-100 placeholder:text-gray-600"
                  placeholder="Set initial password"
                  required
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2">Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    value={studentForm.address}
                    onChange={handleStudentFormChange}
                    rows="3"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-950 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-100 placeholder:text-gray-600"
                    placeholder="Full residential address"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-200 mb-2">Profile Photo</label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleStudentPhotoChange}
                  className="w-full border border-gray-700 bg-gray-950 text-gray-300 rounded-xl p-2.5 focus:ring-2 focus:ring-brand outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer"
                  required
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <button type="submit" className="w-full py-4 rounded-xl bg-brand text-white font-bold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-brand/20 transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Create Student Background
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
