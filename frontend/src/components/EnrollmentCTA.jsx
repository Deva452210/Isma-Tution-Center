"use client";
import { useState } from 'react';
import EnrollmentModal from './EnrollmentModal';

export default function EnrollmentCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* The CTA Section */}
      <section className="bg-brand text-white py-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to boost your academic performance?</h2>
        <p className="text-sm mb-8 opacity-90">Join ISMA Academy and start learning with expert guidance, notes & practice.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-brand px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          Enroll Now
        </button>
      </section>

      {/* The Modal Component */}
      <EnrollmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
