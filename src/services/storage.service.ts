import { PasswordEntry, Routine, Budget, Transaction, CustomCategory, RecurringTransactionTemplate, RecurrenceInterval, TransactionType, BudgetCategory } from '@/types';

/**
 * Local Storage Service
 * Handles all data persistence operations
 */
export class StorageService {
  private static readonly STORAGE_KEYS = {
    PASSWORDS: 'myhub_passwords',
    ROUTINES: 'myhub_routines',
    BUDGETS: 'myhub_budgets',
    TRANSACTIONS: 'myhub_transactions',
    CUSTOM_CATEGORIES: 'myhub_custom_categories',
    RECURRING_TEMPLATES: 'myhub_recurring_templates',
    SETTINGS: 'myhub_settings',
  };

  // Generic storage methods
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

  private static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  }

  // Password storage methods
  static savePasswords(passwords: PasswordEntry[]): void {
    this.setItem(this.STORAGE_KEYS.PASSWORDS, passwords);
  }

  static getPasswords(): PasswordEntry[] {
    const passwords = this.getItem<PasswordEntry[]>(this.STORAGE_KEYS.PASSWORDS);
    return passwords || [];
  }

  static addPassword(password: PasswordEntry): void {
    const passwords = this.getPasswords();
    passwords.push(password);
    this.savePasswords(passwords);
  }

  static updatePassword(updatedPassword: PasswordEntry): void {
    const passwords = this.getPasswords();
    const index = passwords.findIndex(p => p.id === updatedPassword.id);
    if (index !== -1) {
      passwords[index] = { ...updatedPassword, updatedAt: new Date() };
      this.savePasswords(passwords);
    }
  }

  static deletePassword(passwordId: string): void {
    const passwords = this.getPasswords();
    const filteredPasswords = passwords.filter(p => p.id !== passwordId);
    this.savePasswords(filteredPasswords);
  }

  // Routine storage methods
  static saveRoutines(routines: Routine[]): void {
    this.setItem(this.STORAGE_KEYS.ROUTINES, routines);
  }

  static getRoutines(): Routine[] {
    const routines = this.getItem<Routine[]>(this.STORAGE_KEYS.ROUTINES);
    return routines || [];
  }

  static addRoutine(routine: Routine): void {
    const routines = this.getRoutines();
    routines.push(routine);
    this.saveRoutines(routines);
  }

  static updateRoutine(updatedRoutine: Routine): void {
    const routines = this.getRoutines();
    const index = routines.findIndex(r => r.id === updatedRoutine.id);
    if (index !== -1) {
      routines[index] = { ...updatedRoutine, updatedAt: new Date() };
      this.saveRoutines(routines);
    }
  }

  static deleteRoutine(routineId: string): void {
    const routines = this.getRoutines();
    const filteredRoutines = routines.filter(r => r.id !== routineId);
    this.saveRoutines(filteredRoutines);
  }

  // Budget storage methods
  static saveBudgets(budgets: Budget[]): void {
    this.setItem(this.STORAGE_KEYS.BUDGETS, budgets);
  }

  static getBudgets(): Budget[] {
    const budgets = this.getItem<Budget[]>(this.STORAGE_KEYS.BUDGETS);
    return budgets || [];
  }

  static addBudget(budget: Budget): void {
    const budgets = this.getBudgets();
    budgets.push(budget);
    this.saveBudgets(budgets);
  }

  static updateBudget(updatedBudget: Budget): void {
    const budgets = this.getBudgets();
    const index = budgets.findIndex(b => b.id === updatedBudget.id);
    if (index !== -1) {
      budgets[index] = { ...updatedBudget, updatedAt: new Date() };
      this.saveBudgets(budgets);
    }
  }

  static deleteBudget(budgetId: string): void {
    const budgets = this.getBudgets();
    const filteredBudgets = budgets.filter(b => b.id !== budgetId);
    this.saveBudgets(filteredBudgets);
  }

  // Transaction storage methods
  static saveTransactions(transactions: Transaction[]): void {
    this.setItem(this.STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  static getTransactions(): Transaction[] {
    const transactions = this.getItem<Transaction[]>(this.STORAGE_KEYS.TRANSACTIONS);
    return transactions || [];
  }

  static addTransaction(transaction: Transaction): void {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    this.saveTransactions(transactions);
  }

  static updateTransaction(updatedTransaction: Transaction): void {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      transactions[index] = { ...updatedTransaction, updatedAt: new Date() };
      this.saveTransactions(transactions);
    }
  }

  static deleteTransaction(transactionId: string): void {
    const transactions = this.getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== transactionId);
    this.saveTransactions(filteredTransactions);
  }

  // Custom Category storage methods
  static saveCustomCategories(categories: CustomCategory[]): void {
    this.setItem(this.STORAGE_KEYS.CUSTOM_CATEGORIES, categories);
  }

  static getCustomCategories(): CustomCategory[] {
    const categories = this.getItem<CustomCategory[]>(this.STORAGE_KEYS.CUSTOM_CATEGORIES);
    return categories || [];
  }

  static addCustomCategory(category: CustomCategory): void {
    const categories = this.getCustomCategories();
    categories.push(category);
    this.saveCustomCategories(categories);
  }

  static updateCustomCategory(updatedCategory: CustomCategory): void {
    const categories = this.getCustomCategories();
    const index = categories.findIndex(c => c.id === updatedCategory.id);
    if (index !== -1) {
      categories[index] = { ...updatedCategory, updatedAt: new Date() };
      this.saveCustomCategories(categories);
    }
  }

  static deleteCustomCategory(categoryId: string): void {
    const categories = this.getCustomCategories();
    const filteredCategories = categories.filter(c => c.id !== categoryId);
    this.saveCustomCategories(filteredCategories);
  }

  // Recurring templates storage methods
  static saveRecurringTemplates(templates: RecurringTransactionTemplate[]): void {
    this.setItem(this.STORAGE_KEYS.RECURRING_TEMPLATES, templates);
  }

  static getRecurringTemplates(): RecurringTransactionTemplate[] {
    const templates = this.getItem<RecurringTransactionTemplate[]>(this.STORAGE_KEYS.RECURRING_TEMPLATES);
    return templates || [];
  }

  static addRecurringTemplate(template: RecurringTransactionTemplate): void {
    const templates = this.getRecurringTemplates();
    templates.push(template);
    this.saveRecurringTemplates(templates);
  }

  static updateRecurringTemplate(updatedTemplate: RecurringTransactionTemplate): void {
    const templates = this.getRecurringTemplates();
    const index = templates.findIndex(t => t.id === updatedTemplate.id);
    if (index !== -1) {
      templates[index] = { ...updatedTemplate, updatedAt: new Date() };
      this.saveRecurringTemplates(templates);
    }
  }

  static deleteRecurringTemplate(templateId: string): void {
    const templates = this.getRecurringTemplates();
    const filtered = templates.filter(t => t.id !== templateId);
    this.saveRecurringTemplates(filtered);
  }

  // Run due recurring templates and generate transactions
  static runDueRecurringTemplates(now: Date = new Date()): number {
    const templates = this.getRecurringTemplates();
    let createdCount = 0;
    for (const template of templates) {
      if (!template.isActive) continue;
      if (template.endDate && template.endDate < now) continue;
      if (template.nextRunAt && template.nextRunAt <= now) {
        const transaction: Transaction = {
          id: this.generateId(),
          budgetId: template.budgetId || '',
          amount: template.amount,
          description: template.description,
          category: template.customCategoryId ? BudgetCategory.OTHER : (template.category || BudgetCategory.OTHER),
          type: template.type,
          date: now,
          createdAt: now,
          updatedAt: now,
          tags: ['recurring'],
          receipt: undefined,
          customCategoryId: template.customCategoryId,
        };
        this.addTransaction(transaction);
        createdCount++;

        // schedule next run
        template.nextRunAt = this.calculateNextRun(template.nextRunAt, template.interval);
        template.updatedAt = new Date();
      }
    }
    // persist updated templates
    this.saveRecurringTemplates(templates);
    return createdCount;
  }

  private static calculateNextRun(from: Date, interval: RecurrenceInterval): Date {
    const next = new Date(from);
    switch (interval) {
      case RecurrenceInterval.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case RecurrenceInterval.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case RecurrenceInterval.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
      case RecurrenceInterval.YEARLY:
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    return next;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Utility methods
  static clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
  }

  static exportData(): Record<string, unknown> {
    return {
      passwords: this.getPasswords(),
      routines: this.getRoutines(),
      budgets: this.getBudgets(),
      transactions: this.getTransactions(),
      customCategories: this.getCustomCategories(),
      exportDate: new Date(),
      version: '1.0.0'
    };
  }

  static importData(data: Record<string, unknown>): void {
    if (data.passwords && Array.isArray(data.passwords)) this.savePasswords(data.passwords as PasswordEntry[]);
    if (data.routines && Array.isArray(data.routines)) this.saveRoutines(data.routines as Routine[]);
    if (data.budgets && Array.isArray(data.budgets)) this.saveBudgets(data.budgets as Budget[]);
    if (data.transactions && Array.isArray(data.transactions)) this.saveTransactions(data.transactions as Transaction[]);
    if (data.customCategories && Array.isArray(data.customCategories)) this.saveCustomCategories(data.customCategories as CustomCategory[]);
  }

  static getStorageInfo(): { used: number; available: number; total: number } {
    try {
      let used = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length;
        }
      }
      
      // Estimate available space (5MB is typical limit)
      const total = 5 * 1024 * 1024; // 5MB in bytes
      const available = total - used;
      
      return { used, available, total };
    } catch {
      return { used: 0, available: 0, total: 0 };
    }
  }
}
