'use client';

import { RoutineScheduleItem } from '@/types';

interface RoutineScheduleDisplayProps {
  scheduleItems: RoutineScheduleItem[];
  onDeleteItem?: (id: string) => void;
}

export default function RoutineScheduleDisplay({ scheduleItems, onDeleteItem }: RoutineScheduleDisplayProps) {
  // Sort items by start time
  const sortedItems = [...scheduleItems].sort((a, b) => {
    const timeA = a.startTime.replace(':', '');
    const timeB = b.startTime.replace(':', '');
    return parseInt(timeA) - parseInt(timeB);
  });

  if (sortedItems.length === 0) {
    return null;
  }

  return (
    <div className="glass rounded-2xl p-6 shadow-2xl mt-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Rutin Programı
      </h3>
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Zaman */}
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.startTime} - {item.endTime}
                </span>
              </div>

              {/* Ne Yapacağım */}
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.whatToDo}
                </span>
              </div>

              {/* Nerede Yapacağım */}
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.whereToDo}
                </span>
              </div>

              {/* Sil Butonu (if onDeleteItem is provided) */}
              {onDeleteItem && (
                <div className="flex justify-end">
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    title="Rutin Öğesini Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

