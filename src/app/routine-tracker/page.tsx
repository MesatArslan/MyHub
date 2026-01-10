'use client';

import { useState, useEffect } from 'react';
import WeeklyDaySelector from './components/WeeklyDaySelector';
import { RoutineScheduleItem } from '@/types';
import { StorageService } from '@/services/storage.service';

export default function RoutineTracker() {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [isEditMode, setIsEditMode] = useState(false);
  const [savedItems, setSavedItems] = useState<RoutineScheduleItem[]>([]);
  const [unsavedItems, setUnsavedItems] = useState<RoutineScheduleItem[]>([]);

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    // Clear unsaved items when changing days
    setUnsavedItems([]);
  };

  // Load saved schedule items when day changes
  useEffect(() => {
    const items = StorageService.getRoutineScheduleItems(selectedDay);
    setSavedItems(items);
  }, [selectedDay]);

  const handleSaveItem = (item: RoutineScheduleItem) => {
    // Add to saved items
    const updatedSavedItems = [...savedItems, { ...item, day: selectedDay }];
    setSavedItems(updatedSavedItems);
    
    // Save to storage
    StorageService.saveRoutineScheduleItems(updatedSavedItems, selectedDay);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = savedItems.filter(item => item.id !== id);
    setSavedItems(updatedItems);
    StorageService.saveRoutineScheduleItems(updatedItems, selectedDay);
  };

  const handleReorderItems = (reorderedItems: RoutineScheduleItem[]) => {
    setSavedItems(reorderedItems);
    StorageService.saveRoutineScheduleItems(reorderedItems, selectedDay);
  };

  const handleAddRoutine = () => {
    const newItem: RoutineScheduleItem = {
      id: Date.now().toString(),
      startTime: '09:00',
      endTime: '10:00',
      whatToDo: '',
      whereToDo: '',
      day: selectedDay,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setUnsavedItems([...unsavedItems, newItem]);
  };

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-pink-900 dark:to-orange-900 -z-10"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Weekly Day Selector with all routine functionality */}
          <WeeklyDaySelector 
            selectedDay={selectedDay} 
            onDayChange={handleDayChange}
            isEditMode={isEditMode}
            onEditModeChange={setIsEditMode}
            savedItems={savedItems}
            unsavedItems={unsavedItems}
            onAddRoutine={handleAddRoutine}
            onSaveItem={handleSaveItem}
            onDeleteItem={handleDeleteItem}
            onUnsavedItemsChange={setUnsavedItems}
            onReorderItems={handleReorderItems}
          />
        </div>
      </div>
    </div>
  );
}

