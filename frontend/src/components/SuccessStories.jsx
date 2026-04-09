"use client";

import React, { useRef } from 'react';
import { Trophy, Award, Target, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import girlsImg from '../assets/girlsimg.png';
import boy1 from "../assets/boy-1.png";
import boy2 from "../assets/boy-2.png";
import boy3 from "../assets/boy-3.png";
import boy4 from "../assets/boy-4.png";

// ✅ DATA (added image for male students)
const achievers = [
  {
    name: "Boy 1",
    class: "10th & 11th",
    gender: "Male",
    image: boy1,
    highlights: ["10th Score: 480/500", "Maths: 100", "English: 97", "Science: 96", "Tamil: 96"],
    badge: "Top Performer"
  },
  {
    name: "Boy 2",
    class: "11th",
    gender: "Male",
    image: boy2,
    highlights: ["Score: 450/600"],
    badge: "Achiever"
  },
  {
    name: "Boy 3",
    class: "10th & 11th",
    gender: "Male",
    image: boy3,
    highlights: ["10th: 410/500", "English: 97", "11th: 411/600"],
    badge: "Achiever"
  },
  {
    name: "Boy 4",
    class: "10th",
    gender: "Male",
    image: boy4,
    highlights: ["Maths: 99"],
    badge: "Maths Topper"
  },
  {
    name: "Mohamed Hussain",
    class: "10th",
    gender: "Male",
    // image: "/students/mohamed.png",
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

// 🎨 STYLE MAP (colors per category)
const styleMap = {
  elite: {
    bg: "from-[#362A72] to-black",
    name: "text-yellow-300",
    class: "text-emerald-300",
    badge: "text-yellow-300"
  },
  achiever: {
    bg: "from-[#362A72] to-black",
    name: "text-yellow-300",
    class: "text-emerald-300",
    badge: "text-yellow-300"
  },
  maths: {
    bg: "from-[#362A72] to-black",
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

const AchieverCard = ({ achiever, type }) => {
  const style = styleMap[type];
  const Icon = getIcon(achiever.badge);

  return (
    <div className={`w-[85%] min-w-[280px] max-w-[320px] min-h-[380px] rounded-[28px] overflow-hidden bg-gradient-to-b ${style.bg} text-white flex flex-col justify-between shadow-xl flex-shrink-0 snap-center relative`}>

      {/* Badge */}
      <div className={`flex justify-end p-4 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}>
        <Icon className="w-3 h-3 mr-1" />
        {achiever.badge}
      </div>

      {/* Image Section */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        {achiever.image ? (
          <Image
            src={achiever.image}
            alt={achiever.name}
            width={200}
            height={200}
            className="h-[180px] w-auto object-cover"
          />
        ) : achiever.gender === "Female" ? (
          <Image
            src={girlsImg}
            alt={achiever.name}
            className="h-[180px] w-auto object-contain"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-10 h-10 text-white/60" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center px-4 pb-6">

        {/* Score */}
        <h2 className="text-4xl font-extrabold mb-2">
          {achiever.mainScores?.[0]?.split(":").pop()}
        </h2>

        {/* Subjects */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-300 mb-3">
          {achiever.subjects?.slice(0, 4).map((sub, i) => (
            <span key={i}>{sub.replace(":", " : ")}</span>
          ))}
        </div>

        {/* Name */}
        <h3 className={`text-lg font-bold uppercase ${style.name}`}>
          {achiever.name}
        </h3>

        {/* Class */}
        <p className={`text-sm ${style.class}`}>
          Class {achiever.class}
        </p>

      </div>
    </div>
  );
};

const CarouselLayer = ({ title, items, type }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: dir === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="mb-10">
      <div className="container mx-auto px-4 max-w-7xl mb-4 flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-800">{title}</h3>

        <div className="hidden md:flex gap-3">
          <button onClick={() => scroll("left")} className="btn">{'<'}</button>
          <button onClick={() => scroll("right")} className="btn">{'>'}</button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-start md:items-center md:justify-center gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-10 scrollbar-hide"
      >
        {items.map((a, i) => (
          <AchieverCard key={i} achiever={a} type={type} />
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 md:hidden">Swipe →</p>
    </div>
  );
};

const SuccessStories = () => {
  const processed = achievers.map(a => {
    const mainScores = [];
    const subjects = [];

    a.highlights.forEach(h => {
      if (h.toLowerCase().includes("score") || h.match(/\d+\/\d+/)) {
        mainScores.push(h);
      } else {
        subjects.push(h);
      }
    });

    if (mainScores.length === 0 && subjects.length > 0) {
      mainScores.push(subjects.shift());
    }

    return { ...a, mainScores, subjects };
  });

  return (
    <section className="py-10 bg-[#FAFBFC]">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black">
          Top <span className="text-emerald-600">Achievers</span>
        </h2>
      </div>

      <CarouselLayer title="Elite Top Performers" items={processed.filter(a => a.badge === "Top Performer")} type="elite" />
      <CarouselLayer title="Outstanding Achievers" items={processed.filter(a => a.badge === "Achiever")} type="achiever" />
      <CarouselLayer title="Maths Excellence" items={processed.filter(a => a.badge === "Maths Topper")} type="maths" />
    </section>
  );
};

export default SuccessStories;