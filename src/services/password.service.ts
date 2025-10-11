import { PasswordEntry, PasswordCategory, PasswordStrength, CustomCategory } from '@/types';
import { 
  CreatePasswordRequestDto, 
  UpdatePasswordRequestDto, 
  SearchPasswordRequestDto,
  PasswordResponseDto,
  PasswordListResponseDto,
  PasswordStatsResponseDto,
  toPasswordResponseDto,
  toPasswordEntry,
  calculatePasswordStrength
} from '@/dto/password.dto';
import { StorageService } from './storage.service';

/**
 * Password Service
 * Handles all password-related business logic
 */
export class PasswordService {
  
  /**
   * Create a new password entry
   */
  static async createPassword(dto: CreatePasswordRequestDto): Promise<PasswordResponseDto> {
    // Validate input
    this.validateCreatePasswordDto(dto);
    
    // Create password entry
    const passwordEntry = toPasswordEntry(dto);
    const now = new Date();
    const entry: PasswordEntry = {
      ...passwordEntry,
      createdAt: now,
      updatedAt: now,
      strength: calculatePasswordStrength(dto.password),
    };

    // Save to storage
    StorageService.addPassword(entry);
    
    return toPasswordResponseDto(entry);
  }

  /**
   * Get password by ID
   */
  static async getPasswordById(id: string): Promise<PasswordResponseDto | null> {
    const passwords = StorageService.getPasswords();
    const password = passwords.find(p => p.id === id);
    return password ? toPasswordResponseDto(password) : null;
  }

  /**
   * Get all passwords with optional filtering and pagination
   */
  static async getPasswords(dto?: SearchPasswordRequestDto): Promise<PasswordListResponseDto> {
    let passwords = StorageService.getPasswords();

    // Apply filters
    if (dto) {
      passwords = this.filterPasswords(passwords, dto);
      passwords = this.sortPasswords(passwords, dto.sortBy, dto.sortDirection);
      
      // Apply pagination
      const page = dto.offset || 0;
      const limit = dto.limit || 50;
      const total = passwords.length;
      const totalPages = Math.ceil(total / limit);
      
      passwords = passwords.slice(page, page + limit);
      
      return {
        passwords: passwords.map(toPasswordResponseDto),
        total,
        page: Math.floor(page / limit) + 1,
        limit,
        totalPages
      };
    }

    return {
      passwords: passwords.map(toPasswordResponseDto),
      total: passwords.length,
      page: 1,
      limit: passwords.length,
      totalPages: 1
    };
  }

  /**
   * Update password entry
   */
  static async updatePassword(dto: UpdatePasswordRequestDto): Promise<PasswordResponseDto | null> {
    const passwords = StorageService.getPasswords();
    const existingPassword = passwords.find(p => p.id === dto.id);
    
    if (!existingPassword) {
      return null;
    }

    // Validate update data
    this.validateUpdatePasswordDto(dto);

    // Update password entry
    const updatedPassword: PasswordEntry = {
      ...existingPassword,
      ...dto,
      updatedAt: new Date(),
      strength: dto.password ? calculatePasswordStrength(dto.password) : existingPassword.strength,
    };

    // Save to storage
    StorageService.updatePassword(updatedPassword);
    
    return toPasswordResponseDto(updatedPassword);
  }

  /**
   * Delete password entry
   */
  static async deletePassword(id: string): Promise<boolean> {
    const passwords = StorageService.getPasswords();
    const passwordExists = passwords.some(p => p.id === id);
    
    if (passwordExists) {
      StorageService.deletePassword(id);
      return true;
    }
    
    return false;
  }

