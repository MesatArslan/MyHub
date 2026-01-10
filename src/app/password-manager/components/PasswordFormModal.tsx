import { CustomCategory, PasswordCategory } from '@/types';

interface PasswordFormData {
  appName: string;
  username: string;
  password: string;
  website: string;
  notes: string;
  category: PasswordCategory;
  customCategoryId: string;
  tags: string[];
  isFavorite: boolean;
  googleAuthenticator: string;
  phoneNumber: string;
}

interface PasswordFormModalProps {
  mode: 'add' | 'edit';
  formData: PasswordFormData;
  formErrors: { [key: string]: string };
  customCategories: CustomCategory[];
  showPassword: { [key: string]: boolean };
  onFormDataChange: (data: PasswordFormData) => void;
  onTogglePasswordVisibility: (key: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function PasswordFormModal({
  mode,
  formData,
  formErrors,
  customCategories,
  showPassword,
  onFormDataChange,
  onTogglePasswordVisibility,
  onClose,
  onSubmit,
}: PasswordFormModalProps) {
  const passwordKey = mode === 'add' ? 'new' : 'edit';

  const handleFieldChange = (field: keyof PasswordFormData, value: string | boolean | PasswordCategory) => {
    onFormDataChange({ ...formData, [field]: value });
    // Clear error when user types
    if (formErrors[field]) {
      // This will be handled by parent component
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === 'add' ? 'Yeni Şifre Ekle' : 'Şifre Düzenle'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'add' ? 'Güvenli şifre bilgilerinizi kaydedin' : 'Şifre bilgilerinizi güncelleyin'}
            </p>
          </div>
          <button
            onClick={onClose}
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
                  value={formData.appName}
                  onChange={(e) => handleFieldChange('appName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                    formErrors.appName
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="örn: Instagram, Twitter"
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
                  value={formData.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
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
                  type={showPassword[passwordKey] ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 transition-all duration-200 text-sm ${
                    formErrors.password
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'
                  }`}
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => onTogglePasswordVisibility(passwordKey)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  title={showPassword[passwordKey] ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword[passwordKey] ? (
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
                  value={formData.website}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
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
                  value={formData.googleAuthenticator}
                  onChange={(e) => handleFieldChange('googleAuthenticator', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                  placeholder="Backup kodları veya secret key"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                2FA için backup kodları veya secret key&apos;i buraya yazabilirsiniz
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
                  value={formData.phoneNumber}
                  onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
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
                  value={formData.customCategoryId ? `custom_${formData.customCategoryId}` : formData.category}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith('custom_')) {
                      onFormDataChange({
                        ...formData,
                        customCategoryId: value.replace('custom_', ''),
                        category: PasswordCategory.OTHER
                      });
                    } else {
                      onFormDataChange({
                        ...formData,
                        category: value as PasswordCategory,
                        customCategoryId: ''
                      });
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
                  value={formData.notes}
                  onChange={(e) => handleFieldChange('notes', e.target.value)}
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
                id={`isFavorite-${mode}`}
                checked={formData.isFavorite}
                onChange={(e) => handleFieldChange('isFavorite', e.target.checked)}
                className="w-4 h-4 text-indigo-600 bg-white border-slate-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-600 dark:border-slate-500"
              />
              <label htmlFor={`isFavorite-${mode}`} className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Favori olarak işaretle
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 font-medium text-sm"
          >
            İptal
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            {mode === 'add' ? 'Kaydet' : 'Güncelle'}
          </button>
        </div>
      </div>
    </div>
  );
}

