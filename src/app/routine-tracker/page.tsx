'use client';

import { useState, useEffect } from 'react';
import WeeklyDaySelector from './components/WeeklyDaySelector';
import { RoutineTrackerService } from '@/services/routine-tracker.service';
import { 
  CreateRoutineScheduleItemDto,
  RoutineScheduleItemResponseDto,
  UpdateRoutineScheduleItemDto,
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
    // Check if this item exists in storage (not just in current savedItems state)
    // This handles the case where item was moved to unsavedItems for editing
    const existingItemInStorage = RoutineTrackerService.getScheduleItemById(item.id, selectedDay);
    
    if (existingItemInStorage) {
      // Update existing item
      const updateDto: UpdateRoutineScheduleItemDto = {
        id: item.id,
        startTime: item.startTime,
        endTime: item.endTime,
        whatToDo: item.whatToDo,
        whereToDo: item.whereToDo,
      };
      
      RoutineTrackerService.updateScheduleItem(updateDto, selectedDay);
    } else {
      // Create new item
      const dto: CreateRoutineScheduleItemDto = toCreateRoutineScheduleItemDto({
        ...item,
        day: selectedDay,
      });
      
      RoutineTrackerService.createScheduleItem(dto, selectedDay);
    }
    
    // Remove from unsaved items
    const updatedUnsavedItems = unsavedItems.filter(i => i.id !== item.id);
    setUnsavedItems(updatedUnsavedItems);
    
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

  const handleEditItem = (item: RoutineScheduleItemResponseDto) => {
    // Convert Response DTO to domain model for editing
    const domainItem: RoutineScheduleItem = {
      id: item.id,
      startTime: item.startTime,
      endTime: item.endTime,
      whatToDo: item.whatToDo,
      whereToDo: item.whereToDo,
      day: item.day,
      createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt),
      updatedAt: item.updatedAt instanceof Date ? item.updatedAt : new Date(item.updatedAt),
    };

    // Remove from saved items
    const updatedSavedItems = savedItems.filter(i => i.id !== item.id);
    setSavedItems(updatedSavedItems);

    // Add to unsaved items for editing
    setUnsavedItems([...unsavedItems, domainItem]);
  };

  const handleReorderItems = (reorderedItems: RoutineScheduleItemResponseDto[]) => {
    RoutineTrackerService.reorderScheduleItems(reorderedItems, selectedDay);
    setSavedItems(reorderedItems);
  };

  // Helper function to convert time string (HH:MM) to minutes
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes to time string (HH:MM)
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const handleAddRoutine = () => {
    // Find the latest end time from saved items and unsaved items
    let latestEndTime = '09:00'; // Default start time
    
    // Check saved items
    if (savedItems.length > 0) {
      const sortedSavedItems = [...savedItems].sort((a, b) => {
        return timeToMinutes(b.endTime) - timeToMinutes(a.endTime);
      });
      latestEndTime = sortedSavedItems[0].endTime;
    }
    
    // Check unsaved items and compare with saved items
    if (unsavedItems.length > 0) {
      const sortedUnsavedItems = [...unsavedItems].sort((a, b) => {
        return timeToMinutes(b.endTime) - timeToMinutes(a.endTime);
      });
      const latestUnsavedEndTime = sortedUnsavedItems[0].endTime;
      
      // Use the later end time
      if (timeToMinutes(latestUnsavedEndTime) > timeToMinutes(latestEndTime)) {
        latestEndTime = latestUnsavedEndTime;
      }
    }
    
    // Set start time to the latest end time
    const startTime = latestEndTime;
    
    // Set end time to 1 hour after start time
    const startMinutes = timeToMinutes(startTime);
    let endMinutes = startMinutes + 60; // Add 1 hour (60 minutes)
    
    // Handle midnight rollover (max 23:59)
    const maxMinutes = 23 * 60 + 59; // 23:59
    if (endMinutes > maxMinutes) {
      endMinutes = maxMinutes;
    }
    
    const endTime = minutesToTime(endMinutes);

    // Create DTO for new item
    const dto: CreateRoutineScheduleItemDto = {
      startTime: startTime,
      endTime: endTime,
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
            onEditItem={handleEditItem}
            onUnsavedItemsChange={setUnsavedItems}
            onReorderItems={handleReorderItems}
          />
        </div>
      </div>
    </div>
  );
}

