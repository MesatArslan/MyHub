'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PasswordResponseDto } from '@/dto';
import { PasswordCategory, CustomCategory } from '@/types';
import { PasswordService, CustomCategoryService } from '@/services';

export default function PasswordManager() {
  const [passwords, setPasswords] = useState<PasswordResponseDto[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordResponseDto | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEntry, setNewEntry] = useState({
    appName: '',
    username: '',
    password: '',
    website: '',
    notes: '',
    category: PasswordCategory.OTHER,
    customCategoryId: '',
    tags: [] as string[],
    isFavorite: false,
    googleAuthenticator: '',
    phoneNumber: ''
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6',
    icon: '🏠',
    description: ''
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Load passwords on component mount
  useEffect(() => {
    loadPasswords();
  }, []);

  // ESC key handling removed - modal only closes with close button

  const loadPasswords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PasswordService.getPasswords();
      setPasswords(response.passwords);
      
      // Load custom categories
      const categories = CustomCategoryService.getCustomCategories();
      setCustomCategories(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifreler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredPasswords = passwords.filter(password =>
    password.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!newEntry.appName.trim()) {
      errors.appName = 'Uygulama adı gereklidir';
    }

    if (!newEntry.username.trim()) {
      errors.username = 'Kullanıcı adı gereklidir';
    }

    if (!newEntry.password.trim()) {
      errors.password = 'Şifre gereklidir';
    } else if (newEntry.password.length < 4) {
      errors.password = 'Şifre en az 4 karakter olmalıdır';
    }

    if (newEntry.website && newEntry.website.trim()) {
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(newEntry.website)) {
        errors.website = 'Geçerli bir URL giriniz (http:// veya https:// ile başlamalı)';
      }
    }

    return errors;
  };

  const handleAddPassword = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setError(null);
      setFormErrors({});
      
      const response = await PasswordService.createPassword({
        appName: newEntry.appName,
        username: newEntry.username,
        password: newEntry.password,
        website: newEntry.website || undefined,
        notes: newEntry.notes || undefined,
        category: newEntry.category,
        customCategoryId: newEntry.customCategoryId || undefined,
        tags: newEntry.tags,
        isFavorite: newEntry.isFavorite,
        googleAuthenticator: newEntry.googleAuthenticator || undefined,
        phoneNumber: newEntry.phoneNumber || undefined
      });
      
      setPasswords([...passwords, response]);
      setNewEntry({ 
        appName: '', 
        username: '', 
        password: '', 
        website: '', 
        notes: '',
        category: PasswordCategory.OTHER,
        customCategoryId: '',
        tags: [],
        isFavorite: false,
        googleAuthenticator: '',
        phoneNumber: ''
      });
      setFormErrors({});
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre eklenirken hata oluştu');
    }
  };

  const handleEditPassword = async () => {
    if (!selectedPassword) return;
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setError(null);
      setFormErrors({});
      
      const response = await PasswordService.updatePassword({
        id: selectedPassword.id,
        appName: newEntry.appName,
        username: newEntry.username,
        password: newEntry.password,
        website: newEntry.website || undefined,
        notes: newEntry.notes || undefined,
        category: newEntry.category,
        customCategoryId: newEntry.customCategoryId || undefined,
        tags: newEntry.tags,
        isFavorite: newEntry.isFavorite,
        googleAuthenticator: newEntry.googleAuthenticator || undefined,
        phoneNumber: newEntry.phoneNumber || undefined
      });
      
      if (response) {
        setPasswords(passwords.map(p => p.id === selectedPassword.id ? response : p));
        setNewEntry({ 
          appName: '', 
          username: '', 
          password: '', 
          website: '', 
          notes: '',
          category: PasswordCategory.OTHER,
          customCategoryId: '',
          tags: [],
          isFavorite: false,
          googleAuthenticator: '',
          phoneNumber: ''
        });
        setFormErrors({});
        setShowEditForm(false);
        setSelectedPassword(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre güncellenirken hata oluştu');
    }
  };

  const openEditForm = (password: PasswordResponseDto) => {
    setSelectedPassword(password);
    setNewEntry({
      appName: password.appName,
      username: password.username,
      password: password.password,
      website: password.website || '',
      notes: password.notes || '',
      category: password.category || PasswordCategory.OTHER,
      customCategoryId: password.customCategoryId || '',
      tags: password.tags || [],
      isFavorite: password.isFavorite || false,
      googleAuthenticator: password.googleAuthenticator || '',
      phoneNumber: password.phoneNumber || ''
    });
    setFormErrors({});
    setShowEditForm(true);
  };

  const openDetailModal = (password: PasswordResponseDto) => {
    setSelectedPassword(password);
    setShowDetailModal(true);
  };

  const handleAddCustomCategory = async () => {
    if (!newCategory.name.trim()) {
      setError('Kategori adı gereklidir');
      return;
    }

    try {
      setError(null);
      const category = CustomCategoryService.createCustomCategory(
        newCategory.name,
        newCategory.color,
        newCategory.icon,
        newCategory.description
      );
      
      setCustomCategories([...customCategories, category]);
      setNewCategory({ name: '', color: '#3B82F6', icon: '🏠', description: '' });
      setShowCategoryModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategori eklenirken hata oluştu');
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const deletePassword = async (id: string) => {
    try {
      setError(null);
      const success = await PasswordService.deletePassword(id);
      if (success) {
        setPasswords(passwords.filter(p => p.id !== id));
      } else {
        setError('Şifre silinirken hata oluştu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre silinirken hata oluştu');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast bildirimi eklenebilir
  };

  const getCategoryLabel = (category: PasswordCategory, customCategoryId?: string): string => {
    // Check if it's a custom category
    if (customCategoryId) {
      const customCategory = customCategories.find(c => c.id === customCategoryId);
      if (customCategory) {
        return customCategory.name;
      }
    }

    const labels: Record<PasswordCategory, string> = {
      [PasswordCategory.SOCIAL_MEDIA]: 'Sosyal Medya',
      [PasswordCategory.EMAIL]: 'E-posta',
      [PasswordCategory.BANKING]: 'Bankacılık',
      [PasswordCategory.SHOPPING]: 'Alışveriş',
      [PasswordCategory.WORK]: 'İş',
      [PasswordCategory.ENTERTAINMENT]: 'Eğlence',
      [PasswordCategory.EDUCATION]: 'Eğitim',
      [PasswordCategory.GAMING]: 'Oyun',
      [PasswordCategory.HEALTH]: 'Sağlık',
      [PasswordCategory.TRAVEL]: 'Seyahat',
      [PasswordCategory.OTHER]: 'Diğer'
    };
    return labels[category] || 'Diğer';
  };

  const getCategoryColor = (category: PasswordCategory, customCategoryId?: string): string => {
    // Check if it's a custom category
    if (customCategoryId) {
      const customCategory = customCategories.find(c => c.id === customCategoryId);
      if (customCategory) {
        return customCategory.color;
      }
    }

    // Default colors for predefined categories
    const colors: Record<PasswordCategory, string> = {
      [PasswordCategory.SOCIAL_MEDIA]: '#3B82F6',
      [PasswordCategory.EMAIL]: '#10B981',
      [PasswordCategory.BANKING]: '#EF4444',
      [PasswordCategory.SHOPPING]: '#F59E0B',
      [PasswordCategory.WORK]: '#8B5CF6',
      [PasswordCategory.ENTERTAINMENT]: '#EC4899',
      [PasswordCategory.EDUCATION]: '#06B6D4',
      [PasswordCategory.GAMING]: '#84CC16',
      [PasswordCategory.HEALTH]: '#F97316',
      [PasswordCategory.TRAVEL]: '#6366F1',
      [PasswordCategory.OTHER]: '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Ana Sayfa</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-600"></div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                Şifre Yöneticisi
              </h1>
            </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowCategoryModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Kategori Ekle
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(true);
                        setFormErrors({});
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Yeni Şifre
                    </button>
                  </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Toplam Şifre</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{passwords.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Favoriler</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {passwords.filter(p => p.isFavorite).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Güçlü Şifreler</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {passwords.filter(p => p.strength === 'strong' || p.strength === 'very_strong').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Kategoriler</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {new Set(passwords.map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Şifre ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
            </button>
            <button className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Şifreler yükleniyor...</p>
          </div>
        )}

        {/* Passwords Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPasswords.map((password) => (
            <div 
              key={password.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 group cursor-pointer"
              onClick={() => openDetailModal(password)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                    {password.appName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {password.appName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{password.username}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {password.isFavorite && (
                    <div className="p-1.5 text-yellow-500">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditForm(password);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Düzenle"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePassword(password.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Sil"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Category and Strength */}
              <div className="flex items-center justify-between mb-4">
                {password.category && (
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getCategoryColor(password.category, password.customCategoryId) }}
                  >
                    {password.customCategoryId && customCategories.find(c => c.id === password.customCategoryId)?.icon && (
                      <span className="mr-1">
                        {customCategories.find(c => c.id === password.customCategoryId)?.icon}
                      </span>
                    )}
                    {getCategoryLabel(password.category, password.customCategoryId)}
                  </span>
                )}
                {password.strength && (
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      password.strength === 'very_strong' ? 'bg-green-500' :
                      password.strength === 'strong' ? 'bg-green-400' :
                      password.strength === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {password.strength.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Password Display */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
                    {showPassword[password.id] ? password.password : '••••••••••'}
                  </span>
                  <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePasswordVisibility(password.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    title={showPassword[password.id] ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {showPassword[password.id] ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(password.password);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Şifreyi kopyala"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-3">
                {password.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Website</span>
                  <a 
                    href={password.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm transition-colors"
                  >
                    <span className="truncate max-w-32">{password.website}</span>
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  </div>
                )}

                {password.notes && (
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      {password.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-600">
                  <span>Oluşturulma: {new Date(password.createdAt).toLocaleDateString('tr-TR')}</span>
                  {password.lastUsed && (
                    <span>Son kullanım: {new Date(password.lastUsed).toLocaleDateString('tr-TR')}</span>
                  )}
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {!loading && filteredPasswords.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm ? 'Arama kriterlerinize uygun şifre bulunamadı' : 'Henüz şifre eklenmemiş'}
            </p>
          </div>
        )}

        {/* Edit Password Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Şifre Düzenle</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Şifre bilgilerinizi güncelleyin</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setFormErrors({});
                    setSelectedPassword(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
              
                <div className="space-y-5">
                  {/* App Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Uygulama/Website Adı *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newEntry.appName}
                        onChange={(e) => {
                          setNewEntry({...newEntry, appName: e.target.value});
                          if (formErrors.appName) {
                            setFormErrors(prev => ({...prev, appName: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.appName 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="örn: Gmail, Facebook"
                      />
                    </div>
                    {formErrors.appName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.appName}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kullanıcı Adı/E-posta *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newEntry.username}
                        onChange={(e) => {
                          setNewEntry({...newEntry, username: e.target.value});
                          if (formErrors.username) {
                            setFormErrors(prev => ({...prev, username: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.username 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="kullanici@email.com"
                      />
                    </div>
                    {formErrors.username && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Şifre *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword['edit'] ? 'text' : 'password'}
                        value={newEntry.password}
                        onChange={(e) => {
                          setNewEntry({...newEntry, password: e.target.value});
                          if (formErrors.password) {
                            setFormErrors(prev => ({...prev, password: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.password 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('edit')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title={showPassword['edit'] ? "Şifreyi gizle" : "Şifreyi göster"}
                      >
                        {showPassword['edit'] ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Website URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Website URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={newEntry.website}
                        onChange={(e) => {
                          setNewEntry({...newEntry, website: e.target.value});
                          if (formErrors.website) {
                            setFormErrors(prev => ({...prev, website: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.website 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="https://example.com"
                      />
                    </div>
                    {formErrors.website && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.website}
                      </p>
                    )}
                  </div>

                  {/* Google Authenticator */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Google Authenticator / 2FA Kodları
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newEntry.googleAuthenticator}
                        onChange={(e) => setNewEntry({...newEntry, googleAuthenticator: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                        placeholder="Backup kodları veya secret key"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      2FA için backup kodları veya secret key'i buraya yazabilirsiniz
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Telefon Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={newEntry.phoneNumber}
                        onChange={(e) => setNewEntry({...newEntry, phoneNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                        placeholder="+90 555 123 4567"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      2FA için telefon numarası (SMS doğrulama)
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kategori
                    </label>
                    <div className="relative">
                      <select
                        value={newEntry.customCategoryId || newEntry.category}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.startsWith('custom_')) {
                            setNewEntry({...newEntry, customCategoryId: value.replace('custom_', ''), category: PasswordCategory.OTHER});
                          } else {
                            setNewEntry({...newEntry, category: value as PasswordCategory, customCategoryId: ''});
                          }
                        }}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                      >
                        <optgroup label="Önceden Tanımlı">
                          <option value={PasswordCategory.SOCIAL_MEDIA}>Sosyal Medya</option>
                          <option value={PasswordCategory.EMAIL}>E-posta</option>
                          <option value={PasswordCategory.BANKING}>Bankacılık</option>
                          <option value={PasswordCategory.SHOPPING}>Alışveriş</option>
                          <option value={PasswordCategory.WORK}>İş</option>
                          <option value={PasswordCategory.ENTERTAINMENT}>Eğlence</option>
                          <option value={PasswordCategory.EDUCATION}>Eğitim</option>
                          <option value={PasswordCategory.GAMING}>Oyun</option>
                          <option value={PasswordCategory.HEALTH}>Sağlık</option>
                          <option value={PasswordCategory.TRAVEL}>Seyahat</option>
                          <option value={PasswordCategory.OTHER}>Diğer</option>
                        </optgroup>
                        {customCategories.length > 0 && (
                          <optgroup label="Özel Kategoriler">
                            {customCategories.map((category) => (
                              <option key={category.id} value={`custom_${category.id}`}>
                                {category.icon} {category.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Notlar
                    </label>
                    <div className="relative">
                      <textarea
                        value={newEntry.notes}
                        onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none text-sm"
                        placeholder="Ek notlar..."
                      />
                    </div>
                  </div>

                  {/* Favorite Checkbox */}
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <input
                      type="checkbox"
                      id="isFavoriteEdit"
                      checked={newEntry.isFavorite}
                      onChange={(e) => setNewEntry({...newEntry, isFavorite: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-600 dark:border-slate-500"
                    />
                    <label htmlFor="isFavoriteEdit" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Favori olarak işaretle
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex space-x-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-b-3xl">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setFormErrors({});
                    setSelectedPassword(null);
                  }}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 font-medium text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={handleEditPassword}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  Güncelle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Password Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Yeni Şifre Ekle</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Güvenli şifre bilgilerinizi kaydedin</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
              
                <div className="space-y-5">
                  {/* App Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Uygulama/Website Adı *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newEntry.appName}
                        onChange={(e) => {
                          setNewEntry({...newEntry, appName: e.target.value});
                          if (formErrors.appName) {
                            setFormErrors(prev => ({...prev, appName: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.appName 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="örn: Gmail, Facebook"
                      />
                    </div>
                    {formErrors.appName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.appName}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kullanıcı Adı/E-posta *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newEntry.username}
                        onChange={(e) => {
                          setNewEntry({...newEntry, username: e.target.value});
                          if (formErrors.username) {
                            setFormErrors(prev => ({...prev, username: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.username 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="kullanici@email.com"
                      />
                    </div>
                    {formErrors.username && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.username}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Şifre *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword['new'] ? 'text' : 'password'}
                        value={newEntry.password}
                        onChange={(e) => {
                          setNewEntry({...newEntry, password: e.target.value});
                          if (formErrors.password) {
                            setFormErrors(prev => ({...prev, password: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.password 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title={showPassword['new'] ? "Şifreyi gizle" : "Şifreyi göster"}
                      >
                        {showPassword['new'] ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Website URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Website URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={newEntry.website}
                        onChange={(e) => {
                          setNewEntry({...newEntry, website: e.target.value});
                          if (formErrors.website) {
                            setFormErrors(prev => ({...prev, website: ''}));
                          }
                        }}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                          formErrors.website 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                        }`}
                        placeholder="https://example.com"
                      />
                    </div>
                    {formErrors.website && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.website}
                      </p>
                    )}
                  </div>

                  {/* Google Authenticator */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Google Authenticator / 2FA Kodları
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newEntry.googleAuthenticator}
                        onChange={(e) => setNewEntry({...newEntry, googleAuthenticator: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                        placeholder="Backup kodları veya secret key"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      2FA için backup kodları veya secret key'i buraya yazabilirsiniz
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Telefon Numarası
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={newEntry.phoneNumber}
                        onChange={(e) => setNewEntry({...newEntry, phoneNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                        placeholder="+90 555 123 4567"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      2FA için telefon numarası (SMS doğrulama)
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kategori
                    </label>
                    <div className="relative">
                      <select
                        value={newEntry.customCategoryId || newEntry.category}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.startsWith('custom_')) {
                            setNewEntry({...newEntry, customCategoryId: value.replace('custom_', ''), category: PasswordCategory.OTHER});
                          } else {
                            setNewEntry({...newEntry, category: value as PasswordCategory, customCategoryId: ''});
                          }
                        }}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm appearance-none cursor-pointer"
                      >
                        <optgroup label="Önceden Tanımlı">
                          <option value={PasswordCategory.SOCIAL_MEDIA}>Sosyal Medya</option>
                          <option value={PasswordCategory.EMAIL}>E-posta</option>
                          <option value={PasswordCategory.BANKING}>Bankacılık</option>
                          <option value={PasswordCategory.SHOPPING}>Alışveriş</option>
                          <option value={PasswordCategory.WORK}>İş</option>
                          <option value={PasswordCategory.ENTERTAINMENT}>Eğlence</option>
                          <option value={PasswordCategory.EDUCATION}>Eğitim</option>
                          <option value={PasswordCategory.GAMING}>Oyun</option>
                          <option value={PasswordCategory.HEALTH}>Sağlık</option>
                          <option value={PasswordCategory.TRAVEL}>Seyahat</option>
                          <option value={PasswordCategory.OTHER}>Diğer</option>
                        </optgroup>
                        {customCategories.length > 0 && (
                          <optgroup label="Özel Kategoriler">
                            {customCategories.map((category) => (
                              <option key={category.id} value={`custom_${category.id}`}>
                                {category.icon} {category.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Notlar
                    </label>
                    <div className="relative">
                      <textarea
                        value={newEntry.notes}
                        onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none text-sm"
                        placeholder="Ek notlar..."
                      />
                    </div>
                  </div>

                  {/* Favorite Checkbox */}
                  <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <input
                      type="checkbox"
                      id="isFavorite"
                      checked={newEntry.isFavorite}
                      onChange={(e) => setNewEntry({...newEntry, isFavorite: e.target.checked})}
                      className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-600 dark:border-slate-500"
                    />
                    <label htmlFor="isFavorite" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      Favori olarak işaretle
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex space-x-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-b-3xl">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 font-medium text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddPassword}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedPassword && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-xl">
                    {selectedPassword.appName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedPassword.appName}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Şifre Detayları</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedPassword(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Kullanıcı Adı</p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">{selectedPassword.username}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(selectedPassword.username)}
                        className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Kullanıcı adını kopyala"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Şifre</p>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-lg text-slate-900 dark:text-white">
                            {showPassword[selectedPassword.id] ? selectedPassword.password : '••••••••••'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePasswordVisibility(selectedPassword.id)}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          title={showPassword[selectedPassword.id] ? "Şifreyi gizle" : "Şifreyi göster"}
                        >
                          {showPassword[selectedPassword.id] ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(selectedPassword.password)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Şifreyi kopyala"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPassword.website && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Website</p>
                        <a 
                          href={selectedPassword.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm break-all transition-colors"
                        >
                          {selectedPassword.website}
                        </a>
                      </div>
                    )}

                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Kategori</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                        {getCategoryLabel(selectedPassword.category)}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Güçlülük</p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          selectedPassword.strength === 'very_strong' ? 'bg-green-500' :
                          selectedPassword.strength === 'strong' ? 'bg-green-400' :
                          selectedPassword.strength === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {selectedPassword.strength?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Favori</p>
                      <div className="flex items-center">
                        {selectedPassword.isFavorite ? (
                          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedPassword.notes && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Notlar</p>
                      <p className="text-slate-700 dark:text-slate-300">{selectedPassword.notes}</p>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Oluşturulma</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        {new Date(selectedPassword.createdAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {selectedPassword.lastUsed && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Son Kullanım</p>
                        <p className="text-slate-700 dark:text-slate-300">
                          {new Date(selectedPassword.lastUsed).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex space-x-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-b-3xl">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedPassword(null);
                  }}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 font-medium text-sm"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditForm(selectedPassword);
                  }}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
            <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Yeni Kategori</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Özel kategori oluşturun</p>
                </div>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <div className="space-y-5">
                  {/* Category Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Kategori Adı *
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm"
                      placeholder="örn: Kripto, Freelance"
                    />
                  </div>

                  {/* Color Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Renk
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {CustomCategoryService.getPredefinedColors().map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewCategory({...newCategory, color})}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                            newCategory.color === color ? 'border-slate-800 dark:border-slate-200 scale-110' : 'border-slate-200 dark:border-slate-600'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Icon Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      İkon
                    </label>
                    <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                      {CustomCategoryService.getPredefinedIcons().map((icon) => (
                        <button
                          key={icon}
                          onClick={() => setNewCategory({...newCategory, icon})}
                          className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-lg ${
                            newCategory.icon === icon ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Açıklama
                    </label>
                    <textarea
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none text-sm"
                      placeholder="Kategori hakkında kısa açıklama..."
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex space-x-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-b-3xl">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 font-medium text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={handleAddCustomCategory}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
                >
                  Kategori Ekle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
