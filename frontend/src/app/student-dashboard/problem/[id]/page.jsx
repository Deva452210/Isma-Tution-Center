'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { ArrowLeft, CheckCircle, Upload, FileText, Target, AlertCircle } from 'lucide-react';
import { useUpload } from '../../../../context/UploadContext';

const MATH_LAB_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz6Zxe3zPPomyRbNS9AuqCUHdjjxILZW7cA2KpVBKQ1GHNvqcGyJ8pDA8mLX1o8yBgF2Q/exec';
const fetcher = url => fetch(url).then(res => res.json());

export default function ProblemDetailsPage({ params }) {
  const problemId = params.id;
  
  const router = useRouter();
  const { startUpload } = useUpload();

  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  
  const [uploadFile, setUploadFile] = useState({ base64: '', name: '', type: '' });

  // 1. Fetch student info
  useEffect(() => {
    const fetchStudent = async () => {
      const rn = localStorage.getItem('rollNumber');
      if (!rn || rn === '1234') {
        router.push('/');
        return;
      }
      
      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbwvVmlFewZ4mqrIg0t5tzx2mZiKmIXaRKXUB2N0L6AzlQXGkzzEwuzC-mXeFMObFa58/exec');
        const data = await res.json();
        const found = data.find(s => String(s.rollNumber) === rn);
        if (found) {
          setStudent(found);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStudent(false);
      }
    };
    fetchStudent();
  }, [router]);

  // 2. Fetch Questions & Submissions
  const { data: questionsData, isLoading: loadingQuestions } = useSWR(
    student ? `${MATH_LAB_SCRIPT_URL}?action=getQuestions&grade=${student.grade}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { data: submissionsData, isLoading: loadingSubmissions, mutate: mutateSubmissions } = useSWR(
    student ? `${MATH_LAB_SCRIPT_URL}?action=getSubmissions&rollNumber=${student.rollNumber}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  if (loadingStudent || loadingQuestions || loadingSubmissions) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#111] p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse bg-[#1a1a1a] h-20 rounded-2xl border border-[#333]"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="animate-pulse bg-[#1a1a1a] h-64 rounded-2xl border border-[#333]"></div>
            </div>
            <div className="md:col-span-1">
              <div className="animate-pulse bg-[#1a1a1a] h-64 rounded-2xl border border-[#333]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = Array.isArray(questionsData) ? questionsData : [];
  const submissions = Array.isArray(submissionsData) ? submissionsData : [];

  const decodedId = decodeURIComponent(problemId);
  const question = questions.find(q => String(q._id) === String(problemId) || q.title === decodedId);
  const submission = submissions.find(s => String(s.questionId) === String(problemId) || String(s.questionId) === decodedId);

  if (!question) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#111] p-4 md:p-8 flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Problem Not Found</h2>
        <p className="text-gray-400 mb-6">The problem you're looking for doesn't exist or isn't assigned to your grade.</p>
        <Link href="/student-dashboard" className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const marks = parseInt(question.marks);
  let diffColor = 'text-[#00b8a3]';
  let diffText = 'Easy (2M)';
  if (marks === 5) { diffColor = 'text-[#ffc01e]'; diffText = 'Medium (5M)'; }
  if (marks >= 10) { diffColor = 'text-[#ff375f]'; diffText = 'Hard (10M)'; }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFile({
          base64: reader.result.split(',')[1],
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitSolution = (e) => {
    e.preventDefault();
    if (!uploadFile.base64) return alert('Please upload an image/pdf first');

    const payload = {
      action: 'addSubmission',
      questionId: question._id || question.title,
      rollNumber: student.rollNumber,
      fileBase64: uploadFile.base64,
      filename: uploadFile.name,
      mimeType: uploadFile.type
    };

    startUpload({
      id: Date.now().toString(),
      title: question.title,
      url: MATH_LAB_SCRIPT_URL,
      payload: payload,
      type: 'solution'
    });

    // Reset upload file immediately
    setUploadFile({ base64: '', name: '', type: '' });
    
    // Optimistically update SWR data to show pending
    mutateSubmissions((prev) => {
      const existing = Array.isArray(prev) ? prev : [];
      const tempSub = {
        questionId: question._id || question.title,
        rollNumber: student.rollNumber,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      return [tempSub, ...existing.filter(s => s.questionId !== (question._id || question.title))];
    }, false);
    
    // Go back to dashboard to see background upload toast
    router.push('/student-dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#111] p-4 md:p-8 font-sans relative">
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-[#333]">
          <Link href="/student-dashboard" className="p-2 border border-[#444] rounded-xl hover:bg-[#333] transition-colors text-gray-300">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Problem Details</h1>
            <p className="text-gray-400 mt-1 text-sm">{question.chapterName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Problem Details Card */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] shadow-lg p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-[#333] ${diffColor}`}>
                  {diffText}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#333] text-gray-300 flex items-center gap-1">
                  <Target className="w-3 h-3" /> {question.marks} Marks
                </span>
              </div>
              
              <h2 className="text-xl md:text-3xl font-black text-white mb-6 leading-tight">
                {question.title}
              </h2>
              
              <div className="bg-[#222] border border-[#333] rounded-xl p-5 text-gray-300 leading-relaxed whitespace-pre-wrap">
                {question.description || 'No additional description provided for this problem.'}
              </div>
            </div>

            {/* Submission Status */}
            {submission && (
              <div className={`rounded-2xl border p-6 flex flex-col items-center justify-center text-center ${
                submission.status === 'solved' 
                  ? 'bg-[#00b8a3]/10 border-[#00b8a3]/30' 
                  : 'bg-[#ffc01e]/10 border-[#ffc01e]/30'
              }`}>
                {submission.status === 'solved' ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-[#00b8a3] mb-3" />
                    <h3 className="text-xl font-bold text-[#00b8a3] mb-1">Solution Accepted</h3>
                    <p className="text-sm text-[#00b8a3]/80">Admin has verified your answer.</p>
                  </>
                ) : (
                  <>
                    <div className="relative mb-3">
                      <div className="w-12 h-12 border-4 border-[#ffc01e] border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-[#ffc01e] rounded-full opacity-50 animate-pulse"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#ffc01e] mb-1">Verification Pending</h3>
                    <p className="text-sm text-[#ffc01e]/80">Your solution has been submitted and is waiting for review.</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Sidebar / Upload Area */}
          <div className="md:col-span-1">
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] shadow-lg sticky top-24 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-orange-500" />
                {submission ? 'Re-submit Solution' : 'Submit Solution'}
              </h3>
              
              <form onSubmit={submitSolution} className="space-y-4">
                <div className="border-2 border-dashed border-[#444] hover:border-orange-500 bg-[#222] rounded-xl p-6 text-center transition-all cursor-pointer relative overflow-hidden group">
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    required 
                  />
                  
                  {uploadFile.name ? (
                    <div className="flex flex-col items-center justify-center h-24">
                      <FileText className="w-8 h-8 text-orange-500 mb-2" />
                      <span className="text-sm font-semibold text-gray-200 truncate max-w-[150px]">
                        {uploadFile.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-24 group-hover:scale-105 transition-transform">
                      <Upload className="w-8 h-8 text-gray-500 mb-2 group-hover:text-orange-500 transition-colors" />
                      <span className="text-xs font-semibold text-gray-400 px-2 leading-relaxed">
                        Click or drag image/pdf here
                      </span>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={!uploadFile.base64}
                  className="w-full py-3 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  <Upload className="w-4 h-4" /> Upload
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
