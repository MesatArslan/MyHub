'use client';

import { useState, useEffect } from 'react';
import { BudgetService } from '@/services/budget.service';
import { StorageService } from '@/services/storage.service';
import { CustomCategoryService } from '@/services/custom-category.service';
import { Budget, Transaction, BudgetCategory, TransactionType, Currency, BudgetType, BudgetPeriod, RecurrenceInterval } from '@/types';
import { useNavbarActions } from '@/app/components/NavbarActions';

type Tab = 'dashboard' | 'budgets' | 'analytics' | 'incomes' | 'expenses' | 'debts' | 'investments';

export default function BudgetTracker() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Form states
  const [budgetForm, setBudgetForm] = useState({
    name: '',
    description: '',
    amount: '',
    category: BudgetCategory.FOOD,
    type: BudgetType.MONTHLY as BudgetType,
    currency: Currency.TRY
  });
  
  const [transactionForm, setTransactionForm] = useState({
    description: '',
    amount: '',
    type: TransactionType.EXPENSE,
    category: BudgetCategory.FOOD,
    date: new Date().toISOString().split('T')[0]
  });

  // Settings modal state
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'income' | 'expense' | 'color'>('income');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategoryColor, setCustomCategoryColor] = useState('#3B82F6');
  const [customCategoryType, setCustomCategoryType] = useState<'income' | 'expense'>('income');
  const [monthlyStartDay, setMonthlyStartDay] = useState<number>(1);
  const [monthlyEndDay, setMonthlyEndDay] = useState<number>(30);
  const [customCategories, setCustomCategories] = useState<ReturnType<typeof CustomCategoryService.getCustomCategories>>([]);
  const [analyticsFrom, setAnalyticsFrom] = useState<string>('');
  const [analyticsTo, setAnalyticsTo] = useState<string>('');
  const [incomePeriodDay, setIncomePeriodDay] = useState<number>(15);
  const [selectedFilterMonth, setSelectedFilterMonth] = useState<{ year: number; month: number } | null>(null);
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  
  // Income form state
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    source: '',
    date: new Date().toISOString().split('T')[0],
    accountTarget: '',
    description: ''
  });

  const [] = useState({
    type: TransactionType.EXPENSE as TransactionType,
    description: '',
    amount: '',
    category: BudgetCategory.FOOD as BudgetCategory,
    interval: RecurrenceInterval.MONTHLY as RecurrenceInterval,
    nextRunAt: new Date().toISOString().split('T')[0],
  });

  const categoryLabel: Record<BudgetCategory, string> = {
    [BudgetCategory.INCOME]: 'Gelir',
    [BudgetCategory.FOOD]: 'Yiyecek',
    [BudgetCategory.TRANSPORTATION]: 'Ulaşım',
    [BudgetCategory.ENTERTAINMENT]: 'Eğlence',
    [BudgetCategory.HEALTHCARE]: 'Sağlık',
    [BudgetCategory.EDUCATION]: 'Eğitim',
    [BudgetCategory.SHOPPING]: 'Alışveriş',
    [BudgetCategory.UTILITIES]: 'Faturalar',
    [BudgetCategory.SAVINGS]: 'Birikim',
    [BudgetCategory.INVESTMENT]: 'Yatırım',
    [BudgetCategory.OTHER]: 'Diğer',
  };

  // Format number to Turkish format: 300.000,25
  const formatTurkishNumber = (value: string | number): string => {
    if (value === '' || value === null || value === undefined) return '';
    const numValue = typeof value === 'string' 
      ? parseFloat(value.replace(/\./g, '').replace(',', '.')) 
      : value;
    if (isNaN(numValue) || numValue === 0) return '';
    
    const parts = numValue.toFixed(2).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Add thousand separators (dots)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${formattedInteger},${decimalPart}`;
  };

  // Parse Turkish format to number: "300.000,25" -> 300000.25
  const parseTurkishNumber = (value: string): number => {
    if (!value || value.trim() === '') return 0;
    // Remove dots (thousand separators) and replace comma with dot for decimal
    const cleaned = value.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Get list of months for filter (current month + past 11 months)
  const getMonthOptions = () => {
    const today = new Date();
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
      });
    }
    
    return months;
  };

  // Calculate income date range based on period day
  // If today is Jan 17 and period day is 15, show from Jan 15 to Feb 15 (current period forward)
  // If filterMonth is provided, use that month instead of current month
  const getIncomeDateRange = (filterMonth?: { year: number; month: number } | null) => {
    const today = new Date();
    let targetMonth: number;
    let targetYear: number;
    
    if (filterMonth) {
      // Use the selected filter month
      targetMonth = filterMonth.month;
      targetYear = filterMonth.year;
    } else {
      // Use current month
      const currentDay = today.getDate();
      targetMonth = today.getMonth();
      targetYear = today.getFullYear();
      
      // If current day is before the period day, use previous month
      if (currentDay < incomePeriodDay) {
        targetMonth -= 1;
        if (targetMonth < 0) {
          targetMonth += 12;
          targetYear -= 1;
        }
      }
    }

    // Calculate the start date (target month's period day)
    const startDate = new Date(targetYear, targetMonth, incomePeriodDay);
    startDate.setHours(0, 0, 0, 0); // Start of the day

    // Calculate the end date (next month's period day)
    let endMonth = targetMonth + 1;
    let endYear = targetYear;
    
    if (endMonth > 11) {
      endMonth = 0;
      endYear += 1;
    }

    const endDate = new Date(endYear, endMonth, incomePeriodDay);
    endDate.setHours(23, 59, 59, 999); // End of the day

    return { startDate, endDate };
  };

  // Navbar actions
  const { setActions } = useNavbarActions();

  // Load data on component mount
  useEffect(() => {
    loadData();
    // Load income period day from localStorage
    const savedDay = localStorage.getItem('incomePeriodDay');
    if (savedDay) {
      setIncomePeriodDay(parseInt(savedDay, 10));
    }
  }, []);

  // Close month filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMonthFilter && !target.closest('.month-filter-container')) {
        setShowMonthFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMonthFilter]);

  // Set navbar actions
  useEffect(() => {
    setActions(
      <button
        onClick={() => setShowSettings(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        title="Ayarlar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">Ayarlar</span>
      </button>
    );

    return () => setActions(null);
  }, [setActions]);

  const loadData = () => {
    // Generate due recurring transactions before reading
    StorageService.runDueRecurringTemplates();
    setBudgets(BudgetService.getAllBudgets().map(b => {
      // Convert BudgetResponseDto back to Budget for component state
      return {
        id: b.id,
        name: b.name,
        description: b.description,
        category: b.category,
        type: b.type,
        amount: b.amount,
        currency: b.currency,
        period: b.period,
        startDate: b.startDate,
        endDate: b.endDate,
        isActive: b.isActive,
        targetAmount: b.targetAmount,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      } as Budget;
    }));
    setTransactions(BudgetService.getAllTransactions().map(t => {
      // Convert TransactionResponseDto back to Transaction for component state
      return {
        id: t.id,
        budgetId: t.budgetId,
        amount: t.amount,
        description: t.description,
        category: t.category,
        type: t.type,
        date: t.date,
        tags: t.tags,
        receipt: t.receipt,
        accountTarget: t.accountTarget,
        customCategoryId: undefined,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt
      } as Transaction;
    }));
    setCustomCategories(CustomCategoryService.getCustomCategories());
  };


  const resetBudgetForm = () => {
    setBudgetForm({
      name: '',
      description: '',
      amount: '',
      category: BudgetCategory.FOOD,
      type: BudgetType.MONTHLY,
      currency: Currency.TRY
    });
  };

  const resetTransactionForm = () => {
    setTransactionForm({
      description: '',
      amount: '',
      type: TransactionType.EXPENSE,
      category: BudgetCategory.FOOD,
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Edit and delete handlers
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      name: budget.name,
      description: budget.description || '',
      amount: budget.amount.toString(),
      category: budget.category,
      type: budget.type,
      currency: budget.currency
    });
    setShowAddBudget(true);
  };

  const handleDeleteBudget = (budgetId: string) => {
    if (confirm('Bu bütçeyi silmek istediğinizden emin misiniz?')) {
      BudgetService.deleteBudget(budgetId);
      loadData();
    }
  };

  // Removed işlemler tabındaki düzenle/sil işlevleri

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetForm.name || !budgetForm.amount) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    if (editingBudget) {
      // Update existing budget
      const computeDates = () => {
        if (budgetForm.type !== BudgetType.MONTHLY) return { startDate: new Date(), endDate: undefined as Date | undefined };
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), monthlyStartDay);
        // if end day is less than start day, roll to next month
        const endMonthOffset = monthlyEndDay >= monthlyStartDay ? 0 : 1;
        const endDate = new Date(now.getFullYear(), now.getMonth() + endMonthOffset, monthlyEndDay);
        return { startDate, endDate };
      };

      const dates = computeDates();

      BudgetService.updateBudget({
        id: editingBudget.id,
        name: budgetForm.name,
        description: budgetForm.description,
        category: budgetForm.category,
        type: budgetForm.type,
        amount: parseFloat(budgetForm.amount),
        currency: budgetForm.currency,
        startDate: dates.startDate,
        endDate: dates.endDate
      });
    } else {
      // Create new budget
      const now = new Date();
      const startDate = budgetForm.type === BudgetType.MONTHLY
        ? new Date(now.getFullYear(), now.getMonth(), monthlyStartDay)
        : now;
      const endDate = budgetForm.type === BudgetType.MONTHLY
        ? new Date(now.getFullYear(), now.getMonth() + (monthlyEndDay >= monthlyStartDay ? 0 : 1), monthlyEndDay)
        : undefined;

      BudgetService.createBudget({
        name: budgetForm.name,
        description: budgetForm.description,
        category: budgetForm.category,
        type: budgetForm.type,
        amount: parseFloat(budgetForm.amount),
        currency: budgetForm.currency,
        period: BudgetPeriod.MONTH,
        startDate,
        endDate,
        isActive: true
      });
    }

    loadData();
    setShowAddBudget(false);
    setEditingBudget(null);
    resetBudgetForm();
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionForm.description || !transactionForm.amount) {
      alert('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    if (editingTransaction) {
      // Update existing transaction
      BudgetService.updateTransaction({
        id: editingTransaction.id,
        amount: parseFloat(transactionForm.amount),
        description: transactionForm.description,
        category: transactionForm.category,
        type: transactionForm.type,
        date: new Date(transactionForm.date)
      });
    } else {
      // Create new transaction
      BudgetService.createTransaction({
        budgetId: '',
        amount: parseFloat(transactionForm.amount),
        description: transactionForm.description,
        category: transactionForm.category,
        type: transactionForm.type,
        date: new Date(transactionForm.date)
      });
    }

    loadData();
    setShowAddTransaction(false);
    setEditingTransaction(null);
    resetTransactionForm();
  };

  // Calculate dashboard stats
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  const activeBudgets = budgets.filter(b => b.isActive).length;
  // Removed unused totalBudgetAmount

  // Get recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-cyan-900 dark:to-teal-900 -z-10"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 dark:bg-gray-800/20 rounded-xl p-1 backdrop-blur-sm">
          {([
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'incomes', label: 'Gelirler', icon: '💚' },
            { id: 'expenses', label: 'Giderler', icon: '❤️' },
            { id: 'budgets', label: 'Bütçeler', icon: '💰' },
            { id: 'debts', label: 'Borçlar', icon: '💳' },
            { id: 'investments', label: 'Yatırımlar', icon: '📊' },
            { id: 'analytics', label: 'Analiz', icon: '📈' }
          ] as { id: Tab; label: string; icon: string }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/20 dark:bg-gray-700/50 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/30'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Toplam Gelir</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₺{totalIncome.toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Toplam Gider</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      ₺{totalExpenses.toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
          </div>
          
              <div className="glass rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Net Bakiye</p>
                    <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ₺{netBalance.toLocaleString('tr-TR')}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${netBalance >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <svg className={`w-6 h-6 ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Aktif Bütçeler</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activeBudgets}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Hızlı İşlemler</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowAddBudget(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Yeni Bütçe</span>
                </button>
                <button
                  onClick={() => setShowAddTransaction(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Yeni İşlem</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analiz Görüntüle</span>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Son İşlemler</h3>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/10 dark:bg-gray-800/20 rounded-lg">
                <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${transaction.type === TransactionType.INCOME ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(transaction.date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === TransactionType.INCOME ? '+' : '-'}₺{transaction.amount.toLocaleString('tr-TR')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{categoryLabel[transaction.category]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300">Henüz işlem bulunmuyor</p>
                  <button
                    onClick={() => setShowAddTransaction(true)}
                    className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    İlk işleminizi ekleyin
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bütçelerim</h2>
              <button
                onClick={() => setShowAddBudget(true)}
                className="flex items-center space-x-2 px-4 py-2 gradient-cool text-white rounded-lg hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Yeni Bütçe</span>
              </button>
            </div>

            {budgets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((budget) => (
                  <div key={budget.id} className="glass rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{budget.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          budget.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {budget.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditBudget(budget)}
                            className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Düzenle"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(budget.id)}
                            className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Sil"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{budget.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Bütçe:</span>
                        <span className="font-medium">₺{budget.amount.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Kategori:</span>
                        <span className="font-medium">{categoryLabel[budget.category]}</span>
                      </div>
                      {(() => {
                        const spent = transactions
                          .filter(t => t.type === TransactionType.EXPENSE && t.category === budget.category)
                          .reduce((sum, t) => sum + t.amount, 0);
                        const percentage = Math.min(100, (spent / budget.amount) * 100);
                        return (
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-300">Harcanan:</span>
                              <span className={`font-medium ${spent > budget.amount ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                                ₺{spent.toLocaleString('tr-TR')} ({isNaN(percentage) ? 0 : percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${spent > budget.amount ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${isNaN(percentage) ? 0 : percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Dönem:</span>
                        <span className="font-medium">{budget.period}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Henüz bütçe yok</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">İlk bütçenizi oluşturarak başlayın</p>
                <button
                  onClick={() => setShowAddBudget(true)}
                  className="px-6 py-3 gradient-cool text-white rounded-lg hover:scale-105 transition-all"
                >
                  Bütçe Oluştur
                </button>
              </div>
            )}
          </div>
        )}


        {/* Incomes Tab */}
        {activeTab === 'incomes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gelirler</h2>
              <button
                onClick={() => setShowIncomeForm(!showIncomeForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <span>{showIncomeForm ? 'Gelir Ekle Formunu Kapat' : 'Gelir Ekle Formunu Aç'}</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${showIncomeForm ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Income Form */}
            {showIncomeForm && (
            <div className="glass rounded-2xl p-6 shadow-xl" data-income-form>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingIncomeId ? 'Gelir Düzenle' : 'Yeni Gelir Ekle'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Miktar (Net) *
                  </label>
                  <input
                    type="text"
                    value={incomeForm.amount}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Allow only digits, dots, and commas
                      value = value.replace(/[^\d.,]/g, '');
                      // Only allow one comma for decimals
                      const commaIndex = value.indexOf(',');
                      if (commaIndex !== -1) {
                        // Only allow 2 digits after comma
                        const parts = value.split(',');
                        if (parts[1] && parts[1].length > 2) {
                          value = parts[0] + ',' + parts[1].substring(0, 2);
                        }
                        // Remove extra commas
                        value = parts[0] + ',' + parts.slice(1).join('');
                      }
                      setIncomeForm({ ...incomeForm, amount: value });
                    }}
                    onBlur={(e) => {
                      // Format on blur - add thousand separators
                      const parsed = parseTurkishNumber(e.target.value);
                      if (parsed > 0) {
                        const formatted = formatTurkishNumber(parsed);
                        setIncomeForm({ ...incomeForm, amount: formatted });
                      } else if (e.target.value === '') {
                        setIncomeForm({ ...incomeForm, amount: '' });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0,00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Kaynak *
                  </label>
                  <input
                    type="text"
                    value={incomeForm.source}
                    onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Örn: Maaş, Freelance, Hediye, Yatırım"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    value={incomeForm.date}
                    onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hesap Hedefi *
                  </label>
                  <input
                    type="text"
                    value={incomeForm.accountTarget}
                    onChange={(e) => setIncomeForm({ ...incomeForm, accountTarget: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Örn: Ziraat Bankası, Nakit Cüzdan, Kredi Kartı"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={incomeForm.description}
                    onChange={(e) => setIncomeForm({ ...incomeForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Örn: Aylık maaş, Freelance proje ödemesi"
                  />
                </div>
                <div className="md:col-span-2 flex space-x-3">
                  {editingIncomeId && (
                    <button
                      onClick={() => {
                        setEditingIncomeId(null);
                        setIncomeForm({
                          amount: '',
                          source: '',
                          date: new Date().toISOString().split('T')[0],
                          accountTarget: '',
                          description: ''
                        });
                        setShowIncomeForm(false);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      İptal
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!incomeForm.amount || !incomeForm.accountTarget || !incomeForm.source) {
                        alert('Lütfen miktar, kaynak ve hesap hedefi alanlarını doldurun');
                        return;
                      }
                      const parsedAmount = parseTurkishNumber(incomeForm.amount);
                      
                      if (editingIncomeId) {
                        // Update existing transaction using BudgetService
                        BudgetService.updateTransaction({
                          id: editingIncomeId,
                          amount: parsedAmount,
                          description: incomeForm.description || incomeForm.source,
                          date: new Date(incomeForm.date),
                          accountTarget: incomeForm.accountTarget,
                          tags: [`source:${incomeForm.source}`]
                        });
                      } else {
                        // Create new income using BudgetService
                        BudgetService.createIncome({
                          amount: parsedAmount,
                          source: incomeForm.source,
                          date: new Date(incomeForm.date),
                          accountTarget: incomeForm.accountTarget,
                          description: incomeForm.description || incomeForm.source,
                          tags: [`source:${incomeForm.source}`]
                        });
                      }
                      
                      loadData();
                      setEditingIncomeId(null);
                      setIncomeForm({
                        amount: '',
                        source: '',
                        date: new Date().toISOString().split('T')[0],
                        accountTarget: '',
                        description: ''
                      });
                      setShowIncomeForm(false);
                    }}
                    className={`${editingIncomeId ? 'flex-1' : 'w-full'} px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl`}
                  >
                    {editingIncomeId ? 'Güncelle' : 'Gelir Ekle'}
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* Income List */}
            <div className="glass rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gelir Listesi</h3>
                <div className="relative month-filter-container">
                  <button
                    onClick={() => setShowMonthFilter(!showMonthFilter)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                    title="Filtrele"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-medium">Filtre</span>
                  </button>
                  
                  {showMonthFilter && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10 max-h-80 overflow-y-auto">
                      <div className="p-2">
                        {getMonthOptions().map((monthOption, index) => {
                          const isSelected = selectedFilterMonth 
                            ? selectedFilterMonth.year === monthOption.year && selectedFilterMonth.month === monthOption.month
                            : index === 0; // First option (current month) is selected by default
                          
                          return (
                            <button
                              key={`${monthOption.year}-${monthOption.month}`}
                              onClick={() => {
                                if (index === 0) {
                                  // Current month - reset filter
                                  setSelectedFilterMonth(null);
                                } else {
                                  setSelectedFilterMonth({ year: monthOption.year, month: monthOption.month });
                                }
                                setShowMonthFilter(false);
                              }}
                              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                                isSelected
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {monthOption.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {(() => {
                const { startDate, endDate } = getIncomeDateRange(selectedFilterMonth);
                const filteredIncomes = transactions
                  .filter(t => {
                    if (t.type !== TransactionType.INCOME) return false;
                    const transactionDate = new Date(t.date);
                    return transactionDate >= startDate && transactionDate <= endDate;
                  });
                
                return filteredIncomes.length > 0 ? (
                  <div className="space-y-2">
                    {filteredIncomes
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-white/10 dark:bg-gray-800/20 rounded-lg hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {transaction.tags && transaction.tags.find(t => t.startsWith('source:'))
                                  ? transaction.tags.find(t => t.startsWith('source:'))?.replace('source:', '')
                                  : transaction.description || 'Gelir'}
                              </p>
                              {transaction.description && transaction.tags && transaction.tags.find(t => t.startsWith('source:')) && transaction.description !== transaction.tags.find(t => t.startsWith('source:'))?.replace('source:', '') && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-600 dark:text-gray-400">
                                  {transaction.description}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span>{new Date(transaction.date).toLocaleDateString('tr-TR')}</span>
                              <span className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <span>{transaction.accountTarget || 'Belirtilmemiş'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              +₺{formatTurkishNumber(transaction.amount)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                // Populate form with transaction data
                                const sourceTag = transaction.tags?.find(t => t.startsWith('source:'));
                                const source = sourceTag ? sourceTag.replace('source:', '') : '';
                                
                                setEditingIncomeId(transaction.id);
                                setIncomeForm({
                                  amount: transaction.amount.toString(),
                                  source: source,
                                  date: new Date(transaction.date).toISOString().split('T')[0],
                                  accountTarget: transaction.accountTarget || '',
                                  description: transaction.description || ''
                                });
                                setShowIncomeForm(true);
                                // Scroll to form
                                document.querySelector('[data-income-form]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Bu geliri silmek istediğinizden emin misiniz?')) {
                                  BudgetService.deleteTransaction(transaction.id);
                                  loadData();
                                }
                              }}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Sil"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Henüz gelir yok</h3>
                    <p className="text-gray-600 dark:text-gray-300">İlk gelirinizi ekleyerek başlayın</p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Giderler</h2>
            </div>
            {/* Content will be redesigned here */}
          </div>
        )}

        {/* Debts Tab */}
        {activeTab === 'debts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Borçlar</h2>
            </div>
            {/* Content will be added later */}
          </div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Yatırımlar</h2>
            </div>
            {/* Content will be added later */}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analiz ve Raporlar</h2>
            <div className="glass rounded-2xl p-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Başlangıç</label>
                  <input
                    type="date"
                    value={analyticsFrom}
                    onChange={(e) => setAnalyticsFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Bitiş</label>
                  <input
                    type="date"
                    value={analyticsTo}
                    onChange={(e) => setAnalyticsTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { setAnalyticsFrom(''); setAnalyticsTo(''); }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Temizle
                  </button>
                </div>
                <div className="md:col-span-2 flex items-end text-sm text-gray-600 dark:text-gray-300">
                  Seçilen aralığa göre veriler filtrelenir
                </div>
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Toplam İşlem</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {transactions.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Ortalama Gider</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      ₺{transactions.filter(t => t.type === TransactionType.EXPENSE).length > 0 
                        ? (totalExpenses / transactions.filter(t => t.type === TransactionType.EXPENSE).length).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
                        : '0'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Tasarruf Oranı</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0'}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const fromDate = analyticsFrom ? new Date(analyticsFrom) : null;
              const toDate = analyticsTo ? new Date(analyticsTo) : null;
              const txInRange = transactions.filter(t => {
                const d = new Date(t.date);
                if (fromDate && d < fromDate) return false;
                if (toDate) {
                  const end = new Date(toDate);
                  end.setHours(23,59,59,999);
                  if (d > end) return false;
                }
                return true;
              });
              const rangeTotalExpenses = txInRange
                .filter(t => t.type === TransactionType.EXPENSE)
                .reduce((s, t) => s + t.amount, 0);
              // const rangeTotalIncome = txInRange
              //   .filter(t => t.type === TransactionType.INCOME)
              //   .reduce((s, t) => s + t.amount, 0);

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="glass rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kategori Dağılımı</h3>
                {rangeTotalExpenses > 0 ? (
                  <div className="space-y-3">
                    {Object.values(BudgetCategory)
                      .map((category) => {
                        const categoryExpenses = txInRange
                          .filter(t => t.category === category && t.type === TransactionType.EXPENSE)
                          .reduce((sum, t) => sum + t.amount, 0);
                        
                        return { category, amount: categoryExpenses };
                      })
                      .filter(item => item.amount > 0)
                      .sort((a, b) => b.amount - a.amount)
                      .map(({ category, amount }) => {
                        const percentage = (amount / rangeTotalExpenses) * 100;
                        const colors = [
                          'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 
                          'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
                        ];
                        const colorIndex = Object.values(BudgetCategory).indexOf(category) % colors.length;
                        
                        return (
                          <div key={category} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-300">{categoryLabel[category as BudgetCategory]}</span>
                              <span className="font-medium">₺{amount.toLocaleString('tr-TR')}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`${colors[colorIndex]} h-2 rounded-full transition-all duration-300`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {percentage.toFixed(1)}% of total expenses
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300">Henüz gider bulunmuyor</p>
                  </div>
                )}
              </div>

              {/* Monthly Trends */}
              <div className="glass rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Aylık Trend</h3>
                {txInRange.length > 0 ? (
                  <div className="space-y-4">
                    {(() => {
                      // Group transactions by month
                      const monthlyData = txInRange.reduce((acc, transaction) => {
                        const month = new Date(transaction.date).toLocaleDateString('tr-TR', { 
                          year: 'numeric', 
                          month: 'short' 
                        });
                        
                        if (!acc[month]) {
                          acc[month] = { income: 0, expenses: 0 };
                        }
                        
                        if (transaction.type === TransactionType.INCOME) {
                          acc[month].income += transaction.amount;
                        } else {
                          acc[month].expenses += transaction.amount;
                        }
                        
                        return acc;
                      }, {} as Record<string, { income: number; expenses: number }>);

                      const sortedMonths = Object.entries(monthlyData)
                        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                        .slice(-6); // Show last 6 months

                      return sortedMonths.map(([month, data]) => {
                        const maxAmount = Math.max(data.income, data.expenses, 1000);
                        const incomePercentage = (data.income / maxAmount) * 100;
                        const expensePercentage = (data.expenses / maxAmount) * 100;
                        
                        return (
                          <div key={month} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-300 font-medium">{month}</span>
                              <div className="flex space-x-4 text-xs">
                                <span className="text-green-600">+₺{data.income.toLocaleString('tr-TR')}</span>
                                <span className="text-red-600">-₺{data.expenses.toLocaleString('tr-TR')}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${incomePercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${expensePercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-300">Henüz işlem bulunmuyor</p>
                  </div>
                )}
              </div>
            </div>
              );
            })()}

            {/* Budget vs Actual */}
            {budgets.length > 0 && (
              <div className="glass rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bütçe vs Gerçekleşen</h3>
                <div className="space-y-4">
                  {budgets.filter(b => b.isActive).map((budget) => {
                    const budgetExpenses = transactions
                      .filter(t => t.category === budget.category && t.type === TransactionType.EXPENSE)
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    const percentage = (budgetExpenses / budget.amount) * 100;
                    const isOverBudget = budgetExpenses > budget.amount;
                    
                    return (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{budget.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{budget.category}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                              ₺{budgetExpenses.toLocaleString('tr-TR')} / ₺{budget.amount.toLocaleString('tr-TR')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {percentage.toFixed(1)}% kullanıldı
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${
                              isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        {isOverBudget && (
                          <p className="text-sm text-red-600 dark:text-red-400">
                            ⚠️ Bütçe aşıldı! ₺{(budgetExpenses - budget.amount).toLocaleString('tr-TR')} fazla harcama
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Budget Modal */}
        {showAddBudget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingBudget ? 'Bütçe Düzenle' : 'Yeni Bütçe'}
              </h3>
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bütçe Adı *</label>
                  <input
                    type="text"
                    value={budgetForm.name}
                    onChange={(e) => setBudgetForm({...budgetForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Örn: Aylık Market Bütçesi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
                  <input
                    type="text"
                    value={budgetForm.description}
                    onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Opsiyonel açıklama"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tutar *</label>
                  <input
                    type="number"
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                  <select 
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value as BudgetCategory})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {Object.values(BudgetCategory).map((category) => (
                      <option key={category} value={category}>{categoryLabel[category]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dönem</label>
                  <select 
                    value={budgetForm.type}
                    onChange={(e) => setBudgetForm({...budgetForm, type: e.target.value as BudgetType})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={BudgetType.MONTHLY}>Aylık</option>
                    <option value={BudgetType.WEEKLY}>Haftalık</option>
                    <option value={BudgetType.YEARLY}>Yıllık</option>
                  </select>
                </div>
                {budgetForm.type === BudgetType.MONTHLY && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ay Başlangıç Günü</label>
                      <input
                        type="number"
                        value={monthlyStartDay}
                        onChange={(e) => setMonthlyStartDay(Math.max(1, Math.min(31, Number(e.target.value))))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        min={1}
                        max={31}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ay Bitiş Günü</label>
                      <input
                        type="number"
                        value={monthlyEndDay}
                        onChange={(e) => setMonthlyEndDay(Math.max(1, Math.min(31, Number(e.target.value))))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        min={1}
                        max={31}
                      />
                    </div>
                  </div>
                )}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddBudget(false);
                      setEditingBudget(null);
                      resetBudgetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 gradient-cool text-white rounded-lg hover:scale-105 transition-all"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingTransaction ? 'İşlem Düzenle' : 'Yeni İşlem'}
              </h3>
              <form onSubmit={handleTransactionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama *</label>
                  <input
                    type="text"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Örn: Market alışverişi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tutar *</label>
                  <input
                    type="number"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tür</label>
                  <select 
                    value={transactionForm.type}
                    onChange={(e) => setTransactionForm({...transactionForm, type: e.target.value as TransactionType})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value={TransactionType.EXPENSE}>Gider</option>
                    <option value={TransactionType.INCOME}>Gelir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                  <select 
                    value={transactionForm.category}
                    onChange={(e) => setTransactionForm({...transactionForm, category: e.target.value as BudgetCategory})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {Object.values(BudgetCategory).map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarih</label>
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm({...transactionForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransaction(false);
                      setEditingTransaction(null);
                      resetTransactionForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 gradient-cool text-white rounded-lg hover:scale-105 transition-all"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
          </div>
        </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Ayarlar</h3>
                <button onClick={() => setShowSettings(false)} className="p-2 rounded-lg hover:bg-white/10">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Gelirler Settings */}
              <div className="mb-6 p-4 bg-white/10 dark:bg-gray-800/20 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Gelir Dönem Ayarları</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Gelir Dönem Günü (Her ayın kaçıncı günü)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={incomePeriodDay}
                      onChange={(e) => {
                        const day = Math.max(1, Math.min(31, parseInt(e.target.value) || 15));
                        setIncomePeriodDay(day);
                        localStorage.setItem('incomePeriodDay', day.toString());
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Gelirler tablosu, mevcut dönem gelirlerini gösterecektir (seçilen günden başlayarak bir sonraki dönem gününe kadar).
                      {(() => {
                        const { startDate, endDate } = getIncomeDateRange();
                        return (
                          <span className="block mt-1">
                            Şu anda gösterilen dönem: {startDate.toLocaleDateString('tr-TR')} - {endDate.toLocaleDateString('tr-TR')}
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  {/* SETTINGS MODAL */}
  /* The modal must be outside of the main return in React; we place it above return in code structure. But within this file, we append below as conditional rendering before closing component. */
}

// Settings Modal rendering appended after component return above using a fragment would not work in this file format.

