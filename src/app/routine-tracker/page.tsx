import Link from 'next/link';
import TimeScheduleSection from './components/TimeScheduleSection';
import GoalsSection from './components/GoalsSection';

export default function RoutineTracker() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-pink-900 dark:to-orange-900">
      <div className="container mx-auto px-4 py-8">
        
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
            Günlük Rutinim
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Zaman Çizelgesi Bölümü */}
          <TimeScheduleSection />

          {/* Hedefler Bölümü */}
          <GoalsSection />
        </div>
      </div>
    </div>
  );
}

