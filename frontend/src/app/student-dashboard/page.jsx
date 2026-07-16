"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  BookOpen,
  MapPin,
  Phone,
  Calendar,
  Hash,
  CheckCircle,
  Code,
  Award,
  Target,
  Flame,
  ChevronRight,
  Upload,
} from "lucide-react";
import useSWR from "swr";

// === CONFIGURATION ===
// Provide your updated Student Apps Script URL here (for editing profile)
const STUDENT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwvVmlFewZ4mqrIg0t5tzx2mZiKmIXaRKXUB2N0L6AzlQXGkzzEwuzC-mXeFMObFa58/exec";

// Provide your NEW Math Lab Apps Script URL here
const MATH_LAB_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz6Zxe3zPPomyRbNS9AuqCUHdjjxILZW7cA2KpVBKQ1GHNvqcGyJ8pDA8mLX1o8yBgF2Q/exec";

const fetcher = (url) => fetch(url).then((res) => res.json());

// Helper to convert Google Drive download URLs to reliable image sources
const getImageUrl = (url) => {
  if (!url) return null;
  const match = url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w200-h200`;
  }
  return url;
};

export default function StudentDashboardPage() {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'mathlab'

  // Math Lab states
  const [mathLabChapter, setMathLabChapter] = useState("Chapter 1");

  // Check auth
  useEffect(() => {
    const rn = localStorage.getItem("rollNumber");
    if (!rn) {
      router.push("/login");
    } else {
      setRollNumber(rn);
    }
  }, [router]);

  // 1. Fetch Student Data
  const { data: studentsData, isLoading: loadingStudents } = useSWR(
    STUDENT_SCRIPT_URL,
    fetcher,
    { revalidateOnFocus: false },
  );

  const student = useMemo(() => {
    if (!studentsData || !Array.isArray(studentsData)) return null;
    return studentsData.find(
      (s) => String(s.rollNumber) === String(rollNumber),
    );
  }, [studentsData, rollNumber]);

  const isEligibleForMathLab =
    student && ["10", "11", "12"].includes(String(student.grade));

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editPhotoFile, setEditPhotoFile] = useState({
    base64: "",
    name: "",
    type: "",
    preview: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    if (student) {
      let formattedDob = student.dob;
      if (student.dob && student.dob.includes("T")) {
        formattedDob = student.dob.split("T")[0];
      }
      setEditForm({ ...student, dob: formattedDob || student.dob });
    }
  }, [student]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPhotoFile({
          base64: reader.result.split(",")[1],
          name: file.name,
          type: file.type,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateStatus("");
    try {
      const payload = {
        ...editForm,
        action: "update",
        ...(editPhotoFile.base64 && {
          photoBase64: editPhotoFile.base64,
          filename: editPhotoFile.name,
          mimeType: editPhotoFile.type,
        }),
      };
      const res = await fetch(STUDENT_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status === "error") throw new Error(data.message);

      setUpdateStatus("success");
      setTimeout(() => {
        setIsEditing(false);
        setUpdateStatus("");
      }, 1500);
      // Ideally we'd mutate() here, but skipping for dummy optimistic UI
    } catch (err) {
      console.error(err);
      setUpdateStatus("error");
    } finally {
      setIsUpdating(false);
    }
  };

  // 2. Fetch Math Lab Data
  const { data: questionsData } = useSWR(
    student && isEligibleForMathLab
      ? `${MATH_LAB_SCRIPT_URL}?action=getQuestions&grade=${student.grade}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const { data: submissionsData } = useSWR(
    rollNumber && isEligibleForMathLab
      ? `${MATH_LAB_SCRIPT_URL}?action=getSubmissions&rollNumber=${rollNumber}`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const questions = Array.isArray(questionsData) ? questionsData : [];
  const submissions = Array.isArray(submissionsData) ? submissionsData : [];

  // Compute stats
  const getQ = (subId) =>
    questions.find(
      (q) => String(q._id) === String(subId) || q.title === String(subId),
    );
  const solvedCount = submissions.filter(
    (s) => s.status === "solved" && getQ(s.questionId),
  ).length;
  const easySolved = submissions.filter(
    (s) => s.status === "solved" && getQ(s.questionId)?.marks == 2,
  ).length;
  const medSolved = submissions.filter(
    (s) => s.status === "solved" && getQ(s.questionId)?.marks == 5,
  ).length;
  const hardSolved = submissions.filter(
    (s) => s.status === "solved" && getQ(s.questionId)?.marks == 10,
  ).length;

  const easyTotal = questions.filter((q) => q.marks == 2).length;
  const medTotal = questions.filter((q) => q.marks == 5).length;
  const hardTotal = questions.filter((q) => q.marks == 10).length;

  const totalQuestions = questions.length || 1; // avoid / 0
  const solvePercentage = Math.round((solvedCount / totalQuestions) * 100);

  // === HEATMAP LOGIC ===
  const today = new Date();
  const activityMap = {};
  submissions.forEach((sub) => {
    if (sub.timestamp && sub.status === "solved") {
      const d = new Date(sub.timestamp);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
    }
  });

  let currentStreak = 0;
  let maxStreak = 0;
  let activeDays = Object.keys(activityMap).length;
  let totalSubmissions = 0;
  Object.values(activityMap).forEach((v) => (totalSubmissions += v));

  let checkDate = new Date();
  let checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;

  if (activityMap[checkDateStr]) {
    while (activityMap[checkDateStr]) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
    }
  } else {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
    if (activityMap[yesterdayStr]) {
      checkDate = yesterday;
      checkDateStr = yesterdayStr;
      while (activityMap[checkDateStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
        checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, "0")}-${String(checkDate.getDate()).padStart(2, "0")}`;
      }
    }
  }

  let tempStreak = 0;
  const sortedDates = Object.keys(activityMap).sort();
  if (sortedDates.length > 0) {
    let prevDate = new Date(sortedDates[0]);
    tempStreak = 1;
    maxStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      let currDate = new Date(sortedDates[i]);
      let diffTime = Math.abs(currDate - prevDate);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
      prevDate = currDate;
    }
  }

  const numWeeks = 52;
  const todayDayOfWeek = today.getDay();
  const daysToRender = (numWeeks - 1) * 7 + (todayDayOfWeek + 1);
  const heatmapStartDate = new Date(today);
  heatmapStartDate.setDate(today.getDate() - daysToRender + 1);

  const weeks = [];
  const monthLabels = [];
  let currDate = new Date(heatmapStartDate);
  let lastMonth = -1;

  for (let w = 0; w < numWeeks; w++) {
    const week = [];
    let weekHasFirstDayOfMonth = false;
    let monthName = "";

    for (let d = 0; d < 7; d++) {
      if (w === numWeeks - 1 && d > todayDayOfWeek) {
        week.push(null);
      } else {
        if (currDate.getMonth() !== lastMonth) {
          weekHasFirstDayOfMonth = true;
          monthName = currDate.toLocaleString("default", { month: "short" });
          lastMonth = currDate.getMonth();
        }

        const dateStr = `${currDate.getFullYear()}-${String(currDate.getMonth() + 1).padStart(2, "0")}-${String(currDate.getDate()).padStart(2, "0")}`;
        week.push({
          date: new Date(currDate),
          dateStr: dateStr,
          count: activityMap[dateStr] || 0,
        });
        currDate.setDate(currDate.getDate() + 1);
      }
    }
    weeks.push(week);
    if (weekHasFirstDayOfMonth) {
      monthLabels.push({ weekIndex: w, name: monthName });
    }
  }
  // === END HEATMAP LOGIC ===

  // Group chapters
  const chapters = [...new Set(questions.map((q) => q.chapterName))];
  if (chapters.length > 0 && !chapters.includes(mathLabChapter)) {
    // If current selected chapter has no questions, select first
    // setMathLabChapter(chapters[0]); // avoiding render loop, handle safely below
  }
  const displayChapter = chapters.includes(mathLabChapter)
    ? mathLabChapter
    : chapters[0] || "Chapter 1";

  if (loadingStudents || !student) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] p-4 md:p-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#1a1a1a] p-6 rounded-3xl border border-[#333]">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-[#333]"></div>
              <div className="space-y-3">
                <div className="h-6 w-48 bg-[#333] rounded"></div>
                <div className="h-4 w-32 bg-[#333] rounded"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-6">
              <div className="h-64 bg-[#1a1a1a] rounded-3xl border border-[#333] animate-pulse"></div>
            </div>
            <div className="md:col-span-8">
              <div className="h-96 bg-[#1a1a1a] rounded-3xl border border-[#333] animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[calc(100vh-80px)] bg-[#0a0a0a] transition-colors duration-500`}
    >
      {/* Dashboard Top Nav */}
      <div
        className={`bg-[#1a1a1a] border-[#333] text-gray-300 border-b px-4 md:px-8 py-4 sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {student.photoUrl ? (
              <img
                src={getImageUrl(student.photoUrl)}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#333]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://ui-avatars.com/api/?name=" +
                    student.name +
                    "&background=random";
                }}
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${activeTab === "mathlab" ? "bg-orange-500 text-white" : "bg-brand text-white"}`}
              >
                {student.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className={`text-xl font-bold text-white`}>{student.name}</h2>
              <p className={`text-sm text-gray-400`}>
                Class {student.grade} • {student.rollNumber}
              </p>
            </div>
          </div>

          <div className="flex bg-[#282828] p-1 rounded-xl w-max border border-[#333]">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === "profile" ? "bg-[#3d3d3d] text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
            >
              My Profile
            </button>
            {isEligibleForMathLab && (
              <button
                onClick={() => setActiveTab("mathlab")}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === "mathlab" ? "bg-[#3d3d3d] text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
              >
                <Code className="w-4 h-4" /> Math Lab
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* ================= PROFILE TAB ================= */}
        {activeTab === "profile" && (
          <div className="max-w-3xl mx-auto bg-[#1a1a1a] rounded-2xl shadow-lg border border-[#333] p-6 md:p-8">
            <div className="flex justify-between items-center mb-8 border-b border-[#333] pb-4">
              <h3 className="text-2xl font-bold text-white">
                Personal Details
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-[#282828] hover:bg-[#333] text-gray-300 font-semibold rounded-xl transition-colors border border-[#444]"
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {updateStatus === "success" && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg">
                    Profile updated successfully!
                  </div>
                )}
                {updateStatus === "error" && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                    Failed to update. Check console.
                  </div>
                )}

                {/* Editable Avatar */}
                <div className="flex flex-col items-center justify-center mb-8">
                  <div className="relative group cursor-pointer">
                    {editPhotoFile.preview || student.photoUrl ? (
                      <img
                        src={
                          editPhotoFile.preview || getImageUrl(student.photoUrl)
                        }
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#333]"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://ui-avatars.com/api/?name=" +
                            student.name +
                            "&background=random";
                        }}
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full flex items-center justify-center font-bold text-4xl bg-brand text-white border-4 border-[#333]">
                        {student.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-8 h-8 text-white mb-1" />
                      <span className="text-white text-xs font-bold">
                        Change
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditPhotoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-200 rounded-xl p-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-200 rounded-xl p-3"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={editForm.address || ""}
                      onChange={handleEditChange}
                      className="w-full border border-gray-200 rounded-xl p-3"
                      rows="2"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={editForm.dob || ""}
                      onChange={handleEditChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#282828] border border-[#333] focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-gray-200"
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-3 bg-brand text-white font-bold rounded-xl hover:bg-green-800 disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* View Avatar */}
                <div className="flex flex-col items-center justify-center mb-8 border-b border-[#333] pb-8">
                  {student.photoUrl ? (
                    <img
                      src={getImageUrl(student.photoUrl)}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#333] shadow-lg mb-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://ui-avatars.com/api/?name=" +
                          student.name +
                          "&background=random";
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center font-bold text-4xl bg-brand text-white border-4 border-[#333] shadow-lg mb-4">
                      {student.name.charAt(0)}
                    </div>
                  )}
                  <h4 className="text-2xl font-bold text-white">
                    {student.name}
                  </h4>
                  <p className="text-gray-400">
                    Class {student.grade} • {student.rollNumber}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DetailItem
                    icon={<User />}
                    label="Full Name"
                    value={student.name}
                  />
                  <DetailItem
                    icon={<Hash />}
                    label="Roll Number"
                    value={student.rollNumber}
                  />
                  <DetailItem
                    icon={<Phone />}
                    label="Phone Number"
                    value={student.phone}
                  />
                  <DetailItem
                    icon={<BookOpen />}
                    label="Class / Grade"
                    value={student.grade}
                  />
                  <DetailItem
                    icon={<Calendar />}
                    label="Date of Birth"
                    value={student.dob ? student.dob.split("T")[0] : "N/A"}
                  />
                  <DetailItem
                    icon={<MapPin />}
                    label="Address"
                    value={student.address}
                    className="md:col-span-2"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= MATH LAB TAB ================= */}
        {activeTab === "mathlab" && isEligibleForMathLab && (
          <div className="text-gray-300">
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Progress Card */}
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 flex flex-col justify-center shadow-lg relative overflow-hidden">
                {/* Glowing orb effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>

                <h3 className="text-gray-400 font-semibold mb-6 flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" /> Math Mastery
                </h3>

                <div className="flex items-center gap-8">
                  {/* Circular Progress (Simplified CSS) */}
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="52"
                        stroke="#333"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="52"
                        stroke="#f97316"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray="326"
                        strokeDashoffset={326 - (326 * solvePercentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-white">
                        {solvedCount}
                      </span>
                      <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">
                        Solved
                      </span>
                    </div>
                  </div>

                  {/* breakdown */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#00b8a3]">Easy</span>
                      <span className="text-white font-bold">
                        {easySolved}
                        <span className="text-gray-500">/{easyTotal}</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#00b8a3] h-full"
                        style={{
                          width: `${easyTotal ? (easySolved / easyTotal) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-[#ffc01e]">Medium</span>
                      <span className="text-white font-bold">
                        {medSolved}
                        <span className="text-gray-500">/{medTotal}</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#ffc01e] h-full"
                        style={{
                          width: `${medTotal ? (medSolved / medTotal) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-[#ff375f]">Hard</span>
                      <span className="text-white font-bold">
                        {hardSolved}
                        <span className="text-gray-500">/{hardTotal}</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#333] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#ff375f] h-full"
                        style={{
                          width: `${hardTotal ? (hardSolved / hardTotal) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges / Streaks Card */}
              <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 flex flex-col shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-gray-400 font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" /> Badges &
                    Streaks
                  </h3>
                  <span className="bg-[#333] text-gray-300 text-xs px-2.5 py-1 rounded-full font-bold">
                    2 Badges
                  </span>
                </div>

                <div className="flex gap-4">
                  {easySolved >= 5 ? (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00b8a3]/20 to-[#00b8a3]/5 border border-[#00b8a3]/30 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,184,163,0.15)]">
                      <Award className="w-6 h-6 text-[#00b8a3] mb-1" />
                      <span className="text-[10px] text-[#00b8a3] font-bold">
                        Novice
                      </span>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#2a2a2a] border border-[#333] flex flex-col items-center justify-center opacity-50 grayscale">
                      <Award className="w-6 h-6 text-gray-500 mb-1" />
                      <span className="text-[10px] text-gray-500 font-bold">
                        Novice
                      </span>
                    </div>
                  )}

                  {medSolved >= 3 ? (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ffc01e]/20 to-[#ffc01e]/5 border border-[#ffc01e]/30 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,192,30,0.15)]">
                      <Flame className="w-6 h-6 text-[#ffc01e] mb-1" />
                      <span className="text-[10px] text-[#ffc01e] font-bold">
                        Adept
                      </span>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#2a2a2a] border border-[#333] flex flex-col items-center justify-center opacity-50 grayscale">
                      <Flame className="w-6 h-6 text-gray-500 mb-1" />
                      <span className="text-[10px] text-gray-500 font-bold">
                        Adept
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 lg:col-span-1 shadow-lg hidden lg:block bg-[url('https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg')] bg-cover bg-center relative group">
                <div className="absolute inset-0 bg-[#1a1a1a]/80 group-hover:bg-[#1a1a1a]/70 transition-all"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-white font-bold text-xl mb-2">
                    Math is the language of the universe.
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Keep solving, keep growing.
                  </p>
                  <div className="mt-auto">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-semibold backdrop-blur-sm transition-all border border-white/10">
                      Daily Challenge →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* LeetCode-style Activity Heatmap Card */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-6 mb-8 shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-400 mb-6 gap-4">
                <div>
                  <span className="text-white font-bold text-lg">
                    {totalSubmissions}
                  </span>{" "}
                  submissions in the past one year
                </div>
                <div className="flex flex-wrap gap-4 md:gap-6 text-xs md:text-sm">
                  <div>
                    Total active days:{" "}
                    <span className="text-white font-bold">{activeDays}</span>
                  </div>
                  <div>
                    Max streak:{" "}
                    <span className="text-white font-bold">{maxStreak}</span>
                  </div>
                  <div>
                    Current streak:{" "}
                    <span className="text-white font-bold">
                      {currentStreak}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar-dark pb-4">
                <div className="min-w-max">
                  <div className="flex gap-1 mb-2">
                    {weeks.map((week, wIndex) => (
                      <div key={wIndex} className="flex flex-col gap-1">
                        {week.map((day, dIndex) => {
                          if (!day)
                            return (
                              <div
                                key={dIndex}
                                className="w-3 h-3 bg-transparent"
                              ></div>
                            );

                          let bgColor = "bg-[#2a2a2a]";
                          if (day.count === 1) bgColor = "bg-[#0e4429]";
                          else if (day.count === 2) bgColor = "bg-[#006d32]";
                          else if (day.count === 3) bgColor = "bg-[#26a641]";
                          else if (day.count >= 4) bgColor = "bg-[#39d353]";

                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                          const isToday = day.dateStr === todayStr;

                          return (
                            <div
                              key={dIndex}
                              className={`w-3 h-3 rounded-[2px] ${bgColor} ${isToday ? "border border-gray-400" : ""} hover:border hover:border-gray-400 transition-all cursor-pointer group relative`}
                            >
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 transition-opacity">
                                {day.count} submissions on {day.dateStr}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Month Labels */}
                  <div className="relative h-6 text-xs text-gray-500 font-medium">
                    {monthLabels.map((ml, i) => (
                      <div
                        key={i}
                        className="absolute top-1"
                        style={{ left: `${ml.weekIndex * (12 + 4)}px` }}
                      >
                        {ml.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List Section */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] shadow-lg overflow-hidden">
              {/* Header Tabs */}
              <div className="flex border-b border-[#333] bg-[#222] overflow-x-auto custom-scrollbar-dark">
                {chapters.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    No chapters found. Wait for admin to upload questions.
                  </div>
                ) : (
                  chapters.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setMathLabChapter(ch)}
                      className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${displayChapter === ch ? "border-orange-500 text-white bg-[#2a2a2a]" : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#252525]"}`}
                    >
                      {ch}
                    </button>
                  ))
                )}
              </div>

              {/* Table */}
              <div className="p-0">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-[#1e1e1e] border-b border-[#333] text-gray-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-12">Status</th>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4 w-24">Difficulty</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]/50">
                    {questions.filter((q) => q.chapterName === displayChapter)
                      .length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center">
                          No problems available in this chapter.
                        </td>
                      </tr>
                    ) : (
                      questions
                        .filter((q) => q.chapterName === displayChapter)
                        .map((q, idx) => {
                          const marks = parseInt(q.marks);
                          let diffColor = "text-[#00b8a3]";
                          let diffText = "Easy (2M)";
                          if (marks === 5) {
                            diffColor = "text-[#ffc01e]";
                            diffText = "Med. (5M)";
                          }
                          if (marks >= 10) {
                            diffColor = "text-[#ff375f]";
                            diffText = "Hard (10M)";
                          }

                          // Check status
                          const sub = submissions.find(
                            (s) => s.questionId === q._id,
                          );
                          let statusIcon = (
                            <div className="w-4 h-4 rounded-full border border-[#555]"></div>
                          );
                          if (sub && sub.status === "solved") {
                            statusIcon = (
                              <CheckCircle className="w-5 h-5 text-orange-500" />
                            );
                          } else if (sub && sub.status === "pending") {
                            statusIcon = (
                              <div className="w-4 h-4 rounded-full border-2 border-[#ffc01e] border-t-transparent animate-spin"></div>
                            );
                          }

                          return (
                            <tr
                              key={q._id || idx}
                              className="hover:bg-[#222] transition-colors group"
                            >
                              <td className="px-6 py-4">{statusIcon}</td>
                              <td className="px-6 py-4">
                                <Link
                                  href={`/student-dashboard/problem/${q._id || encodeURIComponent(q.title)}`}
                                  className="font-semibold text-gray-200 group-hover:text-orange-500 transition-colors cursor-pointer block"
                                >
                                  {q.title}
                                </Link>
                                {q.description && (
                                  <p className="text-xs text-gray-600 truncate max-w-sm mt-1">
                                    {q.description}
                                  </p>
                                )}
                              </td>
                              <td
                                className={`px-6 py-4 font-bold ${diffColor}`}
                              >
                                {diffText}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {sub ? (
                                  <span
                                    className={`text-xs font-bold px-2.5 py-1 rounded-md ${sub.status === "solved" ? "bg-[#00b8a3]/10 text-[#00b8a3]" : "bg-[#ffc01e]/10 text-[#ffc01e]"}`}
                                  >
                                    {sub.status === "solved"
                                      ? "Solved"
                                      : "Pending Verification"}
                                  </span>
                                ) : (
                                  <Link
                                    href={`/student-dashboard/problem/${q._id || encodeURIComponent(q.title)}`}
                                    className="text-xs font-bold bg-[#333] hover:bg-orange-500 hover:text-white text-gray-300 px-4 py-1.5 rounded-lg transition-colors inline-flex items-center"
                                  >
                                    Solve{" "}
                                    <ChevronRight className="w-3 h-3 ml-1" />
                                  </Link>
                                )}
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Component
function DetailItem({ icon, label, value, className = "" }) {
  return (
    <div
      className={`flex items-start p-4 rounded-xl border border-[#333] bg-[#282828] ${className}`}
    >
      <div className="p-2 bg-[#3d3d3d] rounded-lg text-gray-300 shadow-sm mr-4 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-semibold mb-1 uppercase tracking-wider text-xs">
          {label}
        </p>
        <p className="font-bold text-gray-200">{value || "Not provided"}</p>
      </div>
    </div>
  );
}
