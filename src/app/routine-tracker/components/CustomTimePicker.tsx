'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomTimePickerProps {
  value: string; // HH:MM format
  onChange: (value: string) => void;
  className?: string;
}

export default function CustomTimePicker({ value, onChange, className = '' }: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, minutes] = value.split(':').map(Number) || [9, 0];
  const [selectedHour, setSelectedHour] = useState(hours || 9);
  const [selectedMinute, setSelectedMinute] = useState(minutes || 0);
  const pickerRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Update local state when value prop changes
  useEffect(() => {
    const [h, m] = value.split(':').map(Number) || [9, 0];
    setSelectedHour(h || 9);
    setSelectedMinute(m || 0);
  }, [value]);

  const formatTime = (h: number, m: number): string => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour);
    onChange(formatTime(hour, selectedMinute));
  };

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute);
    onChange(formatTime(selectedHour, minute));
  };

  const handleInputClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    // Auto-scroll to selected values when opening
    if (newState) {
      setTimeout(() => {
        // Scroll to selected hour
        if (hoursRef.current) {
          const hourButton = hoursRef.current.querySelector(`button:nth-child(${selectedHour + 1})`) as HTMLElement;
          if (hourButton) {
            hourButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        // Scroll to selected minute
        if (minutesRef.current) {
          const minuteButton = minutesRef.current.querySelector(`button:nth-child(${selectedMinute + 1})`) as HTMLElement;
          if (minuteButton) {
            minuteButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
    }
  };

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Input field */}
      <div
        onClick={handleInputClick}
        className="px-3 py-2 text-sm border border-pink-200 dark:border-pink-700/50 rounded-lg focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500 bg-white dark:bg-pink-900/40 text-gray-900 dark:text-white cursor-pointer hover:border-pink-300 dark:hover:border-pink-600 transition-colors flex items-center gap-2 min-w-[100px]"
      >
        <svg className="w-4 h-4 text-pink-600 dark:text-pink-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">{formatTime(selectedHour, selectedMinute)}</span>
        <svg className={`w-4 h-4 text-pink-500 dark:text-pink-400 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown picker */}
      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white dark:bg-pink-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-pink-200 dark:border-pink-700/50 overflow-hidden min-w-[280px]">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatTime(selectedHour, selectedMinute)}</div>
              <div className="text-xs opacity-90 mt-1">Saat ve Dakika Seçin</div>
            </div>
          </div>

          {/* Time selectors */}
          <div className="flex p-4 gap-4 max-h-[300px] overflow-hidden">
            {/* Hours */}
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Saat</div>
              <div ref={hoursRef} className="overflow-y-auto max-h-[240px] pr-2 custom-scrollbar">
                {hoursList.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleHourChange(hour)}
                    className={`
                      w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 mb-1
                      ${
                        selectedHour === hour
                          ? 'bg-pink-500 text-white shadow-md scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-800/50'
                      }
                    `}
                  >
                    {String(hour).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-pink-200 dark:bg-pink-700/50 my-2"></div>

            {/* Minutes */}
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 text-center">Dakika</div>
              <div ref={minutesRef} className="overflow-y-auto max-h-[240px] pr-2 custom-scrollbar">
                {minutesList.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleMinuteChange(minute)}
                    className={`
                      w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-150 mb-1
                      ${
                        selectedMinute === minute
                          ? 'bg-pink-500 text-white shadow-md scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-800/50'
                      }
                    `}
                  >
                    {String(minute).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-pink-200 dark:border-pink-700/50 bg-pink-50 dark:bg-pink-900/30">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
