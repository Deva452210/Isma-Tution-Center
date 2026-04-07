'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, GraduationCap, TrendingUp, Settings, Bell, Search, ArrowRight, Plus, X, User, Phone, MapPin, Hash, Calendar, Lock, Pencil } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    totalStudents: 0,
    notesCount: 0,
    pyqpCount: 0,
    graduates: 850 // dummy data
  });

  // Tab & List State
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'notes', 'pyqp'
  const [listData, setListData] = useState({ students: [], notes: [], pyqp: [] });
  
  // Edit Modal State
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [materialForm, setMaterialForm] = useState({
    grade: '8', // default 8th
    category: 'notes', // notes or pyqp
    subject: 'Tamil', // default
    chapterName: '',
    driveLink: ''
  });

  // Student Modal State
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);
  const [studentStatus, setStudentStatus] = useState('');
  
  const [studentForm, setStudentForm] = useState({
    name: '',
    rollNumber: '',
    phone: '',
    address: '',
    grade: '',
    dob: '',
    password: '',
  });

  const subjects = ['Tamil', 'English', 'Maths', 'Science', 'Social Science'];

  useEffect(() => {
    const rollNumber = localStorage.getItem('rollNumber');
    if (rollNumber !== '1234') {
      router.push('/');
    } else {
      setIsAdmin(true);
      setLoading(false);

      const fetchStatsAndLists = async () => {
        try {
          // Fetch Stats
          const statsRes = await fetch('http://localhost:5000/api/stats');
          if (statsRes.ok) {
            const data = await statsRes.json();
            setStats(prev => ({
              ...prev,
              totalStudents: data.totalStudents,
              notesCount: data.notesCount,
              pyqpCount: data.pyqpCount
            }));
          }

          // Fetch Lists
          const [usersRes, notesRes, pyqpRes] = await Promise.all([
            fetch('http://localhost:5000/api/users'),
            fetch('http://localhost:5000/api/materials?category=notes'),
            fetch('http://localhost:5000/api/materials?category=pyqp')
          ]);

          let students = [], notes = [], pyqp = [];
          if (usersRes.ok) students = await usersRes.json();
          if (notesRes.ok) notes = await notesRes.json();
          if (pyqpRes.ok) pyqp = await pyqpRes.json();
          
          setListData({ students, notes, pyqp });

        } catch (err) {
          console.error('Failed to fetch data:', err);
        }
      };

      fetchStatsAndLists();
    }
  }, [router]);

  const handleFormChange = (e) => {
    setMaterialForm({ ...materialForm, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialForm)
      });

      if (!res.ok) throw new Error('Failed to upload material');
      
      setUploadStatus('success');
      
      // Update stats optimistically or re-fetch loosely
      if (materialForm.category === 'notes') {
        setStats(prev => ({ ...prev, notesCount: prev.notesCount + 1 }));
      } else if (materialForm.category === 'pyqp') {
        setStats(prev => ({ ...prev, pyqpCount: prev.pyqpCount + 1 }));
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setUploadStatus('');
        setMaterialForm({ ...materialForm, chapterName: '', driveLink: '' });
      }, 1500);

    } catch (err) {
      console.error(err);
      setUploadStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentFormChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setIsSubmittingStudent(true);
    setStudentStatus('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentForm)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create student');
      }
      
      setStudentStatus('success');
      
      // Optimistic state update
      setStats(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));

      setTimeout(() => {
        setIsStudentModalOpen(false);
        setStudentStatus('');
        setStudentForm({
          name: '',
          rollNumber: '',
          phone: '',
          address: '',
          grade: '',
          dob: '',
          password: '',
        });
      }, 1500);

    } catch (err) {
      console.error(err);
      setStudentStatus(err.message || 'error');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const openEditStudent = (student) => {
    // format date for input if possible, or just ignore for simple dummy data
    let formattedDob = student.dob;
    if (student.dob && student.dob.includes('T')) {
      formattedDob = student.dob.split('T')[0];
    }
    setStudentForm({ ...student, password: '', dob: formattedDob || student.dob }); 
    setEditingStudentId(student._id);
    setIsEditStudentOpen(true);
  };

  const openEditMaterial = (material) => {
    setMaterialForm({ ...material });
    setEditingMaterialId(material._id);
    setIsEditMaterialOpen(true);
  };

  const handleEditStudentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingStudent(true);
    setStudentStatus('');
    try {
      const payload = { ...studentForm };
      if (!payload.password) delete payload.password;
      
      const res = await fetch(`http://localhost:5000/api/users/${editingStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update student');
      
      setStudentStatus('success');
      setListData(prev => ({
        ...prev,
        students: prev.students.map(s => s._id === editingStudentId ? { ...s, ...payload } : s)
      }));

      setTimeout(() => {
        setIsEditStudentOpen(false);
        setStudentStatus('');
        setStudentForm({ name: '', rollNumber: '', phone: '', address: '', grade: '', dob: '', password: '' });
      }, 1500);
    } catch (err) {
      console.error(err);
      setStudentStatus(err.message || 'error');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  const handleEditMaterialSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadStatus('');

    try {
      const res = await fetch(`http://localhost:5000/api/materials/${editingMaterialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(materialForm)
      });

      if (!res.ok) throw new Error('Failed to update material');
      
      setUploadStatus('success');
      setListData(prev => {
        const cat = materialForm.category;
        return {
          ...prev,
          [cat]: prev[cat].map(m => m._id === editingMaterialId ? { ...m, ...materialForm } : m)
        };
      });

      setTimeout(() => {
        setIsEditMaterialOpen(false);
        setUploadStatus('');
        setMaterialForm({ grade: '8', category: 'notes', subject: 'Tamil', chapterName: '', driveLink: '' });
      }, 1500);
    } catch (err) {
      console.error(err);
      setUploadStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1 font-medium text-sm">Welcome back, Ismail. Here's what's happening today.</p>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} label="Total Students" value={stats.totalStudents} trend="+12%" color="bg-blue-500" />
          <StatCard icon={BookOpen} label="Hand Written Notes" value={stats.notesCount} trend="Stable" color="bg-brand" />
          <StatCard icon={GraduationCap} label="Previous Year Question Paper" value={stats.pyqpCount} trend="Active" color="bg-purple-500" />
          <StatCard icon={TrendingUp} label="Graduates" value={stats.graduates} trend="+4%" color="bg-green-500" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px] flex flex-col">
             
             {/* Tabs Header */}
             <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-4 overflow-x-auto">
               <button 
                onClick={() => setActiveTab('students')}
                className={`py-2 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'students' ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 Students
               </button>
               <button 
                onClick={() => setActiveTab('notes')}
                className={`py-2 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'notes' ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 Notes
               </button>
               <button 
                onClick={() => setActiveTab('pyqp')}
                className={`py-2 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'pyqp' ? 'bg-brand text-white' : 'text-gray-500 hover:bg-gray-50'}`}
               >
                 Question Papers
               </button>
             </div>
             
             {/* List Content */}
             <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
               
               {activeTab === 'students' && (
                 listData.students.length === 0 ? (
                   <p className="text-gray-500 text-sm text-center mt-10">No students added yet.</p>
                 ) : (
                   listData.students.map((student) => (
                     <div key={student._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all gap-4">
                       <div>
                         <h4 className="font-bold text-gray-900">{student.name} <span className="text-xs ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{student.rollNumber}</span></h4>
                         <p className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                           <span><Phone className="inline w-3 h-3 mr-1" />{student.phone}</span>
                           <span><GraduationCap className="inline w-3 h-3 mr-1" />Class {student.grade}</span>
                         </p>
                       </div>
                       <button onClick={() => openEditStudent(student)} className="p-2 text-gray-400 hover:text-brand hover:bg-green-50 rounded-lg transition-colors flex-shrink-0">
                         <Pencil className="w-5 h-5" />
                       </button>
                     </div>
                   ))
                 )
               )}

               {activeTab === 'notes' && (
                 listData.notes.length === 0 ? (
                   <p className="text-gray-500 text-sm text-center mt-10">No notes added yet.</p>
                 ) : (
                   listData.notes.map((note) => (
                     <div key={note._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all gap-4">
                       <div>
                         <h4 className="font-bold text-gray-900">{note.chapterName}</h4>
                         <p className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                           <span className="font-medium text-brand">{note.subject}</span>
                           <span>Class {note.grade}</span>
                         </p>
                       </div>
                       <button onClick={() => openEditMaterial(note)} className="p-2 text-gray-400 hover:text-brand hover:bg-green-50 rounded-lg transition-colors flex-shrink-0">
                         <Pencil className="w-5 h-5" />
                       </button>
                     </div>
                   ))
                 )
               )}

               {activeTab === 'pyqp' && (
                 listData.pyqp.length === 0 ? (
                   <p className="text-gray-500 text-sm text-center mt-10">No question papers added yet.</p>
                 ) : (
                   listData.pyqp.map((paper) => (
                     <div key={paper._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all gap-4">
                       <div>
                         <h4 className="font-bold text-gray-900">{paper.chapterName}</h4>
                         <p className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                           <span className="font-medium text-purple-600">{paper.subject}</span>
                           <span>Class {paper.grade}</span>
                         </p>
                       </div>
                       <button onClick={() => openEditMaterial(paper)} className="p-2 text-gray-400 hover:text-brand hover:bg-green-50 rounded-lg transition-colors flex-shrink-0">
                         <Pencil className="w-5 h-5" />
                       </button>
                     </div>
                   ))
                 )
               )}

             </div>
          </div>
          
          {/* Quick Actions Action Block */}
          <div className="col-span-1 bg-brand text-white rounded-2xl shadow-md p-6 relative overflow-hidden h-max">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>
            
            <h3 className="text-lg font-bold mb-2 relative z-10">Admin Quick Actions</h3>
            <p className="text-green-50 text-sm mb-6 relative z-10">Manage database entries directly from here.</p>
            
            <div className="space-y-3 relative z-10">
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 px-4 bg-white hover:bg-green-50 text-brand transition-colors rounded-xl font-bold flex items-center justify-between group shadow-lg"
              >
                Add Study Material <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
              
              <button 
                onClick={() => setIsStudentModalOpen(true)}
                className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 transition-colors rounded-xl font-semibold flex items-center justify-between group"
              >
                Add New Student <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Material Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative my-8">
            <div className="p-6 bg-brand flex justify-between items-center text-white">
              <h3 className="text-xl font-bold tracking-tight">Upload Study Material</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-5">
              {uploadStatus === 'success' && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                  Material uploaded successfully!
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
                  Failed to upload. Please try again.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
                  <select name="grade" value={materialForm.grade} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none" required>
                    <option value="8">8th Grade</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                    <option value="11">11th Grade</option>
                    <option value="12">12th Grade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select name="category" value={materialForm.category} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none" required>
                    <option value="notes">Hand Written Notes</option>
                    <option value="pyqp">Previous Year Question Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <select name="subject" value={materialForm.subject} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none" required>
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Chapter Name / Title</label>
                <input type="text" name="chapterName" value={materialForm.chapterName} onChange={handleFormChange} placeholder="e.g. Chapter 1: Sets and Relations" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Google Drive PDF Link</label>
                <input type="url" name="driveLink" value={materialForm.driveLink} onChange={handleFormChange} placeholder="https://drive.google.com/..." className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-brand outline-none text-blue-600" required />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-brand text-white font-bold hover:bg-green-800 transition-colors disabled:opacity-70 flex items-center justify-center">
                  {isSubmitting ? 'Uploading...' : 'Upload Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Add Student Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative my-8">
            <div className="p-6 bg-brand flex justify-between items-center text-white">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Create Student Account</h3>
                <p className="text-sm text-green-50 mt-1">Admin student creation portal</p>
              </div>
              <button onClick={() => setIsStudentModalOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-8 space-y-6">
              {studentStatus === 'success' && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                  Student created successfully!
                </div>
              )}
              {studentStatus && studentStatus !== 'success' && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
                  {studentStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={studentForm.name}
                      onChange={handleStudentFormChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-800"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="rollNumber"
                      value={studentForm.rollNumber}
                      onChange={handleStudentFormChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-800"
                      placeholder="E.g. ISM2024"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={studentForm.phone}
                      onChange={handleStudentFormChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-800"
                      placeholder="E.g. 9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Class/Grade */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class (Grade)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="grade"
                      value={studentForm.grade}
                      onChange={handleStudentFormChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-800 bg-white"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      value={studentForm.dob}
                      onChange={handleStudentFormChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="password"
                      value={studentForm.password}
                      onChange={handleStudentFormChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-800"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="address"
                      value={studentForm.address}
                      onChange={handleStudentFormChange}
                      rows="2"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-shadow outline-none text-gray-800"
                      placeholder="Enter full residential address"
                      required
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsStudentModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingStudent} className="flex-1 py-3 rounded-xl bg-brand text-white font-bold hover:bg-green-800 transition-colors disabled:opacity-70 flex items-center justify-center">
                  {isSubmittingStudent ? 'Creating...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditStudentOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative my-8">
            <div className="p-6 bg-blue-600 flex justify-between items-center text-white">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Edit Student</h3>
                <p className="text-sm text-blue-50 mt-1">Update student details</p>
              </div>
              <button onClick={() => setIsEditStudentOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditStudentSubmit} className="p-8 space-y-6">
              {studentStatus === 'success' && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                  Student updated successfully!
                </div>
              )}
              {studentStatus && studentStatus !== 'success' && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
                  {studentStatus}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="name" value={studentForm.name} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Roll Number</label>
                  <input type="text" name="rollNumber" value={studentForm.rollNumber} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={studentForm.phone} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Class (Grade)</label>
                  <select name="grade" value={studentForm.grade} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-white" required>
                    <option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input type="date" name="dob" value={studentForm.dob} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password (Optional)</label>
                  <input type="text" name="password" value={studentForm.password || ''} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Leave blank to keep old password" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea name="address" value={studentForm.address} onChange={handleStudentFormChange} rows="2" className="block w-full px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required></textarea>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditStudentOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmittingStudent} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-70">
                  {isSubmittingStudent ? 'Updating...' : 'Update Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Material Modal */}
      {isEditMaterialOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative my-8">
            <div className="p-6 bg-blue-600 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold tracking-tight">Edit Study Material</h3>
              <button onClick={() => setIsEditMaterialOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditMaterialSubmit} className="p-6 space-y-5">
              {uploadStatus === 'success' && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
                  Material updated successfully!
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
                  Failed to update. Please try again.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
                  <select name="grade" value={materialForm.grade} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required>
                    <option value="8">8th Grade</option><option value="9">9th Grade</option><option value="10">10th Grade</option><option value="11">11th Grade</option><option value="12">12th Grade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select name="category" value={materialForm.category} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required disabled>
                    <option value="notes">Hand Written Notes</option>
                    <option value="pyqp">Previous Year Question Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <select name="subject" value={materialForm.subject} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required>
                  {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Chapter Name / Title</label>
                <input type="text" name="chapterName" value={materialForm.chapterName} onChange={handleFormChange} placeholder="e.g. Chapter 1: Sets and Relations" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Google Drive PDF Link</label>
                <input type="url" name="driveLink" value={materialForm.driveLink} onChange={handleFormChange} placeholder="https://drive.google.com/..." className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none text-blue-600" required />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditMaterialOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-70">
                  {isSubmitting ? 'Updating...' : 'Update Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Simple Stat Card subcomponent
function StatCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h4 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h4>
        </div>
        <div className={`p-3 rounded-2xl ${color} text-white shadow-sm transform group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm font-medium bg-gray-50 px-2 py-1 flex-inline w-max rounded-lg">
        <span className={trend.includes('+') ? 'text-green-600' : 'text-gray-600'}>
          {trend}
        </span>
        <span className="text-gray-400 ml-1">vs last month</span>
      </div>
    </div>
  );
}
