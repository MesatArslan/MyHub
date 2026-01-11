'use client';

import { useState } from 'react';
import { RoutineScheduleItem } from '@/types';
import { RoutineScheduleItemResponseDto } from '@/dto/routine.dto';
import CustomTimePicker from './CustomTimePicker';

export interface WeeklyDaySelectorProps {
  selectedDay: string;
  onDayChange: (day: string) => void;
  isEditMode?: boolean;
  onEditModeChange?: (editMode: boolean) => void;
  savedItems?: RoutineScheduleItemResponseDto[];
  unsavedItems?: RoutineScheduleItem[];
  onAddRoutine?: () => void;
  onSaveItem?: (item: RoutineScheduleItem) => void;
  onDeleteItem?: (id: string) => void;
  onEditItem?: (item: RoutineScheduleItemResponseDto) => void;
  onUnsavedItemsChange?: (items: RoutineScheduleItem[]) => void;
  onReorderItems?: (items: RoutineScheduleItemResponseDto[]) => void;
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

export default function WeeklyDaySelector({ 
  selectedDay, 
  onDayChange, 
  isEditMode = false, 
  onEditModeChange,
  savedItems = [],
  unsavedItems = [],
  onAddRoutine,
  onSaveItem,
  onDeleteItem,
  onEditItem,
  onUnsavedItemsChange,
  onReorderItems
}: WeeklyDaySelectorProps) {
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // In edit mode, use original order; otherwise sort by start time
  const displayItems = isEditMode ? savedItems : [...savedItems].sort((a, b) => {
    const timeA = a.startTime.replace(':', '');
    const timeB = b.startTime.replace(':', '');
    return parseInt(timeA) - parseInt(timeB);
  });

  const handleDragStart = (index: number) => {
    if (!isEditMode || !onReorderItems) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || !onReorderItems || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reorderedItems = [...savedItems];
    const [draggedItem] = reorderedItems.splice(draggedIndex, 1);
    reorderedItems.splice(dropIndex, 0, draggedItem);
    
    onReorderItems(reorderedItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const updateScheduleItem = (id: string, field: keyof RoutineScheduleItem, value: string) => {
    if (!onUnsavedItemsChange) return;
    const updatedItems = unsavedItems.map(item =>
      item.id === id ? { ...item, [field]: value, updatedAt: new Date() } : item
    );
    onUnsavedItemsChange(updatedItems);
  };

  const deleteScheduleItem = (id: string) => {
    if (!onUnsavedItemsChange) return;
    const updatedItems = unsavedItems.filter(item => item.id !== id);
    onUnsavedItemsChange(updatedItems);
  };

  const saveScheduleItem = (item: RoutineScheduleItem) => {
    if (!onSaveItem || !onUnsavedItemsChange) return;
    // Validate that required fields are filled (location is optional)
    if (!item.startTime || !item.endTime || !item.whatToDo) {
      alert('Lütfen başlangıç zamanı, bitiş zamanı ve ne yapacağınızı doldurun');
      return;
    }
    
    // Save the item
    onSaveItem(item);
    
    // Remove from unsaved items
    const updatedItems = unsavedItems.filter(i => i.id !== item.id);
    onUnsavedItemsChange(updatedItems);
  };

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
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Her gün için farklı rutinler oluşturun
          </div>
          {onEditModeChange && (
            <button
              onClick={() => onEditModeChange(!isEditMode)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                isEditMode
                  ? 'bg-pink-600 text-white hover:bg-pink-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {isEditMode ? 'Düzenleme Modu' : 'Düzenle'}
            </button>
          )}
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

      {/* Add Routine Button - Show under days boxes when in edit mode */}
      {isEditMode && onAddRoutine && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={onAddRoutine}
            className="flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Rutin Ekle
          </button>
        </div>
      )}

      {/* Display saved schedule items - Always visible under the button */}
      {displayItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Rutin Programı
          </h3>
          <div className="space-y-2">
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                draggable={isEditMode && !!onReorderItems}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  hover:bg-pink-50 dark:hover:bg-gray-700/50
                  ${isEditMode && onReorderItems ? 'cursor-move' : ''}
                  ${draggedIndex === index ? 'opacity-50' : ''}
                  ${dragOverIndex === index ? 'bg-pink-100 dark:bg-pink-900/20 border-l-4 border-pink-500' : ''}
                `}
              >
                {/* Drag handle icon (only in edit mode) */}
                {isEditMode && onReorderItems && (
                  <div className="flex-shrink-0 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                )}

                {/* Content - All on same row */}
                <div className="flex-1 flex items-center gap-4 min-w-0">
                  {/* Time */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <svg className="w-4 h-4 text-pink-600 dark:text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-pink-700 dark:text-pink-200 whitespace-nowrap">
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>

                  {/* What to do */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.whatToDo}
                    </span>
                  </div>

                  {/* Where to do - Only show if exists */}
                  {item.whereToDo && item.whereToDo.trim() !== '' && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="whitespace-nowrap">{item.whereToDo}</span>
                    </div>
                  )}

                  {/* Edit and Delete buttons (if in edit mode) */}
                  {isEditMode && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onEditItem && (
                        <button
                          onClick={() => onEditItem(item)}
                          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200"
                          title="Rutin Öğesini Düzenle"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {onDeleteItem && (
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200"
                          title="Rutin Öğesini Sil"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form rows for unsaved items - Show under saved items when in edit mode */}
      {isEditMode && unsavedItems.length > 0 && (
        <div className="mt-4 space-y-2">
          {unsavedItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200 bg-white/80 dark:bg-pink-900/30 backdrop-blur-sm border-2 border-dashed border-pink-300 dark:border-pink-700/50 shadow-sm"
            >
              {/* Content - All on same row */}
              <div className="flex-1 flex items-center gap-3 min-w-0">
                {/* Time inputs */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <CustomTimePicker
                    value={item.startTime}
                    onChange={(value) => updateScheduleItem(item.id, 'startTime', value)}
                  />
                  <span className="text-pink-400 dark:text-pink-400 font-medium">-</span>
                  <CustomTimePicker
                    value={item.endTime}
                    onChange={(value) => updateScheduleItem(item.id, 'endTime', value)}
                  />
                </div>

                {/* What to do */}
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={item.whatToDo}
                    onChange={(e) => updateScheduleItem(item.id, 'whatToDo', e.target.value)}
                    placeholder="Ne yapacağım?"
                    className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-pink-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-pink-900/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                  />
                </div>

                {/* Where to do */}
                <div className="flex-shrink-0 min-w-[150px]">
                  <input
                    type="text"
                    value={item.whereToDo}
                    onChange={(e) => updateScheduleItem(item.id, 'whereToDo', e.target.value)}
                    placeholder="Nerede? (opsiyonel)"
                    className="w-full px-3 py-2 text-sm border border-pink-200 dark:border-pink-700/50 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white dark:bg-pink-900/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
                  />
                </div>

                {/* Save button */}
                <button
                  onClick={() => saveScheduleItem(item)}
                  className="flex-shrink-0 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow"
                  title="Kaydet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Kaydet</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={() => deleteScheduleItem(item.id)}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                  title="Rutin Öğesini Sil"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
