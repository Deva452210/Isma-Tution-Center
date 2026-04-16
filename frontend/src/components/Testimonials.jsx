"use client";

import React, { useRef } from 'react';
import { Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: "Farhana",
    date: "Class 10",
    review: "Good teaching and very friendly staff. Painless learning collection was surprised for me. nice experience",
    rating: 5,
  },
  {
    name: "Jazim",
    date: "Class 9",
    review: "Friendly teaching. Makes everything easy to understand. i am happy with Service",
    rating: 5,
  },
  {
    name: "Syed Mohamed",
    date: "Class 11",
    review: "Very good coaching experience. The teachers were polite and efficient",
    rating: 4,
  },
  {
    name: "Ibrahim",
    date: "Class 10",
    review: "Staff is friendly and supportive. Truly dedicated to helping students.",
    rating: 5,
  },
  {
    name: "Abdul Mujeeb",
    date: "Class 12",
    review: "Good teacher and hardworking staff. Helped me score much better.",
    rating: 5,
  },
  {
    name: "Thoufiq",
    date: "Class 9",
    review: "Friendly teaching. Makes everything easy to understand from scratch.",
    rating: 4,
  },
  {
    name: "Arshad",
    date: "Class 11",
    review: "Very good and supportive teachers. Cleared all my doubts patiently.",
    rating: 5,
  },
  {
    name: "Adhil",
    date: "Class 10",
    review: "Always good. Staff is very friendly and supportive for exams.",
    rating: 5,
  }
];

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Testimonials = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - 320
        : scrollLeft + 320;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-[#eaf7ef] overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header Section */}
        <div className="mb-10 sm:mb-16 max-w-4xl">
          {/* Top Row: Google Stars & Reviews */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
            <GoogleIcon />
            <span className="font-bold text-gray-900 text-[17px]">4.6 Stars</span>
            <div className="flex gap-0.5 ml-1">
              {[1, 2, 3, 4].map(i => (
                <Star key={i} className="w-[18px] h-[18px] fill-[#FABB05] text-[#FABB05]" />
              ))}
              <div className="relative w-[18px] h-[18px]">
                <Star className="w-[18px] h-[18px] text-[#FABB05] absolute" />
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className="w-[18px] h-[18px] fill-[#FABB05] text-[#FABB05]" />
                </div>
              </div>
            </div>
            <span className="text-gray-400 mx-1 hidden sm:inline-block">|</span>
            <span className="text-[#555] font-medium text-[15px]">20+ Ratings & Reviews</span>
          </div>

          {/* Bottom Row: Avatars & Headline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex -space-x-4 shrink-0">
              {/* Decorative Avatars */}
              <div className="w-[52px] h-[52px] rounded-full border-2 border-white bg-[#CCE2DF] overflow-hidden flex items-center justify-center relative shadow-sm z-20">
                <User className="text-[#008080] w-6 h-6" />
              </div>
              <div className="w-[52px] h-[52px] rounded-full border-2 border-white bg-[#E6DFD7] overflow-hidden flex items-center justify-center relative shadow-sm z-10">
                <User className="text-[#8B5A2B] w-6 h-6" />
              </div>
            </div>
            <h2 className="text-[28px] sm:text-3xl md:text-[34px] leading-snug tracking-tight">
              <span className="text-[#00584a] font-bold">Over 500+ happy students </span>
              <span className="text-[#1A1A1A] font-extrabold block sm:inline">Isma Tuition Center</span>
            </h2>
          </div>
        </div>

        {/* Carousel Area */}
        <div className="relative">
          {/* Faint Background Quote Decoration */}
          <div className="absolute top-0 -left-2 sm:-left-4 z-0 pointer-events-none">
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 60H0V40C0 15 10 0 30 0V15C20 15 15 20 15 35H30V60ZM75 60H50V40C50 15 60 0 80 0V15C70 15 65 20 65 35H80V60Z" fill="#d4eaddff" />
            </svg>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pt-10 pb-4 px-2 sm:px-4 -mx-2 sm:-mx-4 z-10 relative"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
              div::-webkit-scrollbar {
                  display: none;
              }
            `}} />

            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-[82vw] sm:w-[300px] bg-white rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgb(0,0,0,0.03)] flex flex-col border border-gray-100"
                style={{ minHeight: '260px' }}
              >
                {/* Card specific stars derived from rating property */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-[15px] h-[15px] ${i <= (testimonial.rating || 5) ? 'fill-[#FABB05] text-[#FABB05]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`}
                    />
                  ))}
                </div>

                <p className="text-[#444444] text-[15.5px] leading-[1.6] mb-8 font-normal flex-grow">
                  {testimonial.review}
                </p>

                <div className="border-t border-gray-100/80 pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 rounded-full p-1.5 shrink-0 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-gray-700" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-[15px] text-[#222]">{testimonial.name}</span>
                    <span className="text-[#777] text-[13px] font-medium ml-1">{testimonial.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Navigation Arrows (styled minimally to stay out of the way) */}
          <div className="hidden lg:flex gap-3 absolute -top-20 right-4">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-200 hover:text-teal-700 transition-colors"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5 -ml-1" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm border border-gray-200 hover:text-teal-700 transition-colors"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5 -mr-1" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
