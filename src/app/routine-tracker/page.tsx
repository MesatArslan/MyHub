'use client';

import { useState } from 'react';
import TimeScheduleSection from './components/TimeScheduleSection';
import GoalsSection from './components/GoalsSection';
import WeeklyDaySelector from './components/WeeklyDaySelector';

export default function RoutineTracker() {
  const [selectedDay, setSelectedDay] = useState('monday');

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-pink-900 dark:to-orange-900 -z-10"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Weekly Day Selector */}
          <WeeklyDaySelector selectedDay={selectedDay} onDayChange={handleDayChange} />

          {/* Zaman Çizelgesi Bölümü */}
          <TimeScheduleSection selectedDay={selectedDay} />

          {/* Hedefler Bölümü */}
          <GoalsSection />
        </div>
      </div>
    </div>
  );
}

