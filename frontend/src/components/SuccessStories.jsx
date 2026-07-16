"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, ArrowRight, User } from 'lucide-react';
import Image from 'next/image';
import girlsImg from '../assets/girlsimg.png';
import boy1 from "../assets/boy-1.png";
import boy2 from "../assets/boy-2.png";
import boy3 from "../assets/boy-3.png";
import boy4 from "../assets/boy-4.png";
import SheikFaizal from "../assets/SheikFaizal.png";
import Jabar from "../assets/jabar.png";

import achieversData from '../data/data.json';

const imageMap = {
  boy1, boy2, boy3, boy4, SheikFaizal, Jabar
};

const achievers = achieversData.map(a => ({
  ...a,
  image: a.imageId ? imageMap[a.imageId] : null
}));

const AchieverCard = ({ achiever, subjectFilter }) => {
  // Extract main score based on subjectFilter
  let mainScore = '-';
  
  if (subjectFilter && subjectFilter !== 'ALL') {
    const searchTerm = subjectFilter === 'CS' ? 'computer' : subjectFilter.toLowerCase();
    const subjectHighlight = achiever.highlights.find(h => h.toLowerCase().includes(searchTerm));
    if (subjectHighlight) {
      let val = subjectHighlight.split(":").pop().trim();
      if (!val.includes("/")) {
        val += "/100";
      }
      mainScore = val;
    }
  }

  // Fallback to overall/main score if no subject filter is active or subject wasn't found
  if (mainScore === '-') {
    const scoreHighlight = achiever.highlights.find(h => h.toLowerCase().includes("score") || h.match(/\d+\/\d+/));
    if (scoreHighlight) {
      mainScore = scoreHighlight.split(":").pop().trim();
    } else if (achiever.highlights.length > 0) {
      let val = achiever.highlights[0].split(":").pop().trim();
      if (!val.includes("/") && achiever.badge === "Subject Topper") {
        val += "/100";
      }
      mainScore = val;
    }
  }

  return (
    <div className="bg-white rounded-[24px] p-4 flex gap-4 items-center shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] relative w-full h-full flex-shrink-0 border border-gray-50">
      {/* Left Image Section */}
      <div className="relative w-28 h-32 md:w-32 md:h-36 rounded-[16px] overflow-hidden bg-[#e0e7ff] flex-shrink-0 flex items-end justify-center">
        {achiever.image ? (
          <Image
            src={achiever.image}
            alt={achiever.name}
            className="w-full h-[95%] object-cover object-top"
          />
        ) : achiever.gender === "Female" ? (
          <Image
            src={girlsImg}
            alt={achiever.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <User className="w-10 h-10 text-gray-400" />
          </div>
        )}
        
        {/* Bottom Badge inside image */}
        <div className="absolute bottom-0 left-0 w-full bg-[#1e293b] text-white text-[9px] md:text-[10px] font-bold py-1.5 text-center uppercase tracking-wide">
          {achiever.badge || "Achiever"}
        </div>
      </div>

      {/* Right Content Section */}
      <div className="flex flex-col justify-center flex-1 pr-2">
        <h3 className="text-lg md:text-xl font-bold text-[#1e293b] leading-tight mb-1">
          {achiever.name}
        </h3>
        <p className="text-[11px] md:text-xs text-gray-500 font-medium">
          Isma Tuition Center
        </p>
        <p className="text-[11px] md:text-xs text-gray-600 mb-2 font-bold">
          Class {achiever.class}
        </p>
        <div className="text-2xl md:text-3xl font-black text-[#00584A]">
          {mainScore}
        </div>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  const [filter, setFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const scrollContainerRef = useRef(null);
  
  const filters = ['ALL', '12th', '11th', '10th'];
  const subjectFilters = ['ALL', 'Tamil', 'English', 'Maths', 'CS', 'Physics', 'Chemistry', 'Biology'];
  
  const filteredAchievers = achievers.filter(a => {
    const classMatch = filter === 'ALL' || a.class === filter;
    
    let subjectMatch = subjectFilter === 'ALL';
    if (!subjectMatch) {
      const searchTerm = subjectFilter === 'CS' ? 'computer' : subjectFilter.toLowerCase();
      subjectMatch = a.highlights.some(h => h.toLowerCase().includes(searchTerm));
    }
    
    return classMatch && subjectMatch;
  });

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 424 : 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 bg-[#F3F5F9]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 pl-2">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 flex items-center gap-3">
            Meet Our <span className="text-[#00584A]">Stars</span> <span className="text-3xl">✨</span>
          </h2>
          
          {/* Class Filters */}
          <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-[10px] text-[13px] md:text-sm font-bold border-2 transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-[#00584A]/10 text-[#00584A] border-[#00584A]' 
                    : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Subject Filters */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {subjectFilters.map(sf => (
              <button
                key={sf}
                onClick={() => setSubjectFilter(sf)}
                className={`px-5 py-2 rounded-[10px] text-[13px] md:text-sm font-bold border-2 transition-all whitespace-nowrap ${
                  subjectFilter === sf 
                    ? 'bg-[#00584A]/10 text-[#00584A] border-[#00584A]' 
                    : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {sf}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Scrolling 2 Rows Grid with Navigation Arrows */}
        <div className="relative group">
          {filteredAchievers.length > 6 && (
            <>
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 md:-ml-5 z-10 bg-white shadow-lg p-2 rounded-full border text-[#00584A] hover:bg-gray-50 opacity-90 hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 md:-mr-5 z-10 bg-white shadow-lg p-2 rounded-full border text-[#00584A] hover:bg-gray-50 opacity-90 hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div 
            ref={scrollContainerRef}
            className="grid grid-rows-2 grid-flow-col gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 pl-2 scrollbar-hide auto-cols-[90%] sm:auto-cols-[320px] md:auto-cols-[400px]"
          >
            {filteredAchievers.map((achiever, idx) => (
              <div key={idx} className="snap-center h-full">
                <AchieverCard achiever={achiever} subjectFilter={subjectFilter} />
              </div>
            ))}
          </div>
        </div>

        {/* View All Achievers Button */}
        <div className="flex justify-center mt-12 pb-6">
          <Link href="/all-achievers">
            <button className="bg-[#00584A] text-white px-8 py-3.5 rounded-full font-bold text-base md:text-lg hover:bg-[#004338] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
              View All Achievers <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;