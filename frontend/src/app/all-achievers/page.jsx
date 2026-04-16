"use client";

import React, { useState } from 'react';
import { Trophy, Award, Target, User } from 'lucide-react';
import Image from 'next/image';
import girlsImg from '../../assets/girlsimg.png';
import boy1 from "../../assets/boy-1.png";
import boy2 from "../../assets/boy-2.png";
import boy3 from "../../assets/boy-3.png";
import boy4 from "../../assets/boy-4.png";
import SheikFaizal from "../../assets/SheikFaizal.png";
import Jabar from "../../assets/Jabar.png";

import achieversDataRaw from '../../data/all-achievers.json';

const imageMap = {
  boy1, boy2, boy3, boy4, SheikFaizal, Jabar
};

const allAchieversMapped = achieversDataRaw.map(a => ({
  ...a,
  image: a.imageId ? imageMap[a.imageId] : null
}));

// 🎨 STYLE MAP (colors per category)
const styleMap = {
  elite: {
    bg: "from-[#00584A] to-black",
    name: "text-yellow-300",
    class: "text-emerald-300",
    badge: "text-yellow-300"
  },
  achiever: {
    bg: "from-[#00584A] to-black",
    name: "text-yellow-300",
    class: "text-emerald-300",
    badge: "text-yellow-300"
  },
  maths: {
    bg: "from-[#00584A] to-black",
    name: "text-yellow-300",
    class: "text-emerald-300",
    badge: "text-yellow-300"
  }
};

const getIcon = (badge) => {
  if (badge.includes("Maths")) return Target;
  if (badge.includes("Achiever")) return Award;
  return Trophy;
};

// Helper to determine type based on badge for style mapping
const getType = (badge) => {
  if (badge === "Top Performer") return "elite";
  if (badge === "Maths Topper") return "maths";
  return "achiever";
};

// Reusable process function (same as in SuccessStories)
const processHighlights = (achiever) => {
  const mainScores = [];
  const subjects = [];

  achiever.highlights.forEach(h => {
    if (h.toLowerCase().includes("score") || h.match(/\d+\/\d+/)) {
      mainScores.push(h);
    } else {
      subjects.push(h);
    }
  });

  if (mainScores.length === 0 && subjects.length > 0) {
    mainScores.push(subjects.shift());
  }

  return { ...achiever, mainScores, subjects };
};

const AchieverGridCard = ({ achiever }) => {
  const processed = processHighlights(achiever);
  const type = getType(processed.badge);
  const style = styleMap[type] || styleMap.achiever;
  const Icon = getIcon(processed.badge);

  return (
    <div className={`w-full min-h-[240px] md:min-h-[350px] rounded-[20px] md:rounded-[28px] overflow-hidden bg-gradient-to-b ${style.bg} text-white flex flex-col justify-between shadow-xl relative transform transition-transform hover:-translate-y-1 hover:shadow-2xl`}>
      {/* Badge */}
      <div className={`flex justify-end p-2 md:p-4 text-[6px] md:text-[8px] font-medium uppercase tracking-wider ${style.badge}`}>
        <Icon className="w-2 h-2 md:w-3 md:h-3 mr-1" />
        {processed.badge}
      </div>

      {/* Image Section */}
      <div className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
        {processed.image ? (
          <Image
            src={processed.image}
            alt={processed.name}
            width={150}
            height={150}
            className="h-[100px] md:h-[150px] w-auto object-cover"
          />
        ) : processed.gender === "Female" ? (
          <Image
            src={girlsImg}
            alt={processed.name}
            className="h-[100px] md:h-[150px] w-auto object-contain"
          />
        ) : (
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-8 h-8 md:w-10 md:h-10 text-white/60" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center px-2 md:px-4 pb-4 md:pb-6 mt-28 md:mt-36">
        {/* Score */}
        <h2 className="text-2xl md:text-3xl font-extrabold mb-1">
          {processed.mainScores?.[0]?.split(":").pop() || '-'}
        </h2>

        {/* Subjects */}
        <div className="flex flex-wrap justify-center gap-x-1 md:gap-x-2 gap-y-1 text-[9px] md:text-[11px] text-gray-300 mb-1 md:mb-2">
          {processed.subjects?.slice(0, 3).map((sub, i) => (
            <span key={i}>{sub.replace(":", " : ")}</span>
          ))}
        </div>

        {/* Name */}
        <h3 className={`text-xs md:text-base font-bold uppercase ${style.name} line-clamp-1`} title={processed.name}>
          {processed.name}
        </h3>

        {/* Class */}
        <p className={`text-[10px] md:text-xs ${style.class}`}>
          Class {processed.class}
        </p>
      </div>
    </div>
  );
};

export default function AllAchieversPage() {
  const years = [...new Set(allAchieversMapped.map(a => a.batch))].sort((a, b) => b.localeCompare(a));
  const [selectedYear, setSelectedYear] = useState(years[0] || "");

  const currentData = allAchieversMapped.filter(student => student.batch === selectedYear);

  // Group by class
  const class12th = currentData.filter(student => student.class === "12th");
  const class11th = currentData.filter(student => student.class === "11th");
  const class10th = currentData.filter(student => student.class === "10th");

  return (
    <div className="min-h-screen bg-[#FAFBFC] py-12 px-4 sm:px-6 lg:px-8">
      {/* Header section with Year Selector */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 mt-8">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-5xl font-black text-slate-800 tracking-tight">
            Our Hall of <span className="text-[#00584A]">Fame</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Celebrating excellence across the years</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 md:mt-0 justify-center md:justify-end">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-8 py-3 rounded-full font-bold text-base transition-all duration-300 ${selectedYear === year
                ? 'bg-[#0f172a] text-[#fcd34d] shadow-md border border-transparent'
                : 'bg-white text-[#1f2937] border border-gray-200 hover:bg-gray-50 shadow-sm'
                }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-16 pb-12">
        {/* 12th Students */}
        {class12th.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-slate-800">12th Grade <span className="text-[#00584A] font-black">Achievers</span></h2>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {class12th.map((student, idx) => (
                <AchieverGridCard key={`12-${idx}`} achiever={student} />
              ))}
            </div>
          </section>
        )}

        {/* 11th Students */}
        {class11th.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-slate-800">11th Grade <span className="text-[#00584A] font-black">Achievers</span></h2>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {class11th.map((student, idx) => (
                <AchieverGridCard key={`11-${idx}`} achiever={student} />
              ))}
            </div>
          </section>
        )}

        {/* 10th Students */}
        {class10th.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-slate-800">10th Grade <span className="text-[#362A72] font-black">Achievers</span></h2>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {class10th.map((student, idx) => (
                <AchieverGridCard key={`10-${idx}`} achiever={student} />
              ))}
            </div>
          </section>
        )}

        {(class12th.length === 0 && class11th.length === 0 && class10th.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No achievers found for the selected year.</p>
          </div>
        )}
      </div>
    </div>
  );
}
