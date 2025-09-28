import { PasswordEntry, PasswordCategory, PasswordStrength } from '@/types';

// Request DTOs
export interface CreatePasswordRequestDto {
  appName: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  category?: PasswordCategory;
  customCategoryId?: string;
  tags?: string[];
  isFavorite?: boolean;
  googleAuthenticator?: string;
  phoneNumber?: string;
}

export interface UpdatePasswordRequestDto {
  id: string;
  appName?: string;
  username?: string;
  password?: string;
  website?: string;
  notes?: string;
  category?: PasswordCategory;
  customCategoryId?: string;
  tags?: string[];
  isFavorite?: boolean;
  googleAuthenticator?: string;
  phoneNumber?: string;
}

export interface SearchPasswordRequestDto {
  query?: string;
  category?: PasswordCategory;
  tags?: string[];
  isFavorite?: boolean;
  sortBy?: 'appName' | 'username' | 'createdAt' | 'lastUsed';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Response DTOs
export interface PasswordResponseDto {
  id: string;
  appName: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  category?: PasswordCategory;
  customCategoryId?: string;
  tags?: string[];
  isFavorite?: boolean;
  lastUsed?: Date;
  strength?: PasswordStrength;
  googleAuthenticator?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordListResponseDto {
  passwords: PasswordResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PasswordStatsResponseDto {
  totalPasswords: number;
  categoryCounts: Record<PasswordCategory, number>;
  strengthCounts: Record<PasswordStrength, number>;
  recentlyUsed: PasswordResponseDto[];
  favorites: PasswordResponseDto[];
}

// Utility DTOs
export interface PasswordValidationDto {
  isValid: boolean;
  errors: string[];
  strength: PasswordStrength;
  suggestions?: string[];
}

export interface PasswordExportDto {
  format: 'json' | 'csv' | 'xml';
  includePasswords: boolean;
  categories?: PasswordCategory[];
  tags?: string[];
}

// Transform functions
export const toPasswordResponseDto = (entry: PasswordEntry): PasswordResponseDto => ({
  id: entry.id,
  appName: entry.appName,
  username: entry.username,
  password: entry.password,
  website: entry.website,
  notes: entry.notes,
  category: entry.category,
  tags: entry.tags,
  isFavorite: entry.isFavorite,
  lastUsed: entry.lastUsed,
  strength: entry.strength,
  createdAt: entry.createdAt,
  updatedAt: entry.updatedAt,
});

export const toPasswordEntry = (dto: CreatePasswordRequestDto, id?: string): Omit<PasswordEntry, 'createdAt' | 'updatedAt'> => ({
  id: id || generateId(),
  appName: dto.appName,
  username: dto.username,
  password: dto.password,
  website: dto.website,
  notes: dto.notes,
  category: dto.category,
  tags: dto.tags || [],
  isFavorite: dto.isFavorite || false,
  lastUsed: undefined,
  strength: calculatePasswordStrength(dto.password),
});

// Helper functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Common patterns (negative points)
  if (/(.)\1{2,}/.test(password)) score -= 1; // repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 1; // common sequences
  
  if (score <= 2) return PasswordStrength.WEAK;
  if (score <= 4) return PasswordStrength.MEDIUM;
  if (score <= 6) return PasswordStrength.STRONG;
  return PasswordStrength.VERY_STRONG;
}
