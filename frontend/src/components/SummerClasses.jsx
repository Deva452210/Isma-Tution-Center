"use client";

import React from 'react';
import { PhoneCall, CheckCircle2, Clock, BookOpen, Star, Sparkles } from 'lucide-react';

const programs = [
  {
    id: 1,
    title: "Primary Students Summer Class",
    subtitle: "Fun & Education!",
    badge: "For Primary",
    features: [
      "Drawing & Colouring", 
      "Handwriting (Tamil, English, Hindi, Arabic)", 
      "Spoken English & Hindi", 
      "Chess Coaching", 
      "Tamil & English Reading",
      "Quranic Learning & Islamic Studies"
    ],
    priceTag: "Low Cost Materials Provided",
    theme: "bg-[#f0f9ff]/50 hover:bg-[#f0f9ff] border-[#e0f2fe]",
    iconColor: "text-sky-500",
    badgeTheme: "bg-sky-100 text-sky-700",
    icon: <Sparkles className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Evening Classes",
    subtitle: "Enjoy the Holiday usefully",
    badge: "Early 10th & 12th",
    features: [
      "Daily Basis Class up to 2 Hours",
      "Material Will Be Provided with our Own",
      "Get a head start on next year's syllabus",
      "Proper & Useful Revision"
    ],
    priceTag: "Enroll Soon!",
    theme: "bg-[#fffbeb]/50 hover:bg-[#fffbeb] border-[#fef3c7]",
    iconColor: "text-amber-500",
    badgeTheme: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Summer Crash Course",
    subtitle: "Complete Syllabus Within 2 Months",
    badge: "10th, 11th, 12th",
    features: [
      "Full Syllabus Coverage",
      "Self Test & Unit Test Sessions",
      "Important Questions Discussion",
      "Our Own Study Materials Provided"
    ],
    priceTag: "Low Cost - High Quality",
    theme: "bg-[#ecfdf5]/50 hover:bg-[#ecfdf5] border-[#d1fae5]",
    iconColor: "text-emerald-500",
    badgeTheme: "bg-emerald-100 text-emerald-700",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Higher Secondary Special",
    subtitle: "Complete Revision in short span",
    badge: "11th & 12th",
    features: [
      "Special Coaching For Centum Scorer",
      "Unit Test Sessions",
      "Doubt Clearing Sessions",
      "Covers Full Syllabus"
    ],
    priceTag: "Special Fee: ₹10,000 / Subject",
    theme: "bg-[#f5f3ff]/50 hover:bg-[#f5f3ff] border-[#ede9fe]",
    iconColor: "text-violet-500",
    badgeTheme: "bg-violet-100 text-violet-700",
    icon: <Star className="w-6 h-6" />
  }
];

export default function SummerClasses() {
  return (
    <section className="py-20 md:py-28 bg-[#fafafa] relative overflow-hidden">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-200/30 rounded-full blur-[100px] opacity-70 -translate-y-1/3 translate-x-1/3 -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[120px] opacity-70 translate-y-1/3 -translate-x-1/3 -z-10 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center px-5 py-2 mb-6 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 border border-orange-200 shadow-sm">
                    <span className="text-orange-700 font-bold tracking-widest text-[13px] uppercase">Admissions Open 2026</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                    Summer <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-[#FABB05]">Crash Course</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    Be alert and prepare early for public examinations! Utilize the summer holidays with our specialized intensive learning programs and fun activities.
                </p>
            </div>

            {/* Horizontal Carousel Container */}
            <div 
                className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-4 lg:px-8 -mx-4 lg:-mx-8 lg:justify-center z-10 relative mb-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    div::-webkit-scrollbar {
                        display: none;
                    }
                  `}} />
                {programs.map((program) => (
                    <div key={program.id} className={`flex-none w-[85vw] sm:w-[320px] lg:w-[280px] xl:w-[300px] snap-center rounded-3xl border p-8 flex flex-col transition-all duration-300 md:hover:shadow-xl md:hover:-translate-y-2 ${program.theme} relative overflow-hidden group`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${program.iconColor}`}>
                                {program.icon}
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide ${program.badgeTheme}`}>
                                {program.badge}
                            </span>
                        </div>
                        
                        <h3 className="text-[22px] font-extrabold text-gray-900 mb-2 leading-tight">{program.title}</h3>
                        <p className="text-[14px] font-semibold text-gray-500 mb-8">{program.subtitle}</p>

                        <div className="space-y-4 mb-8 flex-grow">
                            {program.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${program.iconColor}`} />
                                    <span className="text-gray-700 text-[15px] leading-snug">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-black/5">
                            <p className="text-center font-bold text-gray-900 text-sm tracking-wide bg-white/50 py-2 rounded-xl">
                                {program.priceTag}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Powerful Call To Action Strip */}
            <div className="bg-gradient-to-br from-[#004d40] to-[#00796b] rounded-[2rem] p-8 md:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between text-white relative overflow-hidden border border-[#004d40]">
                {/* Decorative CTA background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-300 opacity-10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
                
                <div className="z-10 mb-10 lg:mb-0 text-center lg:text-left max-w-2xl px-4 lg:px-0">
                    <h3 className="text-3xl md:text-4xl font-extrabold mb-5 text-white tracking-tight">Limited Seats Available!</h3>
                    <p className="text-teal-50 text-lg leading-relaxed">
                        Our summer crash courses fill up exceptionally fast. Secure a productive holiday by enrolling your child today.
                    </p>
                </div>

                <div className="z-10 shrink-0 shadow-xl rounded-full w-full lg:w-auto mt-4 lg:mt-0">
                    <a 
                        href="tel:7358870782"
                        className="group flex flex-row flex-wrap items-center justify-center gap-2 md:gap-3 bg-[#FABB05] hover:bg-[#f9d004] text-gray-900 px-6 md:px-10 py-4 md:py-5 rounded-full transition-all duration-300 transform active:scale-95 border-4 border-yellow-300/30 w-full"
                    >
                        <PhoneCall className="w-6 h-6 md:w-8 md:h-8 animate-[pulse_2s_ease-in-out_infinite]" />
                        <span className="font-extrabold text-[1.3rem] sm:text-2xl md:text-3xl tracking-tight text-center">
                            Call Now: 73588 70782
                        </span>
                    </a>
                </div>
            </div>
        </div>
    </section>
  );
}
