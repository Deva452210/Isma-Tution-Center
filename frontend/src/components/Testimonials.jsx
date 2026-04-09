"use client";

import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import quoteIcon from '../assets/quote.svg';

const testimonials = [
  {
    name: "Farhana",
    class: "Class 10",
    review: "Good teaching and very friendly staff.",
    rating: 5,
  },
  {
    name: "Jazim",
    class: "Class 9",
    review: "Friendly teaching. Makes everything easy to understand.",
    rating: 5,
  },
  {
    name: "Syed Mohamed",
    class: "Class 11",
    review: "Very good coaching experience.",
    rating: 5,
  },
  {
    name: "Ibrahim",
    class: "Class 10",
    review: "Staff is friendly and supportive.",
    rating: 5,
  },
  {
    name: "Abdul Mujeeb",
    class: "Class 12",
    review: "Good teacher and hardworking staff.",
    rating: 5,
  },
  {
    name: "Thoufiq",
    class: "Class 9",
    review: "Friendly teaching. Makes everything easy to understand.",
    rating: 5,
  },
  {
    name: "Arshad",
    class: "Class 11",
    review: "Very good and supportive teachers.",
    rating: 5,
  },
  {
    name: "Adhil",
    class: "Class 10",
    review: "Always good. Staff is very friendly.",
    rating: 5,
  }
];

const Testimonials = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by picking a safe robust scroll distance (1 card width approx, or container width)
      const scrollTo = direction === 'left'
        ? scrollLeft - (clientWidth > 600 ? 600 : clientWidth)
        : scrollLeft + (clientWidth > 600 ? 600 : clientWidth);

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-10 md:py-14 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="relative flex flex-col items-center text-center mb-12 lg:mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-2 py-1.5 pr-4 sm:pr-6 rounded-full bg-black text-white text-[13px] sm:text-base font-medium mb-8 sm:mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.15)] relative">
            <div className="absolute inset-0 rounded-full bg-black blur-xl opacity-20 -z-10"></div>
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#00584a] flex items-center justify-center shrink-0">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-white text-white" />
            </div>
            <span>Rated 5/5 by our successful students</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 max-w-4xl leading-[1.15] tracking-tight">
            Words of praise from others<br className="hidden sm:block" /> about our teaching.
          </h2>

          {/* Navigation Arrows for Desktop (Hidden on small mobile) */}
          <div className="hidden md:flex gap-3 absolute right-0 bottom-0 translate-y-1/2">
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#00584a] hover:border-[#00584a] transition-all bg-white shadow-sm"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[#00584a] hover:border-[#00584a] transition-all bg-white shadow-sm"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative -mx-4 sm:mx-0">
          {/* Faded edges to indicate scrollability */}
          <div className="absolute top-0 bottom-0 left-0 w-4 sm:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-4 sm:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling track */}
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-10 px-4 sm:px-10 scrollbar-hide pt-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
              .scrollbar-hide::-webkit-scrollbar {
                  display: none;
              }
            `}} />

            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-[360px] bg-[#F8F9FB] rounded-3xl p-6 sm:p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-gray-100/50"
              >
                <div>
                  {/* Quotes Icon & Rating */}
                  <div className="flex justify-between items-center mb-5 sm:mb-6">
                    <Image src={quoteIcon} alt="Quote" className="w-7 h-7 sm:w-8 sm:h-8" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 text-[15.5px] sm:text-[17px] font-medium leading-relaxed mb-8">
                    {testimonial.review}
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-auto border-t border-gray-200/50 pt-5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#00584a] flex items-center justify-center text-[#ffffff] font-bold text-sm sm:text-base shadow-sm shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-[15px] truncate">{testimonial.name}</h4>
                    <p className="text-[13px] text-gray-500">{testimonial.class}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation indicator (Optional dot-like hint) */}
        <div className="flex justify-center mt-2 md:hidden">
          <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
            Swipe to see more <ChevronRight className="w-4 h-4 opacity-50" />
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
