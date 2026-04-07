"use client";

import React, { useState } from 'react';

const images = [
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop', // Classroom / lecture
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop', // Students studying
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop', // Group study
  'https://images.unsplash.com/photo-1427504494785-319ce5154c40?q=80&w=2070&auto=format&fit=crop', // Library
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop', // Learning resources
];

const LifeAtIsma = () => {
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Life at Isma</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We foster a learning environment that nurtures personal and professional growth, designed to cultivate your potential and propel you towards success in your academic and professional endeavours.
          </p>
        </div>

        {/* Main Big Image */}
        <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[21/9] relative">
          <img 
            src={activeImg} 
            alt="Life at Isma preview" 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-5 gap-3 md:gap-5">
          {images.map((img, index) => (
            <div 
              key={index} 
              onClick={() => setActiveImg(img)}
              className={`cursor-pointer rounded-xl overflow-hidden shadow-md h-16 sm:h-24 md:h-36 relative transition-all duration-300 border-4 ${
                activeImg === img 
                  ? 'border-brand scale-105 shadow-xl' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img 
                src={img} 
                alt={`Life at Isma thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifeAtIsma;
