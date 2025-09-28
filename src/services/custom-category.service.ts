import { CustomCategory } from '@/types';
import { StorageService } from './storage.service';

/**
 * Custom Category Service
 * Handles custom category management
 */
export class CustomCategoryService {
  
  /**
   * Get all custom categories
   */
  static getCustomCategories(): CustomCategory[] {
    return StorageService.getCustomCategories();
  }

  /**
   * Create a new custom category
   */
  static createCustomCategory(name: string, color: string, icon?: string, description?: string): CustomCategory {
    if (!name?.trim()) {
      throw new Error('Kategori adı gereklidir');
    }

    if (!color?.trim()) {
      throw new Error('Kategori rengi gereklidir');
    }

    // Check if category name already exists
    const existingCategories = this.getCustomCategories();
    if (existingCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      throw new Error('Bu isimde bir kategori zaten mevcut');
    }

    const now = new Date();
    const category: CustomCategory = {
      id: this.generateId(),
      name: name.trim(),
      color: color.trim(),
      icon: icon?.trim(),
      description: description?.trim(),
      createdAt: now,
      updatedAt: now
    };

    StorageService.addCustomCategory(category);
    return category;
  }

  /**
   * Update a custom category
   */
  static updateCustomCategory(id: string, updates: Partial<Omit<CustomCategory, 'id' | 'createdAt'>>): CustomCategory | null {
    const categories = this.getCustomCategories();
    const category = categories.find(c => c.id === id);
    
    if (!category) {
      return null;
    }

    // Check if new name conflicts with existing categories (excluding current one)
    if (updates.name && updates.name.toLowerCase() !== category.name.toLowerCase()) {
      if (categories.some(cat => cat.id !== id && cat.name.toLowerCase() === updates.name!.toLowerCase())) {
        throw new Error('Bu isimde bir kategori zaten mevcut');
      }
    }

    const updatedCategory: CustomCategory = {
      ...category,
      ...updates,
      updatedAt: new Date()
    };

    StorageService.updateCustomCategory(updatedCategory);
    return updatedCategory;
  }

  /**
   * Delete a custom category
   */
  static deleteCustomCategory(id: string): boolean {
    const categories = this.getCustomCategories();
    const categoryExists = categories.some(c => c.id === id);
    
    if (categoryExists) {
      StorageService.deleteCustomCategory(id);
      return true;
    }
    
    return false;
  }

  /**
   * Get category by ID
   */
  static getCategoryById(id: string): CustomCategory | null {
    const categories = this.getCustomCategories();
    return categories.find(c => c.id === id) || null;
  }

  /**
   * Predefined colors for categories
   */
  static getPredefinedColors(): string[] {
    return [
      '#3B82F6', // Blue
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Violet
      '#EC4899', // Pink
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F97316', // Orange
      '#6366F1', // Indigo
      '#14B8A6', // Teal
      '#DC2626', // Red-600
    ];
  }

  /**
   * Predefined icons for categories
   */
  static getPredefinedIcons(): string[] {
    return [
      '🏠', '💼', '🎮', '🎵', '📱', '💻', '📚', '🏥', '✈️', '🛒',
      '💰', '🔒', '⭐', '🎯', '📊', '🔧', '🎨', '🏃', '🍔', '☕',
      '🌐', '📧', '📞', '📺', '🎬', '📷', '🎪', '🏆', '🎁', '💡'
    ];
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