  /**
   * Search passwords
   */
  static async searchPasswords(query: string): Promise<PasswordResponseDto[]> {
    const passwords = StorageService.getPasswords();
    const searchTerm = query.toLowerCase();
    
    const filteredPasswords = passwords.filter(password =>
      password.appName.toLowerCase().includes(searchTerm) ||
      password.username.toLowerCase().includes(searchTerm) ||
      password.website?.toLowerCase().includes(searchTerm) ||
      password.notes?.toLowerCase().includes(searchTerm) ||
      password.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    return filteredPasswords.map(toPasswordResponseDto);
  }

  /**
   * Get password statistics
   */
  static async getPasswordStats(): Promise<PasswordStatsResponseDto> {
    const passwords = StorageService.getPasswords();
    
    const categoryCounts = Object.values(PasswordCategory).reduce((acc, category) => {
      acc[category] = passwords.filter(p => p.category === category).length;
      return acc;
    }, {} as Record<PasswordCategory, number>);

    const strengthCounts = Object.values(PasswordStrength).reduce((acc, strength) => {
      acc[strength] = passwords.filter(p => p.strength === strength).length;
      return acc;
    }, {} as Record<PasswordStrength, number>);

    const recentlyUsed = passwords
      .filter(p => p.lastUsed)
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
      .slice(0, 5)
      .map(toPasswordResponseDto);

    const favorites = passwords
      .filter(p => p.isFavorite)
      .map(toPasswordResponseDto);

    return {
      totalPasswords: passwords.length,
      categoryCounts,
      strengthCounts,
      recentlyUsed,
      favorites
    };
  }

  /**
   * Mark password as used
   */
  static async markAsUsed(id: string): Promise<PasswordResponseDto | null> {
    const passwords = StorageService.getPasswords();
    const password = passwords.find(p => p.id === id);
    
    if (!password) {
      return null;
    }

    const updatedPassword: PasswordEntry = {
      ...password,
      lastUsed: new Date(),
      updatedAt: new Date()
    };

    StorageService.updatePassword(updatedPassword);
    return toPasswordResponseDto(updatedPassword);
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(id: string): Promise<PasswordResponseDto | null> {
    const passwords = StorageService.getPasswords();
    const password = passwords.find(p => p.id === id);
    
    if (!password) {
      return null;
    }

    const updatedPassword: PasswordEntry = {
      ...password,
      isFavorite: !password.isFavorite,
      updatedAt: new Date()
    };

    StorageService.updatePassword(updatedPassword);
    return toPasswordResponseDto(updatedPassword);
  }

  /**
   * Validate create password DTO
   */
  private static validateCreatePasswordDto(dto: CreatePasswordRequestDto): void {
    if (!dto.appName?.trim()) {
      throw new Error('Uygulama adı gereklidir');
    }
    
    if (!dto.username?.trim()) {
      throw new Error('Kullanıcı adı gereklidir');
    }
    
    if (!dto.password?.trim()) {
      throw new Error('Şifre gereklidir');
    }

    if (dto.appName.length > 100) {
      throw new Error('Uygulama adı çok uzun (maksimum 100 karakter)');
    }

    if (dto.username.length > 255) {
      throw new Error('Kullanıcı adı çok uzun (maksimum 255 karakter)');
    }

    if (dto.password.length > 500) {
      throw new Error('Şifre çok uzun (maksimum 500 karakter)');
    }

    if (dto.website && !this.isValidUrl(dto.website)) {
      throw new Error('Geçersiz website URL formatı');
    }
  }

  /**
   * Validate update password DTO
   */
  private static validateUpdatePasswordDto(dto: UpdatePasswordRequestDto): void {
    if (!dto.id?.trim()) {
      throw new Error('ID gereklidir');
    }

    if (dto.appName !== undefined && (!dto.appName?.trim() || dto.appName.length > 100)) {
      throw new Error('Geçersiz uygulama adı');
    }

    if (dto.username !== undefined && (!dto.username?.trim() || dto.username.length > 255)) {
      throw new Error('Geçersiz kullanıcı adı');
    }

    if (dto.password !== undefined && (!dto.password?.trim() || dto.password.length > 500)) {
      throw new Error('Geçersiz şifre');
    }

    if (dto.website && !this.isValidUrl(dto.website)) {
      throw new Error('Geçersiz website URL formatı');
    }
  }

  /**
   * Filter passwords based on search criteria
   */
  private static filterPasswords(passwords: PasswordEntry[], dto: SearchPasswordRequestDto): PasswordEntry[] {
    return passwords.filter(password => {
      // Query filter
      if (dto.query) {
        const query = dto.query.toLowerCase();
        const matchesQuery = 
          password.appName.toLowerCase().includes(query) ||
          password.username.toLowerCase().includes(query) ||
          password.website?.toLowerCase().includes(query) ||
          password.notes?.toLowerCase().includes(query) ||
          password.tags?.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesQuery) return false;
      }

      // Category filter
      if (dto.category && password.category !== dto.category) {
        return false;
      }

      // Tags filter
      if (dto.tags && dto.tags.length > 0) {
        const hasMatchingTag = dto.tags.some(tag => password.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Favorite filter
      if (dto.isFavorite !== undefined && password.isFavorite !== dto.isFavorite) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort passwords
   */
  private static sortPasswords(passwords: PasswordEntry[], sortBy?: string, sortDirection?: 'asc' | 'desc'): PasswordEntry[] {
    if (!sortBy) return passwords;

    const direction = sortDirection === 'desc' ? -1 : 1;

    return passwords.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'appName':
          aValue = a.appName.toLowerCase();
          bValue = b.appName.toLowerCase();
          break;
        case 'username':
          aValue = a.username.toLowerCase();
          bValue = b.username.toLowerCase();
          break;
        case 'createdAt':
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case 'lastUsed':
          aValue = a.lastUsed?.getTime() || 0;
          bValue = b.lastUsed?.getTime() || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
  }

  /**
   * Export all passwords and custom categories to JSON
   */
  static async exportData(): Promise<Blob> {
    const passwords = StorageService.getPasswords();
    const customCategories = StorageService.getCustomCategories();
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      passwords: passwords.map(toPasswordResponseDto),
      customCategories: customCategories
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  /**
   * Import passwords and custom categories from JSON
   */
  static async importData(file: File): Promise<{ importedPasswords: number, importedCategories: number, errors: string[] }> {
    const errors: string[] = [];
    let importedPasswords = 0;
    let importedCategories = 0;
    
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure
      if (!data.passwords || !Array.isArray(data.passwords)) {
        throw new Error('Geçersiz dosya formatı: şifreler bulunamadı');
      }
      
      if (!data.customCategories || !Array.isArray(data.customCategories)) {
        throw new Error('Geçersiz dosya formatı: özel kategoriler bulunamadı');
      }
      
      // Import custom categories first
      for (const categoryData of data.customCategories) {
        try {
          // Check if category already exists
          const existingCategories = StorageService.getCustomCategories();
          const exists = existingCategories.some(cat => cat.name === categoryData.name);
          
          if (!exists) {
            const category: CustomCategory = {
              id: this.generateId(),
              name: categoryData.name,
              color: categoryData.color,
              icon: categoryData.icon || '🏠',
              description: categoryData.description || '',
              categoryType: categoryData.categoryType || 'expense',
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            StorageService.addCustomCategory(category);
            importedCategories++;
          }
        } catch (error) {
          errors.push(`Kategori "${categoryData.name}" içe aktarılamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
      }
      
      // Import passwords
      for (const passwordData of data.passwords) {
        try {
          // Check if password already exists
          const existingPasswords = StorageService.getPasswords();
          const exists = existingPasswords.some(p => p.appName === passwordData.appName && p.username === passwordData.username);
          
          if (!exists) {
            const passwordEntry = toPasswordEntry({
              appName: passwordData.appName,
              username: passwordData.username,
              password: passwordData.password,
              website: passwordData.website,
              notes: passwordData.notes,
              category: passwordData.category,
              customCategoryId: passwordData.customCategoryId,
              tags: passwordData.tags || [],
              isFavorite: passwordData.isFavorite || false,
              googleAuthenticator: passwordData.googleAuthenticator || '',
              phoneNumber: passwordData.phoneNumber || ''
            });
            
            const entry: PasswordEntry = {
              ...passwordEntry,
              createdAt: new Date(),
              updatedAt: new Date(),
              strength: calculatePasswordStrength(passwordData.password),
              lastUsed: passwordData.lastUsed ? new Date(passwordData.lastUsed) : undefined
            };
            
            StorageService.addPassword(entry);
            importedPasswords++;
          }
        } catch (error) {
          errors.push(`Şifre "${passwordData.appName}" içe aktarılamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        }
      }
      
    } catch (error) {
      throw new Error(`Dosya okunamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
    
    return { importedPasswords, importedCategories, errors };
  }

  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Validate URL format
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

