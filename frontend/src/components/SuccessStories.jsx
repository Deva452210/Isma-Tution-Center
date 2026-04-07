"use client";

import React, { useRef } from 'react';
import { Trophy, Award, TrendingUp, Target, User, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import girlsImg from '../assets/girlsimg.jpeg';

const achievers = [
  {
    name: "Boy 1",
    class: "10th & 11th",
    gender: "Male",
    highlights: [
      "10th Score: 480/500",
      "Maths: 100",
      "English: 97",
      "Science: 96",
      "Tamil: 96"
    ],
    badge: "Top Performer"
  },
  {
    name: "Boy 2",
    class: "11th",
    gender: "Male",
    highlights: ["Score: 450/600"],
    badge: "Achiever"
  },
  {
    name: "Boy 3",
    class: "10th & 11th",
    gender: "Male",
    highlights: ["10th: 410/500", "English: 97", "11th: 411/600"],
    badge: "Achiever"
  },
  {
    name: "Boy 4",
    class: "10th",
    gender: "Male",
    highlights: ["Maths: 99"],
    badge: "Maths Topper"
  },
  {
    name: "Mohamed Hussain",
    class: "10th",
    gender: "Male",
    highlights: ["Maths: 95"],
    badge: "Maths Topper"
  },
  {
    name: "Safrin Fathima",
    class: "10th",
    gender: "Female",
    highlights: ["Score: 419/500", "Maths: 97", "Science: 93"],
    badge: "Top Performer"
  },
  {
    name: "Shirrin Muhmina",
    class: "10th",
    gender: "Female",
    highlights: ["Maths: 90"],
    badge: "Achiever"
  },
  {
    name: "Ali Begam",
    class: "10th",
    gender: "Female",
    highlights: ["Score: 471/500", "Maths: 97", "Science: 96", "English: 94", "Tamil: 92"],
    badge: "Top Performer"
  },
  {
    name: "N. Suhaila",
    class: "12th",
    gender: "Female",
    highlights: ["Score: 542/600"],
    badge: "Top Performer"
  },
  {
    name: "Yasmin Jariya",
    class: "12th",
    gender: "Female",
    highlights: ["Score: 515/600", "Tamil: 97"],
    badge: "Achiever"
  }
];

const renderBadge = (badge, isHero) => {
  let Icon = Award;
  let color = isHero ? 'text-emerald-300' : 'text-slate-400';
  
  if (badge.includes('Top')) {
    Icon = Trophy;
    color = isHero ? 'text-amber-300' : 'text-amber-500';
  } else if (badge.includes('Maths')) {
    Icon = Target;
    color = isHero ? 'text-indigo-300' : 'text-indigo-500';
  }
  
  return (
    <div className={`flex items-center gap-2 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] relative z-10 ${color}`}>
      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      {badge}
    </div>
  );
};

const AchieverCard = ({ achiever, isHero }) => {
  const cardSpan = isHero ? 'w-[90vw] sm:w-[540px] md:w-[680px]' : 'w-[85vw] sm:w-[350px] md:w-[420px]';
  const baseCardStyle = "p-8 md:p-10 rounded-[32px] sm:rounded-[40px] relative transition-transform duration-500 flex flex-col self-stretch";
            
  let specializedStyle = "bg-white border border-transparent hover:border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2";
  
  if (isHero) {
    specializedStyle = "bg-gradient-to-br from-[#00584a] via-[#004d41] to-emerald-950 text-white shadow-2xl shadow-emerald-900/30 hover:-translate-y-2";
  } else if (achiever.isCentum) {
    specializedStyle = "bg-gradient-to-br from-amber-50/50 to-white border border-amber-200/50 shadow-[0_8px_30px_rgb(251,191,36,0.15)] hover:shadow-[0_20px_50px_rgb(251,191,36,0.25)] hover:-translate-y-2";
  }

  return (
    <div className={`${cardSpan} ${baseCardStyle} ${specializedStyle} group overflow-hidden shrink-0 snap-center`}>
      
      {/* Hero Accents (Glows & Depth) */}
      {isHero && (
        <>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </>
      )}

      {/* Minimal Header Badge */}
      <div className="mb-10 w-full flex">
        {renderBadge(achiever.badge, isHero)}
      </div>

      <div className={`flex flex-col relative z-10 flex-1 ${isHero ? 'md:flex-row md:items-center gap-10 md:gap-14' : 'gap-10'}`}>
        
        {/* HERO METRIC: The Score (Visually Dominant) */}
        <div className={`${isHero ? 'md:w-1/2 shrink-0' : ''}`}>
          {achiever.mainScores.map((scoreText, idx) => {
            const parts = scoreText.split(':');
            const label = parts.length > 1 ? parts[0].trim() : 'Score';
            const val = parts.length > 1 ? parts[1].trim() : scoreText;
            
            return (
              <div key={idx} className={idx > 0 && !isHero ? "mt-8" : ""}>
                <div className={`font-black tracking-tighter leading-none ${
                    isHero ? 'text-[4.5rem] sm:text-[5rem] md:text-[6.2rem] text-white drop-shadow-md' : 
                    achiever.isCentum ? 'text-6xl text-amber-500' : 
                    'text-[3.5rem] lg:text-6xl text-slate-800'
                  }`}>
                  {val}
                </div>
                <div className={`font-bold uppercase tracking-widest mt-3 ${
                    isHero ? 'text-emerald-300 text-sm' : 
                    achiever.isCentum ? 'text-amber-600/70 text-xs' : 
                    'text-slate-400 text-xs'
                  }`}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Structural Divider separating metric and student info for the Hero */}
        {isHero && <div className="hidden md:block w-px h-36 bg-white/10 shrink-0"></div>}

        {/* SECONDARY INFO: Identity & Micro-metrics */}
        <div className={`flex flex-col h-full justify-between flex-1 ${isHero ? '' : 'mt-auto'}`}>
          
          {/* User Identity Segment */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold ${
              isHero ? 'w-16 h-16 bg-white/10 border border-white/20 text-white backdrop-blur-md' : 
              'w-14 h-14 bg-slate-50 border border-slate-100 text-slate-400'
            }`}>
              {achiever.gender === 'Female' ? (
                <Image src={girlsImg} alt={achiever.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className={isHero ? "w-8 h-8 opacity-80" : "w-6 h-6"} />
              )}
            </div>
            <div>
              <h3 className={`font-extrabold text-[22px] leading-tight tracking-tight ${isHero ? 'text-white' : 'text-slate-900'}`}>{achiever.name}</h3>
              <p className={`font-semibold text-sm ${isHero ? 'text-emerald-300' : 'text-slate-500'}`}>Class {achiever.class}</p>
            </div>
          </div>

          {/* Subtle Subject Ticker */}
          {achiever.subjects.length > 0 && (
            <div className={`flex ${isHero ? 'gap-x-6 gap-y-3 flex-wrap' : 'flex-col gap-3.5'}`}>
              {achiever.subjects.slice(0, 3).map((sub, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className={`w-5 h-5 shrink-0 stroke-[3] ${
                    isHero ? 'text-emerald-400' : 
                    achiever.isCentum ? 'text-amber-400' : 
                    'text-emerald-500'
                  }`} />
                  <span className={`font-semibold tracking-wide ${
                    isHero ? 'text-emerald-50 text-wrap md:text-lg' : 
                    'text-slate-600 text-[15px]'
                  }`}>{sub}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CarouselLayer = ({ title, items, isHeroLevel }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - (clientWidth > 600 ? 600 : clientWidth)
        : scrollLeft + (clientWidth > 600 ? 600 : clientWidth);
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl mb-10 flex justify-between items-center">
         <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{title}</h3>
         
         <div className="hidden md:flex gap-3">
            <button
               onClick={() => scroll('left')}
               className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-[#00584a] hover:border-[#00584a] transition-all bg-white shadow-sm"
               aria-label="Scroll Left"
            >
               <ChevronLeft className="w-5 h-5" />
            </button>
            <button
               onClick={() => scroll('right')}
               className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-[#00584a] hover:border-[#00584a] transition-all bg-white shadow-sm"
               aria-label="Scroll Right"
            >
               <ChevronRight className="w-5 h-5" />
            </button>
         </div>
      </div>
      
      <div className="relative w-full">
         <div 
            ref={scrollRef}
            className="flex items-stretch gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pt-4 pb-12 px-4 sm:px-[10%] scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
         >
            <style dangerouslySetInnerHTML={{__html: `.scrollbar-hide::-webkit-scrollbar { display: none; }`}} />
            
            {items.map((achiever, i) => (
              <AchieverCard key={i} achiever={achiever} isHero={isHeroLevel} />
            ))}
         </div>
         
         {/* Mobile swiping hint */}
         <div className="flex justify-center md:hidden">
           <p className="text-xs font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1 -mt-4">
             Swipe <ChevronRight className="w-3 h-3" />
           </p>
         </div>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  const processedAchievers = achievers.map(achiever => {
    const mainScores = [];
    const subjects = [];

    achiever.highlights.forEach(h => {
      if (h.toLowerCase().includes('score') || h.match(/\d+\/\d+/) || h.toLowerCase().includes('11th:')) {
        mainScores.push(h);
      } else {
        subjects.push(h);
      }
    });

    if (mainScores.length === 0 && subjects.length > 0) {
      mainScores.push(subjects.shift());
    }

    const isCentum = achiever.highlights.some(h => h.includes('100'));

    return { ...achiever, mainScores, subjects, isCentum };
  });

  const topPerformers = processedAchievers.filter(a => a.badge === 'Top Performer');
  const achieversList = processedAchievers.filter(a => a.badge === 'Achiever');
  const mathsToppers = processedAchievers.filter(a => a.badge === 'Maths Topper');

  return (
    <section className="py-24 md:py-32 bg-[#FAFBFC] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-20 md:mb-24 relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
            Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00584a] to-emerald-500">Achievers</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Witness the monumental milestones set by our most outstanding students this year.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <CarouselLayer title="Elite Top Performers" items={topPerformers} isHeroLevel={true} />
        <CarouselLayer title="Outstanding Achievers" items={achieversList} isHeroLevel={false} />
        <CarouselLayer title="Maths Excellence" items={mathsToppers} isHeroLevel={false} />
      </div>
    </section>
  );
};

export default SuccessStories;
