import Hero from '../components/Hero';
import SummerClasses from '../components/SummerClasses';
import StatsSection from '../components/StatsSection';
import FacultySection from '../components/FacultySection';
import CoursesSection from '../components/CoursesSection';
import SuccessStories from '../components/SuccessStories';
import LifeAtIsma from '../components/LifeAtIsma';
import Testimonials from '../components/Testimonials';
import StudentHubCTA from '../components/StudentHubCTA';
import EnrollmentCTA from '../components/EnrollmentCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <SummerClasses />
      <StatsSection />
      <SuccessStories />
      <FacultySection />
      <CoursesSection />
      {/* <LifeAtIsma /> */}
      <Testimonials />
      <StudentHubCTA />

      {/* Short Call to action section at the bottom */}
      <EnrollmentCTA />
    </>
  );
}
