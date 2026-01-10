'use client';

import { useState } from 'react';
import Link from 'next/link';
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
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ana Sayfa
            </Link>
          </div>
          <h1 className="text-4xl font-bold gradient-warm bg-clip-text text-transparent">
            Haftalık Rutinim
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

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

