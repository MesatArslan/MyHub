import { RoutineScheduleItem } from '@/types';
import { 
  CreateRoutineScheduleItemDto,
  UpdateRoutineScheduleItemDto,
  RoutineScheduleItemResponseDto,
  toRoutineScheduleItem,
  toRoutineScheduleItemResponseDto
} from '@/dto/routine.dto';
import { StorageService } from './storage.service';

/**
 * Routine Tracker Service
 * Handles all routine schedule item business logic
 */
export class RoutineTrackerService {
  
  /**
   * Create a new routine schedule item
   */
  static createScheduleItem(dto: CreateRoutineScheduleItemDto, day: string): RoutineScheduleItemResponseDto {
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
    const existingItems = this.getScheduleItemsDomain(day);
    const updatedItems = [...existingItems, item];
    this.saveScheduleItems(updatedItems, day);
    
    return toRoutineScheduleItemResponseDto(item);
  }

  /**
   * Get all schedule items for a specific day
   * Returns Response DTOs for consistent data structure
   */
  static getScheduleItems(day: string): RoutineScheduleItemResponseDto[] {
    const items = StorageService.getRoutineScheduleItems(day);
    return items.map(item => toRoutineScheduleItemResponseDto(item));
  }

  /**
   * Get schedule item by ID
   */
  static getScheduleItemById(id: string, day: string): RoutineScheduleItemResponseDto | null {
    const items = this.getScheduleItemsDomain(day);
    const item = items.find(i => i.id === id);
    return item ? toRoutineScheduleItemResponseDto(item) : null;
  }

  /**
   * Update a schedule item
   */
  static updateScheduleItem(dto: UpdateRoutineScheduleItemDto, day: string): RoutineScheduleItemResponseDto | null {
    const items = this.getScheduleItemsDomain(day);
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
    this.saveScheduleItems(items, day);
    
    return toRoutineScheduleItemResponseDto(updatedItem);
  }

  /**
   * Delete a schedule item
   */
  static deleteScheduleItem(id: string, day: string): boolean {
    const items = this.getScheduleItemsDomain(day);
    const filteredItems = items.filter(i => i.id !== id);
    
    if (filteredItems.length === items.length) {
      return false; // Item not found
    }

    this.saveScheduleItems(filteredItems, day);
    return true;
  }

  /**
   * Reorder schedule items
   */
  static reorderScheduleItems(reorderedItems: RoutineScheduleItemResponseDto[], day: string): void {
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
    
    this.saveScheduleItems(domainItems, day);
  }

  /**
   * Get all schedule items for all days
   */
  static getAllScheduleItems(): Record<string, RoutineScheduleItemResponseDto[]> {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const allItems: Record<string, RoutineScheduleItemResponseDto[]> = {};
    
    days.forEach(day => {
      allItems[day] = this.getScheduleItems(day);
    });
    
    return allItems;
  }

  /**
   * Get domain models directly from storage (internal method)
   */
  private static getScheduleItemsDomain(day: string): RoutineScheduleItem[] {
    return StorageService.getRoutineScheduleItems(day);
  }

  /**
   * Save schedule items (internal method - uses storage service)
   */
  private static saveScheduleItems(items: RoutineScheduleItem[], day: string): void {
    StorageService.saveRoutineScheduleItems(items, day);
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
