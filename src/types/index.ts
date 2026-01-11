// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Password Manager Types
export interface PasswordEntry extends BaseEntity {
  appName: string;
  username: string;
  password: string;
  website?: string;
  notes?: string;
  category?: PasswordCategory;
  customCategoryId?: string; // For custom categories
  tags?: string[];
  isFavorite?: boolean;
  lastUsed?: Date;
  strength?: PasswordStrength;
  googleAuthenticator?: string; // 2FA backup codes or secret key
  phoneNumber?: string; // Phone number for 2FA
}

export enum PasswordCategory {
  SOCIAL_MEDIA = 'social_media',
  EMAIL = 'email',
  BANKING = 'banking',
  SHOPPING = 'shopping',
  WORK = 'work',
  ENTERTAINMENT = 'entertainment',
  EDUCATION = 'education',
  GAMING = 'gaming',
  HEALTH = 'health',
  TRAVEL = 'travel',
  OTHER = 'other'
}

export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
  VERY_STRONG = 'very_strong'
}

// Custom Category System
export interface CustomCategory extends BaseEntity {
  name: string;
  color: string;
  icon?: string;
  description?: string;
  categoryType?: 'income' | 'expense';
  isActive?: boolean;
}

// Routine Tracker Types
export interface Routine extends BaseEntity {
  title: string;
  description?: string;
  category: RoutineCategory;
  priority: Priority;
  estimatedDuration: number; // minutes
  isActive: boolean;
  daysOfWeek: DayOfWeek[];
  timeOfDay?: string; // HH:MM format
  streakCount: number;
  lastCompleted?: Date;
}

// Daily Routine Types
export interface RoutineBlock extends BaseEntity {
  time: string; // HH:MM format
  title: string;
  description: string;
}

export interface RoutineScheduleItem extends BaseEntity {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  whatToDo: string; // what I'll do
  whereToDo?: string; // where will I do (optional)
  day: string; // day of week (monday, tuesday, etc.)
}

export interface Goal extends BaseEntity {
  text: string;
  completed: boolean;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  customDate?: string;
}

export enum RoutineCategory {
  HEALTH = 'health',
  WORK = 'work',
  LEARNING = 'learning',
  EXERCISE = 'exercise',
  PERSONAL = 'personal',
  SOCIAL = 'social',
  CREATIVE = 'creative',
  OTHER = 'other'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday'
}

export interface RoutineCompletion extends BaseEntity {
  routineId: string;
  completedAt: Date;
  duration?: number; // actual duration in minutes
  notes?: string;
  rating?: number; // 1-5 scale
}

// Budget Tracker Types
export interface Budget extends BaseEntity {
  name: string;
  description?: string;
  category: BudgetCategory;
  type: BudgetType;
  amount: number;
  currency: Currency;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  targetAmount?: number;
}

export enum BudgetCategory {
  INCOME = 'income',
  FOOD = 'food',
  TRANSPORTATION = 'transportation',
  ENTERTAINMENT = 'entertainment',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  SHOPPING = 'shopping',
  UTILITIES = 'utilities',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
  OTHER = 'other'
}

export enum BudgetType {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
  DAILY = 'daily',
  YEARLY = 'yearly',
  ONE_TIME = 'one_time'
}

export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP'
}

export enum BudgetPeriod {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export interface Transaction extends BaseEntity {
  budgetId: string;
  amount: number;
  description: string;
  category: BudgetCategory;
  type: TransactionType;
  date: Date;
  tags?: string[];
  receipt?: string; // file path or URL
  customCategoryId?: string; // link to CustomCategory if used
  accountTarget?: string; // wallet or bank account where money goes
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

// Recurring Transactions
export enum RecurrenceInterval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface RecurringTransactionTemplate extends BaseEntity {
  description: string;
  amount: number;
  category?: BudgetCategory; // optional when using customCategoryId
  customCategoryId?: string; // optional when using built-in category
  type: TransactionType;
  nextRunAt: Date;
  interval: RecurrenceInterval;
  isActive: boolean;
  budgetId?: string;
  endDate?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  isActive?: boolean;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}
