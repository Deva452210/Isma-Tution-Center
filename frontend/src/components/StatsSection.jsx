import React from 'react';
import { Users, Award, Trophy } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      title: "5+",
      subtitle: "Batches",

      icon: <Users className="w-6 h-6 text-brand" />
    },
    {
      title: "40+",
      subtitle: "Students Trained",

      icon: <Users className="w-6 h-6 text-brand" />
    },
    {
      title: "10+",
      subtitle: "100/100 in Maths",

      icon: <Award className="w-6 h-6 text-brand" />
    },
    {
      title: "100%",
      subtitle: "Board Exam Pass Rate",

      icon: <Trophy className="w-6 h-6 text-brand" />
    }
  ];

  return (
    <section className="py-16 bg-white shrink-0">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Numbers That Define Our Success</h2>
          <div className="w-24 h-1 bg-brand mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 md:p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 md:mb-6">
                {stat.icon}
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-1 md:mb-2">{stat.title}</h3>
              <p className="text-sm md:text-lg text-gray-700 font-medium mb-2 md:mb-4">{stat.subtitle}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
