'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const dropdownWidth = 220;
        const dropdownHeight = 280;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let top = rect.bottom ;
        let left = rect.left;
        
        if (top + dropdownHeight > viewportHeight) {
          top = rect.top - dropdownHeight - 64;
          if (top < 0) {
            top = 8;
          }
        }
        
        if (left + dropdownWidth > viewportWidth) {
          left = viewportWidth - dropdownWidth - 8;
        }
        
        if (left < 0) {
          left = 8;
        }
        
        setDropdownPosition({ top, left });
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      updatePosition(); // Initial position update
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        pickerRef.current && 
        !pickerRef.current.contains(target) &&
        !(target as Element).closest('[data-time-picker-dropdown]')
      ) {
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
    
    // Calculate dropdown position when opening
    if (newState && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const dropdownWidth = 220;
      const dropdownHeight = 280; // Approximate height
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate position
      let top = rect.bottom + 8;
      let left = rect.left;
      
      // Adjust if dropdown would go off bottom of screen
      if (top + dropdownHeight > viewportHeight) {
        top = rect.top - dropdownHeight - 8; // Show above instead
        // If still off screen, position at top of viewport
        if (top < 0) {
          top = 8;
        }
      }
      
      // Adjust if dropdown would go off right edge of screen
      if (left + dropdownWidth > viewportWidth) {
        left = viewportWidth - dropdownWidth - 8;
      }
      
      // Adjust if dropdown would go off left edge of screen
      if (left < 0) {
        left = 8;
      }
      
      setDropdownPosition({
        top,
        left,
      });
    }
    
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
    <div className={`relative z-10 ${className}`} ref={pickerRef}>
      {/* Input field */}
      <div
        ref={inputRef}
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
      {isOpen && typeof window !== 'undefined' && createPortal(
        <div 
          data-time-picker-dropdown
          className="fixed z-40 bg-white dark:bg-pink-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-pink-200 dark:border-pink-700/50 overflow-hidden w-[220px] max-h-[90vh]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            <div className="text-center">
              <div className="text-xl font-bold">{formatTime(selectedHour, selectedMinute)}</div>
              <div className="text-[10px] opacity-90 mt-0.5">Saat ve Dakika Seçin</div>
            </div>
          </div>

          {/* Time selectors */}
          <div className="flex p-2 gap-2 overflow-hidden" style={{ maxHeight: 'calc(90vh - 100px)' }}>
            {/* Hours */}
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1 text-center">Saat</div>
              <div ref={hoursRef} className="overflow-y-auto max-h-[200px] pr-1 custom-scrollbar">
                {hoursList.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleHourChange(hour)}
                    className={`
                      w-full py-1 px-2 rounded-md text-xs font-medium transition-all duration-150 mb-0.5
                      ${
                        selectedHour === hour
                          ? 'bg-pink-500 text-white shadow-sm scale-105'
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
            <div className="w-px bg-pink-200 dark:bg-pink-700/50 my-1"></div>

            {/* Minutes */}
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 mb-1 text-center">Dakika</div>
              <div ref={minutesRef} className="overflow-y-auto max-h-[200px] pr-1 custom-scrollbar">
                {minutesList.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleMinuteChange(minute)}
                    className={`
                      w-full py-1 px-2 rounded-md text-xs font-medium transition-all duration-150 mb-0.5
                      ${
                        selectedMinute === minute
                          ? 'bg-pink-500 text-white shadow-sm scale-105'
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
          <div className="px-3 py-2 border-t border-pink-200 dark:border-pink-700/50 bg-pink-50 dark:bg-pink-900/30">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors duration-200 font-medium text-xs"
            >
              Tamam
            </button>
          </div>
        </div>
        , document.body
      )}
    </div>
  );
}
