import { Budget, BudgetCategory, BudgetType, Currency, BudgetPeriod, Transaction, TransactionType } from '@/types';

// Request DTOs
export interface CreateBudgetRequestDto {
  name: string;
  description?: string;
  category: BudgetCategory;
  type: BudgetType;
  amount: number;
  currency: Currency;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  isActive?: boolean;
  targetAmount?: number;
}

export interface UpdateBudgetRequestDto {
  id: string;
  name?: string;
  description?: string;
  category?: BudgetCategory;
  type?: BudgetType;
  amount?: number;
  currency?: Currency;
  period?: BudgetPeriod;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  targetAmount?: number;
}

export interface CreateIncomeRequestDto {
  amount: number;
  category: BudgetCategory;
  date: Date;
  accountTarget: string; // wallet or bank account where money goes
  description?: string;
  tags?: string[];
}

export interface CreateTransactionRequestDto {
  budgetId: string;
  amount: number;
  description: string;
  category: BudgetCategory;
  type: TransactionType;
  date: Date;
  tags?: string[];
  receipt?: string;
  accountTarget?: string; // wallet or bank account where money goes
}

export interface UpdateTransactionRequestDto {
  id: string;
  budgetId?: string;
  amount?: number;
  description?: string;
  category?: BudgetCategory;
  type?: TransactionType;
  date?: Date;
  tags?: string[];
  receipt?: string;
  accountTarget?: string;
}

export interface SearchBudgetRequestDto {
  query?: string;
  category?: BudgetCategory;
  type?: BudgetType;
  currency?: Currency;
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'name' | 'amount' | 'createdAt' | 'startDate';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchTransactionRequestDto {
  budgetId?: string;
  category?: BudgetCategory;
  type?: TransactionType;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  tags?: string[];
  sortBy?: 'date' | 'amount' | 'description' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Response DTOs
export interface BudgetResponseDto {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetListResponseDto {
  budgets: BudgetResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionResponseDto {
  id: string;
  budgetId: string;
  amount: number;
  description: string;
  category: BudgetCategory;
  type: TransactionType;
  date: Date;
  tags?: string[];
  receipt?: string;
  accountTarget?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionListResponseDto {
  transactions: TransactionResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BudgetStatsResponseDto {
  totalBudgets: number;
  activeBudgets: number;
  totalAmount: number;
  totalSpent: number;
  totalIncome: number;
  categoryBreakdown: Record<BudgetCategory, { amount: number; count: number }>;
  currencyBreakdown: Record<Currency, { amount: number; count: number }>;
  monthlyTrends: { month: string; income: number; expenses: number; savings: number }[];
}

export interface BudgetSummaryDto {
  budget: BudgetResponseDto;
  totalTransactions: number;
  totalAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  averageDailySpend: number;
  daysRemaining: number;
  recentTransactions: TransactionResponseDto[];
}

// Transform functions
export const toBudgetResponseDto = (budget: Budget): BudgetResponseDto => ({
  id: budget.id,
  name: budget.name,
  description: budget.description,
  category: budget.category,
  type: budget.type,
  amount: budget.amount,
  currency: budget.currency,
  period: budget.period,
  startDate: budget.startDate,
  endDate: budget.endDate,
  isActive: budget.isActive,
  targetAmount: budget.targetAmount,
  createdAt: budget.createdAt,
  updatedAt: budget.updatedAt,
});

export const toBudgetEntry = (dto: CreateBudgetRequestDto, id?: string): Omit<Budget, 'createdAt' | 'updatedAt'> => ({
  id: id || generateId(),
  name: dto.name,
  description: dto.description,
  category: dto.category,
  type: dto.type,
  amount: dto.amount,
  currency: dto.currency,
  period: dto.period,
  startDate: dto.startDate,
  endDate: dto.endDate,
  isActive: dto.isActive ?? true,
  targetAmount: dto.targetAmount,
});

export const toTransactionResponseDto = (transaction: Transaction): TransactionResponseDto => ({
  id: transaction.id,
  budgetId: transaction.budgetId,
  amount: transaction.amount,
  description: transaction.description,
  category: transaction.category,
  type: transaction.type,
  date: transaction.date,
  tags: transaction.tags,
  receipt: transaction.receipt,
  accountTarget: transaction.accountTarget,
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

export const toTransactionEntry = (dto: CreateTransactionRequestDto, id?: string): Omit<Transaction, 'createdAt' | 'updatedAt'> => ({
  id: id || generateId(),
  budgetId: dto.budgetId,
  amount: dto.amount,
  description: dto.description,
  category: dto.category,
  type: dto.type,
  date: dto.date,
  tags: dto.tags || [],
  receipt: dto.receipt,
  accountTarget: dto.accountTarget,
});

// Helper functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

