'use client';

export interface WeeklyDaySelectorProps {
  selectedDay: string;
  onDayChange: (day: string) => void;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Pazartesi', short: 'Pzt' },
  { key: 'tuesday', label: 'Salı', short: 'Sal' },
  { key: 'wednesday', label: 'Çarşamba', short: 'Çar' },
  { key: 'thursday', label: 'Perşembe', short: 'Per' },
  { key: 'friday', label: 'Cuma', short: 'Cum' },
  { key: 'saturday', label: 'Cumartesi', short: 'Cmt' },
  { key: 'sunday', label: 'Pazar', short: 'Paz' }
];

export default function WeeklyDaySelector({ selectedDay, onDayChange }: WeeklyDaySelectorProps) {
  return (
    <div className="glass rounded-2xl p-6 shadow-2xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Haftalık Program
          </h2>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Her gün için farklı rutinler oluşturun
        </div>
      </div>

      {/* Day Selector Buttons */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day.key}
            onClick={() => onDayChange(day.key)}
            className={`
              relative p-4 rounded-xl transition-all duration-200 font-medium
              ${selectedDay === day.key
                ? 'bg-pink-600 text-white shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
              }
            `}
          >
            {/* Day Indicator */}
            <div className={`
              absolute top-2 right-2 w-2 h-2 rounded-full
              ${selectedDay === day.key 
                ? 'bg-white' 
                : 'bg-pink-400'
              }
            `} />
            
            {/* Day Labels */}
            <div className="text-center">
              <div className="text-lg font-semibold mb-1">
                {day.short}
              </div>
              <div className="text-xs opacity-75">
                {day.label}
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedDay === day.key && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-pink-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Current Day Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Şu anda görüntülenen gün:
            </span>
          </div>
          <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
            {DAYS_OF_WEEK.find(day => day.key === selectedDay)?.label}
          </span>
        </div>
      </div>
    </div>
  );
}
