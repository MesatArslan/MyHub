'use client';

import { useState, useEffect, useCallback } from 'react';
import { PasswordResponseDto } from '@/dto';
import { PasswordCategory, CustomCategory } from '@/types';
import { PasswordService, CustomCategoryService } from '@/services';
import { useNavbarActions } from '@/app/components/NavbarActions';
import PasswordStats from './components/PasswordStats';
import PasswordSearch from './components/PasswordSearch';
import PasswordList from './components/PasswordList';
import PasswordFormModal from './components/PasswordFormModal';
import PasswordDetailModal from './components/PasswordDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import CategoryModal from './components/CategoryModal';
import CategoryManagement from './components/CategoryManagement';
import ImportModal from './components/ImportModal';
import ExportModal from './components/ExportModal';

export default function PasswordManager() {
  const [passwords, setPasswords] = useState<PasswordResponseDto[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<PasswordResponseDto | null>(null);
  const [selectedPassword, setSelectedPassword] = useState<PasswordResponseDto | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<(PasswordCategory | string)[]>([]);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importResult, setImportResult] = useState<{ importedPasswords: number, importedCategories: number, errors: string[] } | null>(null);

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
  const { setActions } = useNavbarActions();

  const loadPasswords = useCallback(async () => {
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
  }, [setLoading, setError, setPasswords, setCustomCategories]);

  // Load passwords on component mount
  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showFilterDropdown && !target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  // ESC key handling removed - modal only closes with close button

  // Load passwords on component mount
  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showFilterDropdown && !target.closest('.filter-dropdown')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterDropdown]);

  // ESC key handling removed - modal only closes with close button

  const handleExport = useCallback(async () => {
    try {
      const blob = await PasswordService.exportData();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sifreler-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setShowExportModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dışa aktarma sırasında hata oluştu');
    }
  }, [setShowExportModal, setError]);

  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await PasswordService.importData(file);
      setImportResult(result);
      setShowImportModal(true);
      
      // Reload passwords and categories after import
      await loadPasswords();
      
      // Reset file input
      event.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İçe aktarma sırasında hata oluştu');
    }
  }, [setShowImportModal, setImportResult, setError, loadPasswords]);

  // Set navbar actions
  useEffect(() => {
    setActions(
      <>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Dışa Aktar
        </button>
        <label className="bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md cursor-pointer">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          İçe Aktar
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
        <button
          onClick={() => setShowCategoryManagement(true)}
          className="gradient-primary hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Kategorileri Yönet
        </button>
        <button
          onClick={() => {
            setShowCategoryModal(true);
            setEditingCategory(null);
            setNewCategory({ name: '', color: '#3B82F6', icon: '🏠', description: '' });
          }}
          className="gradient-warm hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Kategori
        </button>
        <button
          onClick={() => {
            setShowAddForm(true);
            setFormErrors({});
          }}
          className="gradient-cool hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Şifre
        </button>
      </>
    );

    return () => {
      setActions(null);
    };
  }, [setActions, handleExport, handleImport, setShowCategoryManagement, setShowCategoryModal, setEditingCategory, setNewCategory, setShowAddForm, setFormErrors]);

  const filteredPasswords = passwords.filter(password => {
    // Search filter
    const matchesSearch = password.appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(category => {
        if (typeof category === 'string' && category.startsWith('custom_')) {
          return password.customCategoryId === category.replace('custom_', '');
        }
        return password.category === category;
      });

    return matchesSearch && matchesCategory;
  });

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
      CustomCategoryService.createCustomCategory(
        newCategory.name,
        newCategory.color,
        newCategory.icon,
        newCategory.description
      );
      
      // Reload custom categories from storage to ensure consistency
      const updatedCategories = CustomCategoryService.getCustomCategories();
      setCustomCategories(updatedCategories);
      setNewCategory({ name: '', color: '#3B82F6', icon: '🏠', description: '' });
      setShowCategoryModal(false);
      setEditingCategory(null);
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
        setShowDeleteModal(false);
        setPasswordToDelete(null);
      } else {
        setError('Şifre silinirken hata oluştu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre silinirken hata oluştu');
    }
  };

  const openDeleteModal = (password: PasswordResponseDto) => {
    setPasswordToDelete(password);
    setShowDeleteModal(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast bildirimi eklenebilir
  };

  const toggleCategoryFilter = (category: PasswordCategory | string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
  };

  const toggleFavorite = async (password: PasswordResponseDto) => {
    try {
      setError(null);
      const updatedPassword = await PasswordService.toggleFavorite(password.id);
      if (updatedPassword) {
        setPasswords(passwords.map(p => p.id === password.id ? updatedPassword : p));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Favori durumu güncellenirken hata oluştu');
    }
  };

  const handleEditCategory = (category: CustomCategory) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      color: category.color,
      icon: category.icon || '🏠',
      description: category.description || ''
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setError(null);
      const success = CustomCategoryService.deleteCustomCategory(categoryId);
      if (success) {
        // Reload custom categories
        const updatedCategories = CustomCategoryService.getCustomCategories();
        setCustomCategories(updatedCategories);
        
        // Remove from selected filters if it was selected
        setSelectedCategories(prev => prev.filter(cat => cat !== `custom_${categoryId}`));
        
        // Update passwords that were using this category
        const updatedPasswords = passwords.map(password => {
          if (password.customCategoryId === categoryId) {
            return {
              ...password,
              customCategoryId: undefined,
              category: PasswordCategory.OTHER
            };
          }
          return password;
        });
        setPasswords(updatedPasswords);
      } else {
        setError('Kategori silinirken hata oluştu');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategori silinirken hata oluştu');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    if (!newCategory.name.trim()) {
      setError('Kategori adı gereklidir');
      return;
    }

    try {
      setError(null);
      const updatedCategory = CustomCategoryService.updateCustomCategory(editingCategory.id, {
        name: newCategory.name,
        color: newCategory.color,
        icon: newCategory.icon,
        description: newCategory.description
      });
      
      if (updatedCategory) {
        // Reload custom categories
        const updatedCategories = CustomCategoryService.getCustomCategories();
        setCustomCategories(updatedCategories);
        setNewCategory({ name: '', color: '#3B82F6', icon: '🏠', description: '' });
        setShowCategoryModal(false);
        setEditingCategory(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategori güncellenirken hata oluştu');
    }
  };


  return (
    <div className="relative min-h-screen">
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 -z-10"></div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <PasswordStats passwords={passwords} />

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

        <PasswordSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilterDropdown={showFilterDropdown}
          onToggleFilterDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
          selectedCategories={selectedCategories}
          onToggleCategoryFilter={toggleCategoryFilter}
          onClearFilters={clearAllFilters}
          customCategories={customCategories}
        />

        <PasswordList
          passwords={filteredPasswords}
          customCategories={customCategories}
          showPassword={showPassword}
          searchTerm={searchTerm}
          loading={loading}
          onTogglePasswordVisibility={togglePasswordVisibility}
          onToggleFavorite={toggleFavorite}
          onEdit={openEditForm}
          onDelete={openDeleteModal}
          onDetail={openDetailModal}
          onCopyToClipboard={copyToClipboard}
        />

        {/* Edit Password Modal */}
        {showEditForm && (
          <PasswordFormModal
            mode="edit"
            formData={newEntry}
            formErrors={formErrors}
            customCategories={customCategories}
            showPassword={showPassword}
            onFormDataChange={(data) => {
              setNewEntry(data);
              // Clear errors for changed fields
              const updatedErrors = { ...formErrors };
              Object.keys(data).forEach(key => {
                if (updatedErrors[key]) {
                  delete updatedErrors[key];
                }
              });
              setFormErrors(updatedErrors);
            }}
            onTogglePasswordVisibility={togglePasswordVisibility}
            onClose={() => {
                    setShowEditForm(false);
                    setFormErrors({});
                    setSelectedPassword(null);
                  }}
            onSubmit={handleEditPassword}
          />
        )}

        {/* Add Password Modal */}
        {showAddForm && (
          <PasswordFormModal
            mode="add"
            formData={newEntry}
            formErrors={formErrors}
            customCategories={customCategories}
            showPassword={showPassword}
            onFormDataChange={(data) => {
              setNewEntry(data);
              // Clear errors for changed fields
              const updatedErrors = { ...formErrors };
              Object.keys(data).forEach(key => {
                if (updatedErrors[key]) {
                  delete updatedErrors[key];
                }
              });
              setFormErrors(updatedErrors);
            }}
            onTogglePasswordVisibility={togglePasswordVisibility}
            onClose={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
            onSubmit={handleAddPassword}
          />
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedPassword && (
          <PasswordDetailModal
            password={selectedPassword}
            customCategories={customCategories}
            showPassword={showPassword}
            onClose={() => {
                    setShowDetailModal(false);
                    setSelectedPassword(null);
                  }}
            onEdit={openEditForm}
            onTogglePasswordVisibility={togglePasswordVisibility}
            onCopyToClipboard={copyToClipboard}
          />
        )}

        {/* Category Management Modal */}
        {showCategoryManagement && (
          <CategoryManagement
            customCategories={customCategories}
            passwords={passwords}
            onClose={() => setShowCategoryManagement(false)}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            onNewCategory={() => {
                    setShowCategoryManagement(false);
                    setShowCategoryModal(true);
                    setEditingCategory(null);
                    setNewCategory({ name: '', color: '#3B82F6', icon: '🏠', description: '' });
                  }}
          />
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <CategoryModal
            editingCategory={editingCategory}
            categoryData={newCategory}
            onCategoryDataChange={(data) => setNewCategory(data)}
            onClose={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setNewCategory({ name: '', color: '#3B82F6', icon: '🏠', description: '' });
                  }}
            onSubmit={editingCategory ? handleUpdateCategory : handleAddCustomCategory}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && passwordToDelete && (
          <DeleteConfirmModal
            password={passwordToDelete}
            onConfirm={deletePassword}
            onCancel={() => {
                    setShowDeleteModal(false);
                    setPasswordToDelete(null);
                  }}
          />
        )}

        {/* Export Success Modal */}
        {showExportModal && (
          <ExportModal
            onClose={() => setShowExportModal(false)}
          />
        )}

        {/* Import Result Modal */}
        {showImportModal && importResult && (
          <ImportModal
            importResult={importResult}
            onClose={() => {
                    setShowImportModal(false);
                    setImportResult(null);
                  }}
          />
        )}
      </div>
    </div>
  );
}
