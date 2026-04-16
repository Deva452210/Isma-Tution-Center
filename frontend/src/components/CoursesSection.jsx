import React from 'react';
import { FileText, BookOpen, GraduationCap } from 'lucide-react';
import Link from 'next/link';

const CoursesSection = () => {
  const courses = [
    {
      title: "Offline Classes (1st–12th)",
      description: "Structured classroom learning with expert guidance for school students.",
      icon: <GraduationCap className="w-10 h-10 text-brand" />,
      color: "bg-orange-50",
      borderColor: "border-orange-100",
      link: "Explore Campus"
    },
    {
      title: "Free Study Materials",
      description: "Get handwritten notes designed for easy understanding and quick revision.",
      icon: <BookOpen className="w-10 h-10 text-brand" />,
      color: "bg-blue-50",
      borderColor: "border-blue-100",
      link: "View Materials"
    },
    {
      title: "Previous Year Papers",
      description: "Practice with real exam questions to boost confidence and accuracy.",
      icon: <FileText className="w-10 h-10 text-brand" />,
      color: "bg-green-50",
      borderColor: "border-green-100",
      link: "Start Practicing"
    }
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Offerings</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
          We offer diverse learning methods tailored to suit your specific preparation style and environment needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <Link href="/students-hub" key={idx} className={`group relative p-8 rounded-2xl border ${course.borderColor} bg-white shadow-sm md:hover:shadow-xl transition-all duration-300 transform md:hover:-translate-y-2 text-left flex flex-col`}>
              <div className={`w-20 h-20 rounded-2xl ${course.color} flex items-center justify-center mb-6`}>
                {course.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{course.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-8 flex-grow">{course.description}</p>
              <span className="font-bold text-brand group-hover:underline inline-flex items-center">
                {course.link} <span className="ml-2">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
