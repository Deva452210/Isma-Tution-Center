"use client";

import React from 'react';

const facultyData = [
  {
    id: 1,
    name: "M. Mohamed Ismail",
    qualification: "B.Sc, M.Sc",
    badge: "Maths Expert",
    experience: "5+ years of experience",
    initials: "MI",
    bio: "I believe in practical learning. My goal is to make complex mathematical concepts and computer hardware fundamentals simple, engaging, and highly applicable for every student.",
    color: "bg-[#00584A]"
  },
  {
    id: 2,
    name: "V. Sabina Fathima",
    qualification: "Arabic Language",
    badge: "Arabic Expert",
    experience: "3+ years of experience",
    initials: "SF",
    bio: "I focus on holistic language learning. Building strong reading and spoken skills in Arabic empowers students and connects them with deep, enriching cultural roots.",
    color: "bg-[#007b7b]"
  },
  {
    id: 3,
    name: "N. Suhaila",
    qualification: "B.A English",
    badge: "Linguistic Expert",
    experience: "1+ year of experience",
    initials: "NS",
    bio: "My aim as an educator is to encourage creativity and higher-order thinking in a way that increases student performance and builds immense confidence in communication.",
    color: "bg-[#FABB05]"
  }
];

const Sparkle = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0Z" fill="currentColor"/>
  </svg>
);

export default function FacultySection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden z-0">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-[#f9fbf4]"> {/* Very light soft green/yellow tint similar to the image root */}
        {/* Soft curvy top shape mapped to brand colors */}
        <div className="absolute top-0 left-0 w-[80%] md:w-[60%] h-[300px] bg-[#EAF7F6] rounded-br-[100px] md:rounded-br-[300px] opacity-70 border-b-[40px] border-[#d2efe9]"></div>
        
        {/* Soft curvy right shape */}
        <div className="absolute top-[20%] right-0 w-[50%] md:w-[40%] h-[200px] bg-[#fcf2d9] rounded-l-full opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-[60%] h-[250px] bg-[#fcf2d9] rounded-tl-full opacity-60"></div>
        
        <div className="absolute top-[40%] left-[-10%] w-[30%] h-[200px] bg-[#EEF2E6] rounded-r-full blur-2xl opacity-60"></div>

        {/* Sparkles positioned mapping to the image style but with Isma colors */}
        <Sparkle className="absolute top-[25%] left-[10%] md:left-[15%] w-6 h-6 md:w-8 md:h-8 text-[#00584A]" />
        <Sparkle className="absolute top-[18%] left-[20%] md:left-[22%] w-3 h-3 md:w-4 md:h-4 text-[#FABB05]" />
        <Sparkle className="absolute top-[20%] right-[15%] md:right-[20%] w-4 h-4 text-[#FABB05]" />
        <Sparkle className="absolute top-[30%] right-[10%] md:right-[15%] w-7 h-7 md:w-9 md:h-9 text-[#007b7b]" />
        <Sparkle className="absolute top-[50%] left-[8%] md:left-[45%] w-5 h-5 text-[#00584a] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-[40px] font-extrabold text-[#1a202c] mb-4 tracking-tight leading-tight">
            Meet your child’s personalised gurus <br className="hidden md:block"/> & Isma Tuition's pride
          </h2>
        </div>

        {/* Horizontal Carousel Container */}
        <div 
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 lg:justify-center z-10 relative"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{
              __html: `
              div::-webkit-scrollbar {
                  display: none;
              }
            `}} />

          {facultyData.map((faculty) => (
            <div 
              key={faculty.id}
              className="flex-none w-[85vw] sm:w-[320px] lg:w-[340px] snap-center bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-gray-100/50 p-6 sm:p-7 flex flex-col text-left transition-transform duration-300 md:hover:-translate-y-2 h-auto"
            >
              {/* Card Header Profile Block */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl ${faculty.color} overflow-hidden shrink-0 flex items-center justify-center shadow-inner`}>
                  <span className="text-white text-2xl sm:text-3xl font-black tracking-wide">{faculty.initials}</span>
                </div>
                
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-[#1d2331] text-[17px] sm:text-[19px] leading-tight mb-2">
                    {faculty.name}
                  </h3>
                  <div>
                    <span className="inline-block px-2.5 py-1 bg-[#fff6d6] text-[#b38600] text-[10px] sm:text-[11px] font-black rounded uppercase tracking-wider">
                      {faculty.badge}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Qualification info */}
              <p className="font-bold text-[#2d3748] text-[14px] sm:text-[15px] leading-snug mb-3">
                {faculty.qualification} with {faculty.experience}
              </p>
              
              {/* Bio Block */}
              <div className="mt-1">
                <p className="text-[14px] text-gray-500 leading-[1.65]">
                  {faculty.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
