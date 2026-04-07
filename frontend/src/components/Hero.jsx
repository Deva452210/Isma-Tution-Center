import React from 'react';

import heroImg from '../assets/hero.webp';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 flex items-center" style={{ minHeight: '600px' }}>
      {/* Background with subtle gradient or image placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white -z-10"></div>

      <div className="container mx-auto px-4 py-16 flex flex-col items-start justify-center">
        <div className="max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-brand text-sm font-semibold mb-4 border border-green-200">
            Admissions Open 2026
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Your Gateway for your <br className="hidden md:block" />
            <span className="text-brand">Dream to Success</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            A dedicated Maths tuition center for 10th, 11th, and 12th students focused on concept clarity and top board exam scores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-brand text-white font-semibold rounded shadow-lg hover:shadow-xl hover-scale text-lg">
              Explore Us
            </button>
            <button className="px-8 py-4 bg-white text-gray-900 border border-gray-300 font-semibold rounded shadow hover:bg-gray-50 transition-colors text-lg">
              Contact Us
            </button>
          </div>

          {/* <div className="mt-12 flex items-center space-x-8">
            <div>
              <p className="text-3xl font-bold text-gray-900">30+</p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">10+</p>
              <p className="text-sm text-gray-500">Centums</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">10+</p>
              <p className="text-sm text-gray-500">90% above</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* Decorative right side image shape placeholder */}
      <div className="hidden lg:block absolute right-0 bottom-0 top-0 w-1/2 bg-green-500 bg-opacity-5" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
        <div className="w-full h-full flex items-center justify-center">
          {/* Here a real image would go, but for layout recreation we mock a placeholder shape */}
          <img className="w-full h-full object-cover" src={heroImg.src} alt="heroImg" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
