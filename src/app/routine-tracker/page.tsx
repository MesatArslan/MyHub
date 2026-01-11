'use client';

import { useState, useEffect } from 'react';
import WeeklyDaySelector from './components/WeeklyDaySelector';
import { RoutineTrackerService } from '@/services/routine-tracker.service';
import { 
  CreateRoutineScheduleItemDto,
  RoutineScheduleItemResponseDto,
  toRoutineScheduleItem,
  toCreateRoutineScheduleItemDto
} from '@/dto/routine.dto';
import { RoutineScheduleItem } from '@/types';

export default function RoutineTracker() {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [isEditMode, setIsEditMode] = useState(false);
  const [savedItems, setSavedItems] = useState<RoutineScheduleItemResponseDto[]>([]);
  const [unsavedItems, setUnsavedItems] = useState<RoutineScheduleItem[]>([]);

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    // Clear unsaved items when changing days
    setUnsavedItems([]);
  };

  // Load saved schedule items when day changes
  useEffect(() => {
    const items = RoutineTrackerService.getScheduleItems(selectedDay);
    setSavedItems(items);
  }, [selectedDay]);

  const handleSaveItem = (item: RoutineScheduleItem) => {
    // Convert domain model to Create DTO
    const dto: CreateRoutineScheduleItemDto = toCreateRoutineScheduleItemDto({
      ...item,
      day: selectedDay,
    });

    // Use service to create and save (returns Response DTO)
    RoutineTrackerService.createScheduleItem(dto, selectedDay);
    
    // Reload items to get updated list (now returns Response DTOs)
    const updatedItems = RoutineTrackerService.getScheduleItems(selectedDay);
    setSavedItems(updatedItems);
  };

  const handleDeleteItem = (id: string) => {
    RoutineTrackerService.deleteScheduleItem(id, selectedDay);
    
    // Reload items to get updated list (now returns Response DTOs)
    const updatedItems = RoutineTrackerService.getScheduleItems(selectedDay);
    setSavedItems(updatedItems);
  };

  const handleReorderItems = (reorderedItems: RoutineScheduleItemResponseDto[]) => {
    RoutineTrackerService.reorderScheduleItems(reorderedItems, selectedDay);
    setSavedItems(reorderedItems);
  };

  const handleAddRoutine = () => {
    // Create DTO for new item
    const dto: CreateRoutineScheduleItemDto = {
      startTime: '09:00',
      endTime: '10:00',
      whatToDo: '',
      whereToDo: undefined, // Optional field
      day: selectedDay,
    };

    // Transform DTO to domain model
    const newItem = toRoutineScheduleItem(dto);
    const domainItem: RoutineScheduleItem = {
      ...newItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUnsavedItems([...unsavedItems, domainItem]);
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

