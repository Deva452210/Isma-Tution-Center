"use client";

import React, { useRef } from 'react';
import Image from 'next/image';

const topPerformerImages = [
  "/successstories/topperformers/topperformers-1.png",
  "/successstories/topperformers/topperformers-2.png",
  "/successstories/topperformers/topperformers-3.png",
  "/successstories/topperformers/topperformers-4.png",
];

const achieverImages = [
  "/successstories/achievers/achievers-1.png",
  "/successstories/achievers/achievers-2.png",
  "/successstories/achievers/achievers-3.png",
  "/successstories/achievers/achievers-4.png",
];

const mathTopperImages = [
  "/successstories/mathtoppers/mathtoppers-1.png",
  "/successstories/mathtoppers/mathtoppers-2.png",
  "/successstories/mathtoppers/mathtoppers-3.png",
];

const CarouselLayer = ({ title, images }) => {
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
        {images.map((src, i) => (
          <div key={i} className="w-[85%] min-w-[280px] max-w-[320px] rounded-[16px] overflow-hidden flex-shrink-0 snap-center snap-always relative shadow-lg">
            <Image
              src={src}
              alt={`${title} ${i + 1}`}
              width={320}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 md:hidden">Swipe →</p>
    </div>
  );
};

const SuccessStories = () => {
  return (
    <section className="py-10 bg-[#FAFBFC]">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black">
          Top <span className="text-[#362A72]">Achievers</span>
        </h2>
      </div>

      <CarouselLayer title="Elite Top Performers" images={topPerformerImages} />
      <CarouselLayer title="Outstanding Achievers" images={achieverImages} />
      <CarouselLayer title="Maths Excellence" images={mathTopperImages} />
    </section>
  );
};

export default SuccessStories;