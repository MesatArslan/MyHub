import { Budget, Transaction, BudgetCategory, TransactionType } from '@/types';
import {
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  CreateIncomeRequestDto,
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
  BudgetResponseDto,
  TransactionResponseDto,
  toBudgetResponseDto,
  toTransactionResponseDto,
  toBudgetEntry,
  toTransactionEntry
} from '@/dto/budget.dto';

/**
 * Budget Service
 * Handles all budget and transaction-related business logic and storage
 */
export class BudgetService {
  private static readonly STORAGE_KEYS = {
    BUDGETS: 'myhub_budgets',
    TRANSACTIONS: 'myhub_transactions',
  };

  // ==================== Storage Helper Methods ====================

  private static setItem<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data, (key, value) => {
        // Handle Date objects
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() };
        }
        return value;
      });
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
      throw new Error('Failed to save data to local storage');
    }
  }

  private static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      return JSON.parse(item, (key, value) => {
        // Restore Date objects
        if (value && typeof value === 'object' && value.__type === 'Date') {
          return new Date(value.value);
        }
        return value;
      });
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  }

  private static saveBudgets(budgets: Budget[]): void {
    this.setItem(this.STORAGE_KEYS.BUDGETS, budgets);
  }

  private static getBudgets(): Budget[] {
    const budgets = this.getItem<Budget[]>(this.STORAGE_KEYS.BUDGETS);
    return budgets || [];
  }

  private static saveTransactions(transactions: Transaction[]): void {
    this.setItem(this.STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  private static getTransactions(): Transaction[] {
    const transactions = this.getItem<Transaction[]>(this.STORAGE_KEYS.TRANSACTIONS);
    return transactions || [];
  }

  // ==================== Budget Methods ====================
  
  /**
   * Create a new budget
   */
  static createBudget(dto: CreateBudgetRequestDto): BudgetResponseDto {
    // Validate input
    if (!dto.name || !dto.amount) {
      throw new Error('Budget name and amount are required');
    }
    
    // Create budget entry
    const budget = toBudgetEntry(dto);
    const now = new Date();
    const budgetEntry: Budget = {
      ...budget,
      createdAt: now,
      updatedAt: now,
    };

    // Save to storage
    const budgets = this.getBudgets();
    budgets.push(budgetEntry);
    this.saveBudgets(budgets);
    
    return toBudgetResponseDto(budgetEntry);
  }

  /**
   * Get budget by ID
   */
  static getBudgetById(id: string): BudgetResponseDto | null {
    const budgets = this.getBudgets();
    const budget = budgets.find(b => b.id === id);
    return budget ? toBudgetResponseDto(budget) : null;
  }

  /**
   * Get all budgets
   */
  static getAllBudgets(): BudgetResponseDto[] {
    const budgets = this.getBudgets();
    return budgets.map(b => toBudgetResponseDto(b));
  }

  /**
   * Update budget
   */
  static updateBudget(dto: UpdateBudgetRequestDto): BudgetResponseDto | null {
    const budgets = this.getBudgets();
    const existingBudget = budgets.find(b => b.id === dto.id);
    
    if (!existingBudget) {
      return null;
    }

    // Merge updates
    const updatedBudget: Budget = {
      ...existingBudget,
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.amount !== undefined && { amount: dto.amount }),
      ...(dto.currency !== undefined && { currency: dto.currency }),
      ...(dto.period !== undefined && { period: dto.period }),
      ...(dto.startDate !== undefined && { startDate: dto.startDate }),
      ...(dto.endDate !== undefined && { endDate: dto.endDate }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.targetAmount !== undefined && { targetAmount: dto.targetAmount }),
      updatedAt: new Date()
    };

    const index = budgets.findIndex(b => b.id === dto.id);
    if (index !== -1) {
      budgets[index] = updatedBudget;
      this.saveBudgets(budgets);
    }
    
    return toBudgetResponseDto(updatedBudget);
  }

  /**
   * Delete budget
   */
  static deleteBudget(id: string): boolean {
    const budgets = this.getBudgets();
    const exists = budgets.some(b => b.id === id);
    
    if (exists) {
      const filteredBudgets = budgets.filter(b => b.id !== id);
      this.saveBudgets(filteredBudgets);
      return true;
    }
    
    return false;
  }

  // ==================== Income Methods ====================

  /**
   * Create a new income transaction
   */
  static createIncome(dto: CreateIncomeRequestDto): TransactionResponseDto {
    // Validate input
    if (!dto.amount || !dto.source || !dto.accountTarget) {
      throw new Error('Amount, source, and account target are required');
    }
    
    // Create transaction entry
    const now = new Date();
    const transaction: Transaction = {
      id: Date.now().toString(),
      budgetId: '',
      amount: dto.amount,
      description: dto.description || dto.source,
      category: BudgetCategory.INCOME,
      type: TransactionType.INCOME,
      date: dto.date,
      accountTarget: dto.accountTarget,
      tags: dto.tags || [`source:${dto.source}`],
      createdAt: now,
      updatedAt: now
    };

    // Save to storage
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
    
    return toTransactionResponseDto(transaction);
  }

  // ==================== Transaction Methods ====================

  /**
   * Create a new transaction
   */
  static createTransaction(dto: CreateTransactionRequestDto): TransactionResponseDto {
    // Validate input
    if (!dto.amount || !dto.description || !dto.category || !dto.type) {
      throw new Error('Amount, description, category, and type are required');
    }
    
    // Create transaction entry
    const transaction = toTransactionEntry(dto);
    const now = new Date();
    const transactionEntry: Transaction = {
      ...transaction,
      createdAt: now,
      updatedAt: now,
    };

    // Save to storage
    const transactions = this.getTransactions();
    transactions.push(transactionEntry);
    this.saveTransactions(transactions);
    
    return toTransactionResponseDto(transactionEntry);
  }

  /**
   * Get transaction by ID
   */
  static getTransactionById(id: string): TransactionResponseDto | null {
    const transactions = this.getTransactions();
    const transaction = transactions.find(t => t.id === id);
    return transaction ? toTransactionResponseDto(transaction) : null;
  }

  /**
   * Get all transactions
   */
  static getAllTransactions(): TransactionResponseDto[] {
    const transactions = this.getTransactions();
    return transactions.map(t => toTransactionResponseDto(t));
  }

  /**
   * Get transactions by type (income or expense)
   */
  static getTransactionsByType(type: TransactionType): TransactionResponseDto[] {
    const transactions = this.getTransactions();
    return transactions
      .filter(t => t.type === type)
      .map(t => toTransactionResponseDto(t));
  }

  /**
   * Get income transactions
   */
  static getIncomes(): TransactionResponseDto[] {
    return this.getTransactionsByType(TransactionType.INCOME);
  }

  /**
   * Get expense transactions
   */
  static getExpenses(): TransactionResponseDto[] {
    return this.getTransactionsByType(TransactionType.EXPENSE);
  }

  /**
   * Update transaction
   */
  static updateTransaction(dto: UpdateTransactionRequestDto): TransactionResponseDto | null {
    const transactions = this.getTransactions();
    const existingTransaction = transactions.find(t => t.id === dto.id);
    
    if (!existingTransaction) {
      return null;
    }

    // Merge updates
    const updatedTransaction: Transaction = {
      ...existingTransaction,
      ...(dto.budgetId !== undefined && { budgetId: dto.budgetId }),
      ...(dto.amount !== undefined && { amount: dto.amount }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.category !== undefined && { category: dto.category }),
      ...(dto.type !== undefined && { type: dto.type }),
      ...(dto.date !== undefined && { date: dto.date }),
      ...(dto.tags !== undefined && { tags: dto.tags }),
      ...(dto.receipt !== undefined && { receipt: dto.receipt }),
      ...(dto.accountTarget !== undefined && { accountTarget: dto.accountTarget }),
      updatedAt: new Date()
    };

    const index = transactions.findIndex(t => t.id === dto.id);
    if (index !== -1) {
      transactions[index] = updatedTransaction;
      this.saveTransactions(transactions);
    }
    
    return toTransactionResponseDto(updatedTransaction);
  }

  /**
   * Delete transaction
   */
  static deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const exists = transactions.some(t => t.id === id);
    
    if (exists) {
      const filteredTransactions = transactions.filter(t => t.id !== id);
      this.saveTransactions(filteredTransactions);
      return true;
    }
    
    return false;
  }

  // ==================== Statistics Methods ====================

  /**
   * Get total income
   */
  static getTotalIncome(): number {
    const incomes = this.getIncomes();
    return incomes.reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get total expenses
   */
  static getTotalExpenses(): number {
    const expenses = this.getExpenses();
    return expenses.reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Get net balance (income - expenses)
   */
  static getNetBalance(): number {
    return this.getTotalIncome() - this.getTotalExpenses();
  }

  /**
   * Get active budgets count
   */
  static getActiveBudgetsCount(): number {
    const budgets = this.getBudgets();
    return budgets.filter(b => b.isActive).length;
  }
}
