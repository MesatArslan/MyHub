import { Routine, RoutineCategory, Priority, DayOfWeek, RoutineCompletion, RoutineScheduleItem } from '@/types';

// Request DTOs
export interface CreateRoutineRequestDto {
  title: string;
  description?: string;
  category: RoutineCategory;
  priority: Priority;
  estimatedDuration: number;
  isActive?: boolean;
  daysOfWeek: DayOfWeek[];
  timeOfDay?: string;
}

export interface UpdateRoutineRequestDto {
  id: string;
  title?: string;
  description?: string;
  category?: RoutineCategory;
  priority?: Priority;
  estimatedDuration?: number;
  isActive?: boolean;
  daysOfWeek?: DayOfWeek[];
  timeOfDay?: string;
}

export interface CompleteRoutineRequestDto {
  routineId: string;
  duration?: number;
  notes?: string;
  rating?: number;
}

export interface SearchRoutineRequestDto {
  query?: string;
  category?: RoutineCategory;
  priority?: Priority;
  isActive?: boolean;
  dayOfWeek?: DayOfWeek;
  sortBy?: 'title' | 'priority' | 'createdAt' | 'streakCount';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Response DTOs
export interface RoutineResponseDto {
  id: string;
  title: string;
  description?: string;
  category: RoutineCategory;
  priority: Priority;
  estimatedDuration: number;
  isActive: boolean;
  daysOfWeek: DayOfWeek[];
  timeOfDay?: string;
  streakCount: number;
  lastCompleted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutineListResponseDto {
  routines: RoutineResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RoutineStatsResponseDto {
  totalRoutines: number;
  activeRoutines: number;
  completedToday: number;
  totalStreakDays: number;
  categoryCounts: Record<RoutineCategory, number>;
  priorityCounts: Record<Priority, number>;
  topRoutines: RoutineResponseDto[];
}

export interface RoutineCompletionResponseDto {
  id: string;
  routineId: string;
  completedAt: Date;
  duration?: number;
  notes?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Transform functions
export const toRoutineResponseDto = (routine: Routine): RoutineResponseDto => ({
  id: routine.id,
  title: routine.title,
  description: routine.description,
  category: routine.category,
  priority: routine.priority,
  estimatedDuration: routine.estimatedDuration,
  isActive: routine.isActive,
  daysOfWeek: routine.daysOfWeek,
  timeOfDay: routine.timeOfDay,
  streakCount: routine.streakCount,
  lastCompleted: routine.lastCompleted,
  createdAt: routine.createdAt,
  updatedAt: routine.updatedAt,
});

export const toRoutineEntry = (dto: CreateRoutineRequestDto, id?: string): Omit<Routine, 'createdAt' | 'updatedAt' | 'streakCount' | 'lastCompleted'> => ({
  id: id || generateId(),
  title: dto.title,
  description: dto.description,
  category: dto.category,
  priority: dto.priority,
  estimatedDuration: dto.estimatedDuration,
  isActive: dto.isActive ?? true,
  daysOfWeek: dto.daysOfWeek,
  timeOfDay: dto.timeOfDay,
});

export const toRoutineCompletion = (dto: CompleteRoutineRequestDto, id?: string): Omit<RoutineCompletion, 'createdAt' | 'updatedAt'> => ({
  id: id || generateId(),
  routineId: dto.routineId,
  completedAt: new Date(),
  duration: dto.duration,
  notes: dto.notes,
  rating: dto.rating,
});

// Routine Schedule Item DTOs
export interface CreateRoutineScheduleItemDto {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  whatToDo: string;
  whereToDo?: string; // Optional
  day: string;
}

export interface UpdateRoutineScheduleItemDto {
  id: string;
  startTime?: string;
  endTime?: string;
  whatToDo?: string;
  whereToDo?: string;
}

export interface RoutineScheduleItemResponseDto {
  id: string;
  startTime: string;
  endTime: string;
  whatToDo: string;
  whereToDo?: string; // Optional
  day: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transform functions for schedule items
export const toRoutineScheduleItem = (dto: CreateRoutineScheduleItemDto, id?: string): Omit<RoutineScheduleItem, 'createdAt' | 'updatedAt'> => ({
  id: id || generateId(),
  startTime: dto.startTime,
  endTime: dto.endTime,
  whatToDo: dto.whatToDo,
  whereToDo: dto.whereToDo, // Preserve optional nature
  day: dto.day,
});

export const toRoutineScheduleItemResponseDto = (item: RoutineScheduleItem): RoutineScheduleItemResponseDto => ({
  id: item.id,
  startTime: item.startTime,
  endTime: item.endTime,
  whatToDo: item.whatToDo,
  whereToDo: item.whereToDo,
  day: item.day,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

// Transform from domain model to Create DTO
export const toCreateRoutineScheduleItemDto = (item: RoutineScheduleItem): CreateRoutineScheduleItemDto => ({
  startTime: item.startTime,
  endTime: item.endTime,
  whatToDo: item.whatToDo,
  whereToDo: item.whereToDo,
  day: item.day,
});

// Helper functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

