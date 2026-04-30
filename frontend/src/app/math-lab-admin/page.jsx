'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, User, Hash, FileText } from 'lucide-react';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json());

export default function MathLabAdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeGrade, setActiveGrade] = useState('10');
  const [expandedStudent, setExpandedStudent] = useState(null);

  const MATH_LAB_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6Zxe3zPPomyRbNS9AuqCUHdjjxILZW7cA2KpVBKQ1GHNvqcGyJ8pDA8mLX1o8yBgF2Q/exec';
  const STUDENTS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvVmlFewZ4mqrIg0t5tzx2mZiKmIXaRKXUB2N0L6AzlQXGkzzEwuzC-mXeFMObFa58/exec';

  const { data: allMathSubmissions, mutate: mutateMathSubmissions } = useSWR(
    MATH_LAB_SCRIPT_URL + '?action=getAllSubmissions',
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: studentsData, isLoading: loadingStudents } = useSWR(
    STUDENTS_SCRIPT_URL,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 600000 }
  );

  useEffect(() => {
    const rollNumber = localStorage.getItem('rollNumber');
    if (rollNumber !== '1234') {
      router.push('/');
    } else {
      setIsAdmin(true);
      setLoading(false);
    }
  }, [router]);

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

  const toggleStudentExpand = (rollNumber) => {
    if (expandedStudent === rollNumber) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(rollNumber);
    }
  };

  if (loading || loadingStudents) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const students = Array.isArray(studentsData) ? studentsData : [];
  const submissions = Array.isArray(allMathSubmissions) ? allMathSubmissions : [];

  // Filter students by grade
  const filteredStudents = students.filter(s => String(s.grade) === activeGrade);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-950 p-4 md:p-8 relative text-gray-200">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-800">
          <div>
            <button onClick={() => router.push('/dashboard')} className="flex items-center text-brand hover:text-green-400 font-bold text-sm mb-3 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </button>
            <h1 className="text-3xl font-black text-white tracking-tight">Math Lab Submissions</h1>
            <p className="text-gray-400 mt-1 font-medium text-sm">Review student solutions grouped by roll number.</p>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-gray-900 rounded-2xl shadow-sm border border-gray-800 p-6 min-h-[400px]">
          
          {/* Grade Tabs */}
          <div className="flex items-center space-x-2 border-b border-gray-800 pb-4 mb-6 overflow-x-auto">
            {['10', '11', '12'].map((grade) => (
              <button
                key={grade}
                onClick={() => { setActiveGrade(grade); setExpandedStudent(null); }}
                className={`py-2 px-6 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeGrade === grade ? 'bg-brand text-white' : 'text-gray-400 hover:bg-gray-950'}`}
              >
                {grade}th Grade
              </button>
            ))}
          </div>

          {/* Student Cards List */}
          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <p className="text-gray-400 text-center py-10">No students found in {activeGrade}th grade.</p>
            ) : (
              filteredStudents.map((student) => {
                // Get submissions for this specific student
                const studentSubmissions = submissions.filter(sub => String(sub.rollNumber) === String(student.rollNumber));
                const isExpanded = expandedStudent === student.rollNumber;
                const hasPending = studentSubmissions.some(sub => sub.status === 'pending');

                return (
                  <div key={student.rollNumber} className={`rounded-2xl border transition-colors ${isExpanded ? 'border-brand bg-gray-950' : 'border-gray-800 bg-gray-950/50 hover:bg-gray-800'}`}>
                    
                    {/* Card Header (Clickable) */}
                    <button 
                      onClick={() => toggleStudentExpand(student.rollNumber)} 
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold text-lg border border-brand/30">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{student.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                            <span className="flex items-center"><Hash className="w-3 h-3 mr-1" />{student.rollNumber}</span>
                            <span className="flex items-center"><FileText className="w-3 h-3 mr-1" />{studentSubmissions.length} Subs</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {hasPending && (
                          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold border border-orange-500/30">
                            Needs Review
                          </span>
                        )}
                        <div className="text-gray-500">
                          {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content (Submissions List) */}
                    {isExpanded && (
                      <div className="border-t border-gray-800 p-5 bg-gray-900/50 rounded-b-2xl">
                        {studentSubmissions.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">This student has not submitted any Math Lab solutions yet.</p>
                        ) : (
                          <div className="space-y-3">
                            {studentSubmissions.map((sub, idx) => (
                              <div key={sub._id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900 gap-4">
                                <div>
                                  <h4 className="font-bold text-white text-sm mb-1">Question ID: {sub.questionId}</h4>
                                  <div className="text-xs text-gray-400 flex items-center gap-3">
                                    <a href={sub.solutionUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline font-semibold">View PDF Solution</a>
                                    <span className="text-gray-600">•</span>
                                    <span>{new Date(sub.timestamp).toLocaleString()}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className={`px-2 py-0.5 rounded-full font-bold ${sub.status === 'solved' ? 'bg-green-500/20 text-green-400' : sub.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                      {sub.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleUpdateSubmissionStatus(sub._id, 'solved')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors">Mark Solved</button>
                                  <button onClick={() => handleUpdateSubmissionStatus(sub._id, 'rejected')} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">Reject</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
