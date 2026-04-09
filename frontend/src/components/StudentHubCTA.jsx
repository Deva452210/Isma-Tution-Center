import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const StudentHubCTA = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 mb-4">
      {/* Container simulating the reference UI but with a purple shade */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ">

        {/* Left Section: Icon and Text */}
        <div className="flex items-center gap-5 w-full sm:w-auto">

          {/* Circular Purple Icon Box */}
          <div className="bg-purple-500 min-w-[56px] h-[56px] rounded-full flex items-center justify-center text-white shadow-[0_4px_14px_0_rgba(168,85,247,0.39)]">
            <BookOpen className="w-7 h-7" strokeWidth={2.5} />
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-[1.15rem] font-bold text-gray-900 leading-tight mb-0.5">
              Student's Hub
            </h3>
            <p className="text-gray-600 text-[0.95rem]">
              Access free handwritten notes and previous year question papers.
            </p>
          </div>

        </div>

        {/* Right Section: Action Button instead of close (x) button */}
        <div className="flex-shrink-0 w-full sm:w-auto sm:ml-auto">
          <Link
            href="/students-hub"
            className="flex items-center justify-center px-6 py-2.5 bg-white text-gray-900 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-all text-[0.95rem] w-full"
          >
            Explore Hub
          </Link>
        </div>

      </div>
    </section>
  );
};

export default StudentHubCTA;
