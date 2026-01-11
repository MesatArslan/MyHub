import { RoutineScheduleItem } from '@/types';
import { 
  CreateRoutineScheduleItemDto,
  UpdateRoutineScheduleItemDto,
  RoutineScheduleItemResponseDto,
  toRoutineScheduleItem,
  toRoutineScheduleItemResponseDto
} from '@/dto/routine.dto';
import { StorageService } from './storage.service';

export interface RoutineProgram {
  id: string;
  name: string;
  day: string;
}

/**
 * Routine Tracker Service
 * Handles all routine schedule item business logic
 */
export class RoutineTrackerService {
  
  /**
   * Program management methods
   */
  static getPrograms(day: string): RoutineProgram[] {
    return StorageService.getRoutinePrograms(day);
  }

  static createProgram(program: RoutineProgram): void {
    StorageService.saveRoutineProgram(program);
  }

  static deleteProgram(programId: string, day: string): void {
    StorageService.deleteRoutineProgram(programId, day);
    // Also delete all schedule items for this program
    StorageService.deleteRoutineScheduleItems(day, programId);
  }

  static updateProgramName(programId: string, day: string, newName: string): void {
    const programs = this.getPrograms(day);
    const program = programs.find(p => p.id === programId);
    if (program) {
      program.name = newName;
      StorageService.saveRoutineProgram(program);
    }
  }

  static getSelectedProgram(day: string): string | null {
    return StorageService.getSelectedProgram(day);
  }

  static saveSelectedProgram(day: string, programId: string): void {
    StorageService.saveSelectedProgram(day, programId);
  }

  /**
   * Create a new routine schedule item
   */
  static createScheduleItem(dto: CreateRoutineScheduleItemDto, day: string, programId: string = 'default'): RoutineScheduleItemResponseDto {
    // Validate input
    this.validateCreateScheduleItemDto(dto);
    
    // Transform DTO to domain model
    const domainItem = toRoutineScheduleItem(dto);
    const now = new Date();
    const item: RoutineScheduleItem = {
      ...domainItem,
      day,
      createdAt: now,
      updatedAt: now,
    };

    // Save to storage - get domain models directly
    const existingItems = this.getScheduleItemsDomain(day, programId);
    const updatedItems = [...existingItems, item];
    this.saveScheduleItems(updatedItems, day, programId);
    
    return toRoutineScheduleItemResponseDto(item);
  }

  /**
   * Get all schedule items for a specific day and program
   * Returns Response DTOs for consistent data structure
   */
  static getScheduleItems(day: string, programId: string = 'default'): RoutineScheduleItemResponseDto[] {
    const items = StorageService.getRoutineScheduleItems(day, programId);
    return items.map(item => toRoutineScheduleItemResponseDto(item));
  }

  /**
   * Get schedule item by ID
   */
  static getScheduleItemById(id: string, day: string, programId: string = 'default'): RoutineScheduleItemResponseDto | null {
    const items = this.getScheduleItemsDomain(day, programId);
    const item = items.find(i => i.id === id);
    return item ? toRoutineScheduleItemResponseDto(item) : null;
  }

  /**
   * Update a schedule item
   */
  static updateScheduleItem(dto: UpdateRoutineScheduleItemDto, day: string, programId: string = 'default'): RoutineScheduleItemResponseDto | null {
    const items = this.getScheduleItemsDomain(day, programId);
    const index = items.findIndex(i => i.id === dto.id);
    
    if (index === -1) {
      return null;
    }

    // Get existing item and merge with updates
    const existingItem = items[index];
    const updateDto: CreateRoutineScheduleItemDto = {
      startTime: dto.startTime ?? existingItem.startTime,
      endTime: dto.endTime ?? existingItem.endTime,
      whatToDo: dto.whatToDo ?? existingItem.whatToDo,
      whereToDo: dto.whereToDo !== undefined ? dto.whereToDo : existingItem.whereToDo,
      day: existingItem.day,
    };

    // Transform to domain model
    const updatedDomainItem = toRoutineScheduleItem(updateDto, dto.id);
    const updatedItem: RoutineScheduleItem = {
      ...updatedDomainItem,
      createdAt: existingItem.createdAt,
      updatedAt: new Date(),
    };

    // Update in array
    items[index] = updatedItem;
    this.saveScheduleItems(items, day, programId);
    
    return toRoutineScheduleItemResponseDto(updatedItem);
  }

  /**
   * Delete a schedule item
   */
  static deleteScheduleItem(id: string, day: string, programId: string = 'default'): boolean {
    const items = this.getScheduleItemsDomain(day, programId);
    const filteredItems = items.filter(i => i.id !== id);
    
    if (filteredItems.length === items.length) {
      return false; // Item not found
    }

    this.saveScheduleItems(filteredItems, day, programId);
    return true;
  }

  /**
   * Reorder schedule items
   */
  static reorderScheduleItems(reorderedItems: RoutineScheduleItemResponseDto[], day: string, programId: string = 'default'): void {
    // Convert Response DTOs back to domain models for storage
    const domainItems: RoutineScheduleItem[] = reorderedItems.map(dto => {
      const domainItem = toRoutineScheduleItem({
        startTime: dto.startTime,
        endTime: dto.endTime,
        whatToDo: dto.whatToDo,
        whereToDo: dto.whereToDo,
        day: dto.day,
      }, dto.id);
      
      return {
        ...domainItem,
        createdAt: dto.createdAt instanceof Date ? dto.createdAt : new Date(dto.createdAt),
        updatedAt: dto.updatedAt instanceof Date ? dto.updatedAt : new Date(dto.updatedAt),
      } as RoutineScheduleItem;
    });
    
    this.saveScheduleItems(domainItems, day, programId);
  }

  /**
   * Get domain models directly from storage (internal method)
   */
  private static getScheduleItemsDomain(day: string, programId: string = 'default'): RoutineScheduleItem[] {
    return StorageService.getRoutineScheduleItems(day, programId);
  }

  /**
   * Save schedule items (internal method - uses storage service)
   */
  private static saveScheduleItems(items: RoutineScheduleItem[], day: string, programId: string = 'default'): void {
    StorageService.saveRoutineScheduleItems(items, day, programId);
  }

  /**
   * Validate Create DTO
   */
  private static validateCreateScheduleItemDto(dto: CreateRoutineScheduleItemDto): void {
    if (!dto.startTime || !dto.endTime || !dto.whatToDo) {
      throw new Error('Başlangıç zamanı, bitiş zamanı ve ne yapacağınız alanları zorunludur');
    }
    
    // Validate time format
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(dto.startTime) || !timeRegex.test(dto.endTime)) {
      throw new Error('Geçersiz zaman formatı. HH:MM formatında olmalıdır');
    }
    
    // Validate end time is after start time
    const startMinutes = this.timeToMinutes(dto.startTime);
    const endMinutes = this.timeToMinutes(dto.endTime);
    if (endMinutes <= startMinutes) {
      throw new Error('Bitiş zamanı başlangıç zamanından sonra olmalıdır');
    }
  }

  /**
   * Convert time string (HH:MM) to minutes
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
