'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BookOpen, GraduationCap, TrendingUp, ArrowRight, Plus, X, Phone, Pencil, Trash2 } from 'lucide-react';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());
const STUDENTS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvVmlFewZ4mqrIg0t5tzx2mZiKmIXaRKXUB2N0L6AzlQXGkzzEwuzC-mXeFMObFa58/exec';
const MATERIALS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxU0zXHGva3WDb_Jd032fjYY9044K-HbGWFWq6aY96cF77WoVkkujro9dR-Y5t3wYGN/exec';
const MATH_LAB_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6Zxe3zPPomyRbNS9AuqCUHdjjxILZW7cA2KpVBKQ1GHNvqcGyJ8pDA8mLX1o8yBgF2Q/exec';

const getStudentKey = (student) => `student-${student._id || student.id || student.rollNumber}`;
const getMaterialKey = (material) => `${material.category}-${material._id || material.id || material.driveLink || `${material.grade}-${material.subject}-${material.chapterName}`}`;

const isSameStudent = (student, target) => {
  if (student._id && target._id) return String(student._id) === String(target._id);
  if (student.id && target.id) return String(student.id) === String(target.id);
  return String(student.rollNumber) === String(target.rollNumber);
};

const isSameMaterial = (material, target) => {
  if (material._id && target._id) return String(material._id) === String(target._id);
  if (material.id && target.id) return String(material.id) === String(target.id);
  if (material.driveLink && target.driveLink) return String(material.driveLink) === String(target.driveLink);
  return (
    String(material.category) === String(target.category) &&
    String(material.grade) === String(target.grade) &&
    String(material.subject) === String(target.subject) &&
    String(material.chapterName) === String(target.chapterName)
  );
};

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
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'notes', 'pyqp', 'mathlab_subs', 'mathlab'
  const [listData, setListData] = useState({ students: [], notes: [], pyqp: [] });
  const [isFetchingLists, setIsFetchingLists] = useState(true);
  const [deletingKey, setDeletingKey] = useState('');

  // Math Lab Tab States
  const [activeMathGrade, setActiveMathGrade] = useState('10');
  const [mathDifficultyFilter, setMathDifficultyFilter] = useState('All');

  // Math Lab States
  const { data: allMathSubmissions, mutate: mutateMathSubmissions } = useSWR(
    MATH_LAB_SCRIPT_URL + '?action=getAllSubmissions',
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: mathQuestionsData, isLoading: loadingMathQuestions } = useSWR(
    activeTab === 'mathlab' ? `${MATH_LAB_SCRIPT_URL}?action=getQuestions&grade=${activeMathGrade}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const mathQuestions = Array.isArray(mathQuestionsData) ? mathQuestionsData : [];

  const [isMathLabModalOpen, setIsMathLabModalOpen] = useState(false);
  const [mathLabForm, setMathLabForm] = useState({
    action: 'addQuestion', grade: '10', chapterName: '', title: '', marks: '2', description: ''
  });

  const handleMathLabFormChange = (e) => {
    setMathLabForm({ ...mathLabForm, [e.target.name]: e.target.value });
  };

  const handleMathLabUpload = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadStatus('');
    try {
      const res = await fetch(MATH_LAB_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(mathLabForm)
      });
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message);
      setUploadStatus('success');
      setTimeout(() => {
        setIsMathLabModalOpen(false);
        setUploadStatus('');
        setMathLabForm({ ...mathLabForm, title: '', description: '' });
      }, 1500);
      mutateMathSubmissions();
    } catch (err) {
      console.error(err);
      setUploadStatus(err.message || 'Unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmissionStatus = async (subId, newStatus) => {
    if (!subId) {
      alert('Error: This submission has no ID. The Google Sheet might have a trailing space in the "_id" header, preventing IDs from being saved. Please fix the header in Google Sheets.');
      return;
    }
    try {
      const payload = { action: 'updateSubmissionStatus', submissionId: subId, status: newStatus };
      await fetch(MATH_LAB_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      mutateMathSubmissions();
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

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
    fileBase64: '',
    filename: '',
    mimeType: ''
  });

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
    photoBase64: '',
    filename: '',
    mimeType: '',
  });

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

  const subjects = ['Tamil', 'English', 'Maths', 'Science', 'Social Science'];

  const { data: studentsData, isLoading: loadingStudents, mutate: mutateStudents } = useSWR(
    STUDENTS_SCRIPT_URL,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 600000 }
  );

  const { data: materialsData, isLoading: loadingMaterials, mutate: mutateMaterials } = useSWR(
    MATERIALS_SCRIPT_URL,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 600000 }
  );

  useEffect(() => {
    if (studentsData || materialsData) {
      const s = Array.isArray(studentsData) ? studentsData : [];
      const m = Array.isArray(materialsData) ? materialsData : [];
      const n = m.filter(x => x.category === 'notes');
      const p = m.filter(x => x.category === 'pyqp');

      setListData({ students: s, notes: n, pyqp: p });

      setStats(prev => ({
        ...prev,
        totalStudents: s.length,
        notesCount: n.length,
        pyqpCount: p.length
      }));
      setIsFetchingLists(false);
    }
  }, [studentsData, materialsData]);

  useEffect(() => {
    const rollNumber = localStorage.getItem('rollNumber');
    if (rollNumber !== '1234') {
      router.push('/');
    } else {
      setIsAdmin(true);
      setLoading(false);
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
      const res = await fetch(MATERIALS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(materialForm)
      });

      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message || 'Failed to upload material');

      setUploadStatus('success');

      // Update stats optimistically or re-fetch loosely
      if (materialForm.category === 'notes') {
        setStats(prev => ({ ...prev, notesCount: prev.notesCount + 1 }));
      } else if (materialForm.category === 'pyqp') {
        setStats(prev => ({ ...prev, pyqpCount: prev.pyqpCount + 1 }));
      }

      mutateMaterials();

      setTimeout(() => {
        setIsModalOpen(false);
        setUploadStatus('');
        setMaterialForm({ grade: '8', category: 'notes', subject: 'Tamil', chapterName: '', fileBase64: '', filename: '', mimeType: '' });
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
      const res = await fetch(STUDENTS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(studentForm),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        }
      });

      const data = await res.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to create student in Google Sheets');
      }

      setStudentStatus('success');

      // Optimistic state update
      setStats(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));

      mutateStudents();

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
          photoBase64: '',
          filename: '',
          mimeType: '',
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

  const handleDeleteStudent = async (student) => {
    const studentName = student.name || 'this student';
    if (!confirm(`Delete ${studentName}? This will remove the student record.`)) return;

    const key = getStudentKey(student);
    setDeletingKey(key);
    try {
      const payload = {
        action: 'deleteStudent',
        entity: 'student',
        id: student._id || student.id || student.rollNumber,
        _id: student._id,
        rollNumber: student.rollNumber,
        photoUrl: student.photoUrl,
      };

      const res = await fetch(STUDENTS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.status === 'error') {
        throw new Error(data.message || 'Failed to delete student');
      }

      setListData(prev => ({
        ...prev,
        students: prev.students.filter(item => !isSameStudent(item, student))
      }));
      setStats(prev => ({ ...prev, totalStudents: Math.max(prev.totalStudents - 1, 0) }));
      mutateStudents();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete student');
    } finally {
      setDeletingKey('');
    }
  };

  const handleDeleteMaterial = async (material) => {
    const materialType = material.category === 'pyqp' ? 'question paper' : 'note';
    const materialTitle = material.chapterName || `this ${materialType}`;
    if (!confirm(`Delete ${materialTitle}? This will remove the ${materialType} record.`)) return;

    const key = getMaterialKey(material);
    setDeletingKey(key);
    try {
      const payload = {
        action: 'deleteMaterial',
        entity: 'material',
        id: material._id || material.id || material.driveLink,
        _id: material._id,
        category: material.category,
        grade: material.grade,
        subject: material.subject,
        chapterName: material.chapterName,
        driveLink: material.driveLink,
        fileId: material.fileId,
      };

      const res = await fetch(MATERIALS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.status === 'error') {
        throw new Error(data.message || `Failed to delete ${materialType}`);
      }

      const category = material.category === 'pyqp' ? 'pyqp' : 'notes';
      setListData(prev => ({
        ...prev,
        [category]: prev[category].filter(item => !isSameMaterial(item, material))
      }));
      setStats(prev => ({
        ...prev,
        notesCount: category === 'notes' ? Math.max(prev.notesCount - 1, 0) : prev.notesCount,
        pyqpCount: category === 'pyqp' ? Math.max(prev.pyqpCount - 1, 0) : prev.pyqpCount,
      }));
      mutateMaterials();
    } catch (err) {
      console.error(err);
      alert(err.message || `Failed to delete ${materialType}`);
    } finally {
      setDeletingKey('');
    }
  };

  const handleEditStudentSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingStudent(true);
    setStudentStatus('');
    try {
      const payload = { action: 'update', ...studentForm };
      
      const res = await fetch(STUDENTS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message || 'Failed to update student');

      setStudentStatus('success');
      mutateStudents();

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/materials/${editingMaterialId}`, {
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
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-950 p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1 font-medium text-sm">Welcome back, Ismail. Here's what's happening today.</p>
          </div>


        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <StatCard icon={Users} label="Total Students" value={stats.totalStudents} trend="+12%" color="bg-blue-500" />
          <StatCard icon={BookOpen} label="Notes" value={stats.notesCount} trend="Stable" color="bg-brand" />
          <StatCard icon={GraduationCap} label="Question Papers" value={stats.pyqpCount} trend="Active" color="bg-purple-500" />
          <StatCard icon={TrendingUp} label="Graduates" value={stats.graduates} trend="+4%" color="bg-green-500" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="col-span-1 lg:col-span-2 bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6 min-h-[400px] flex flex-col">

            {/* Tabs Header */}
            <div className="flex items-center space-x-2 border-b border-gray-800 pb-4 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-2 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'students' ? 'bg-brand text-white' : 'text-gray-400 hover:bg-gray-950'}`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-2 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'notes' ? 'bg-brand text-white' : 'text-gray-400 hover:bg-gray-950'}`}
              >
                Notes
              </button>
              <button
                onClick={() => setActiveTab('pyqp')}
                className={`py-2 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'pyqp' ? 'bg-brand text-white' : 'text-gray-400 hover:bg-gray-950'}`}
              >
                Question Papers
              </button>
              <button
                onClick={() => setActiveTab('mathlab')}
                className={`py-2 px-4 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'mathlab' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-950'}`}
              >
                Math Lab
              </button>
            </div>

            {/* List Content */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">

              {isFetchingLists ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900 shadow-sm gap-4">
                      <div className="space-y-3 w-full max-w-sm animate-pulse">
                        <div className="h-5 bg-gray-700 rounded-md w-3/4"></div>
                        <div className="flex gap-3">
                          <div className="h-4 bg-gray-800 rounded-md w-1/3"></div>
                          <div className="h-4 bg-gray-800 rounded-md w-1/4"></div>
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-gray-800 rounded-lg animate-pulse hidden sm:block"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {activeTab === 'students' && (
                    listData.students.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center mt-10">No students added yet.</p>
                    ) : (
                      listData.students.map((student) => {
                        const studentKey = getStudentKey(student);

                        return (
                          <div key={studentKey} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-950/50 hover:bg-gray-900 hover:shadow-sm transition-all gap-4">
                            <div>
                              <h4 className="font-bold text-white">{student.name} <span className="text-xs ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{student.rollNumber}</span></h4>
                              <p className="text-sm text-gray-400 mt-1 flex items-center gap-3">
                                <span><Phone className="inline w-3 h-3 mr-1" />{student.phone}</span>
                                <span><GraduationCap className="inline w-3 h-3 mr-1" />Class {student.grade}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => openEditStudent(student)}
                                className="p-2 text-gray-400 hover:text-brand hover:bg-green-50 rounded-lg transition-colors"
                                aria-label={`Edit ${student.name}`}
                                title="Edit student"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student)}
                                disabled={deletingKey === studentKey}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Delete ${student.name}`}
                                title="Delete student"
                              >
                                <Trash2 className={`w-5 h-5 ${deletingKey === studentKey ? 'animate-pulse' : ''}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )
                  )}

                  {activeTab === 'notes' && (
                    listData.notes.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center mt-10">No notes added yet.</p>
                    ) : (
                      listData.notes.map((note) => {
                        const noteKey = getMaterialKey(note);

                        return (
                          <div key={noteKey} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-950/50 hover:bg-gray-900 hover:shadow-sm transition-all gap-4">
                            <div>
                              <h4 className="font-bold text-white">{note.chapterName}</h4>
                              <p className="text-sm text-gray-400 mt-1 flex items-center gap-3">
                                <span className="font-medium text-brand">{note.subject}</span>
                                <span>Class {note.grade}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => openEditMaterial(note)}
                                className="p-2 text-gray-400 hover:text-brand hover:bg-green-50 rounded-lg transition-colors"
                                aria-label={`Edit ${note.chapterName}`}
                                title="Edit note"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(note)}
                                disabled={deletingKey === noteKey}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Delete ${note.chapterName}`}
                                title="Delete note"
                              >
                                <Trash2 className={`w-5 h-5 ${deletingKey === noteKey ? 'animate-pulse' : ''}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )
                  )}

                  {activeTab === 'pyqp' && (
                    listData.pyqp.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center mt-10">No question papers added yet.</p>
                    ) : (
                      listData.pyqp.map((paper) => {
                        const paperKey = getMaterialKey(paper);

                        return (
                          <div key={paperKey} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-950/50 hover:bg-gray-900 hover:shadow-sm transition-all gap-4">
                            <div>
                              <h4 className="font-bold text-white">{paper.chapterName}</h4>
                              <p className="text-sm text-gray-400 mt-1 flex items-center gap-3">
                                <span className="font-medium text-purple-600">{paper.subject}</span>
                                <span>Class {paper.grade}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => openEditMaterial(paper)}
                                className="p-2 text-gray-400 hover:text-brand hover:bg-green-50 rounded-lg transition-colors"
                                aria-label={`Edit ${paper.chapterName}`}
                                title="Edit question paper"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(paper)}
                                disabled={deletingKey === paperKey}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Delete ${paper.chapterName}`}
                                title="Delete question paper"
                              >
                                <Trash2 className={`w-5 h-5 ${deletingKey === paperKey ? 'animate-pulse' : ''}`} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )
                  )}

                  {activeTab === 'mathlab' && (
                    <div className="space-y-4">
                      {/* Math Lab Filters */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-950/50 p-4 rounded-xl border border-gray-800">
                        <div className="flex space-x-2">
                          {['10', '11', '12'].map(grade => (
                            <button
                              key={grade}
                              onClick={() => setActiveMathGrade(grade)}
                              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeMathGrade === grade ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                            >
                              {grade}th
                            </button>
                          ))}
                        </div>
                        <div>
                          <select
                            value={mathDifficultyFilter}
                            onChange={(e) => setMathDifficultyFilter(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            <option value="All">All Difficulties</option>
                            <option value="2">Easy (2M)</option>
                            <option value="5">Medium (5M)</option>
                            <option value="10">Hard (10M)</option>
                          </select>
                        </div>
                      </div>

                      {/* Math Lab List */}
                      {loadingMathQuestions ? (
                        <p className="text-gray-400 text-sm text-center py-6">Loading questions...</p>
                      ) : (
                        mathQuestions.length === 0 ? (
                          <p className="text-gray-400 text-sm text-center mt-6">No questions found for {activeMathGrade}th Grade.</p>
                        ) : (
                          mathQuestions
                            .filter(q => mathDifficultyFilter === 'All' || String(q.marks) === mathDifficultyFilter)
                            .map((q) => {
                              const marks = parseInt(q.marks);
                              let diffColor = 'text-[#00b8a3]';
                              let diffText = 'Easy (2M)';
                              if (marks === 5) { diffColor = 'text-[#ffc01e]'; diffText = 'Medium (5M)'; }
                              if (marks >= 10) { diffColor = 'text-[#ff375f]'; diffText = 'Hard (10M)'; }

                              return (
                                <div key={q._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-950/50 hover:bg-gray-900 hover:shadow-sm transition-all gap-4">
                                  <div>
                                    <h4 className="font-bold text-white">{q.title}</h4>
                                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-3">
                                      <span className="font-medium text-gray-300">{q.chapterName}</span>
                                      <span className="text-gray-600">•</span>
                                      <span className={`font-bold ${diffColor}`}>{diffText}</span>
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                        )
                      )}

                      {!loadingMathQuestions && mathQuestions.length > 0 && mathQuestions.filter(q => mathDifficultyFilter === 'All' || String(q.marks) === mathDifficultyFilter).length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-6">No questions match the selected difficulty.</p>
                      )}
                    </div>
                  )}

                </>
              )}

            </div>
          </div>

          {/* Quick Actions Action Block */}
          <div className="col-span-1 bg-brand text-white rounded-2xl shadow-md p-6 relative overflow-hidden h-max">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-900 opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl"></div>

            <h3 className="text-lg font-bold mb-2 relative z-10">Admin Quick Actions</h3>
            <p className="text-green-50 text-sm mb-6 relative z-10">Manage database entries directly from here.</p>

            <div className="space-y-3 relative z-10">

              <button
                onClick={() => router.push('/dashboard/add-study-material')}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-green-50 text-brand transition-colors rounded-xl font-bold flex items-center justify-between group shadow-lg"
              >
                Add Study Material <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>

              <button
                onClick={() => router.push('/dashboard/add-student')}
                className="w-full py-3 px-4 bg-gray-900/20 hover:bg-gray-900/30 transition-colors rounded-xl font-semibold flex items-center justify-between group"
              >
                Add New Student <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => router.push('/dashboard/add-math-lab-qs')}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl font-semibold flex items-center justify-between group shadow-lg"
              >
                Add Math Lab Qs <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>

              <button
                onClick={() => router.push('/math-lab-admin')}
                className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 transition-colors rounded-xl font-semibold flex items-center justify-between group shadow-lg"
              >
                Manage Math Lab Subs <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Edit Student Modal */}
      {isEditStudentOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative my-8">
            <div className="p-6 bg-blue-600 flex justify-between items-center text-white">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Edit Student</h3>
                <p className="text-sm text-blue-50 mt-1">Update student details</p>
              </div>
              <button onClick={() => setIsEditStudentOpen(false)} className="hover:bg-gray-900/20 rounded-full p-1 transition-colors">
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
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Full Name</label>
                  <input type="text" name="name" value={studentForm.name} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Roll Number</label>
                  <input type="text" name="rollNumber" value={studentForm.rollNumber} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={studentForm.phone} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Class (Grade)</label>
                  <select name="grade" value={studentForm.grade} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none bg-gray-900" required>
                    <option value="6">Class 6</option><option value="7">Class 7</option><option value="8">Class 8</option><option value="9">Class 9</option><option value="10">Class 10</option><option value="11">Class 11</option><option value="12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Date of Birth</label>
                  <input type="date" name="dob" value={studentForm.dob} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">New Password (Optional)</label>
                  <input type="text" name="password" value={studentForm.password || ''} onChange={handleStudentFormChange} className="block w-full px-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Leave blank to keep old password" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Address</label>
                  <textarea name="address" value={studentForm.address} onChange={handleStudentFormChange} rows="2" className="block w-full px-3 py-3 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" required></textarea>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsEditStudentOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-600 font-semibold text-gray-200 hover:bg-gray-950 transition-colors">Cancel</button>
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
          <div className="bg-gray-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative my-8">
            <div className="p-6 bg-blue-600 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold tracking-tight">Edit Study Material</h3>
              <button onClick={() => setIsEditMaterialOpen(false)} className="hover:bg-gray-900/20 rounded-full p-1 transition-colors">
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
                  <label className="block text-sm font-semibold text-gray-200 mb-1">Grade</label>
                  <select name="grade" value={materialForm.grade} onChange={handleFormChange} className="w-full border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required>
                    <option value="8">8th Grade</option><option value="9">9th Grade</option><option value="10">10th Grade</option><option value="11">11th Grade</option><option value="12">12th Grade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-1">Category</label>
                  <select name="category" value={materialForm.category} onChange={handleFormChange} className="w-full border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required disabled>
                    <option value="notes">Hand Written Notes</option>
                    <option value="pyqp">Previous Year Question Paper</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">Subject</label>
                <select name="subject" value={materialForm.subject} onChange={handleFormChange} className="w-full border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required>
                  {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">Chapter Name / Title</label>
                <input type="text" name="chapterName" value={materialForm.chapterName} onChange={handleFormChange} placeholder="e.g. Chapter 1: Sets and Relations" className="w-full border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">Google Drive PDF Link</label>
                <input type="url" name="driveLink" value={materialForm.driveLink} onChange={handleFormChange} placeholder="https://drive.google.com/..." className="w-full border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none text-blue-600" required />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsEditMaterialOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-600 font-semibold text-gray-200 hover:bg-gray-950 transition-colors">Cancel</button>
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
    <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-800 hover:shadow-md transition-shadow group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
        <div className="order-2 sm:order-1">
          <p className="text-xs sm:text-sm font-medium text-gray-400 mb-1 truncate" title={label}>{label}</p>
          <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">{value}</h4>
        </div>
        <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${color} text-white shadow-sm transform group-hover:scale-110 transition-transform order-1 sm:order-2 w-max`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex items-center text-[10px] sm:text-sm font-medium bg-gray-950 px-2 py-1 flex-inline w-max rounded-lg">
        <span className={trend.includes('+') ? 'text-green-600' : 'text-gray-300'}>
          {trend}
        </span>
        <span className="text-gray-400 ml-1 hidden lg:inline">vs last month</span>
      </div>
    </div>
  );
}
