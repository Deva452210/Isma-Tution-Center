import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import CoursesSection from '../components/CoursesSection';
import SuccessStories from '../components/SuccessStories';
import LifeAtIsma from '../components/LifeAtIsma';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <SuccessStories />
      <CoursesSection />
      <LifeAtIsma />
      <Testimonials />

      {/* Short Call to action section at the bottom */}
      <section className="bg-brand text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to boost your academic performance?</h2>
        <p className="text-xl mb-8 opacity-90">Join ISMA Academy and start learning with expert guidance, notes & practice.</p>
        <button className="bg-white text-brand px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1">
          Enroll Now
        </button>
      </section>
    </>
  );
}
