import { PasswordResponseDto } from '@/dto';
import { CustomCategory, PasswordCategory } from '@/types';
import { getCategoryLabel, getCategoryColor } from './utils';

interface PasswordDetailModalProps {
  password: PasswordResponseDto;
  customCategories: CustomCategory[];
  showPassword: { [key: string]: boolean };
  onClose: () => void;
  onEdit: (password: PasswordResponseDto) => void;
  onTogglePasswordVisibility: (id: string) => void;
  onCopyToClipboard: (text: string) => void;
}

export default function PasswordDetailModal({
  password,
  customCategories,
  showPassword,
  onClose,
  onEdit,
  onTogglePasswordVisibility,
  onCopyToClipboard,
}: PasswordDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-xl">
              {password.appName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{password.appName}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Detaylar</p>
            </div>
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

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Kullanıcı Adı</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{password.username}</p>
                </div>
                <button
                  onClick={() => onCopyToClipboard(password.username)}
                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Kullanıcı adını kopyala"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Şifre</p>
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
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg text-slate-900 dark:text-white">
                      {showPassword[password.id] ? password.password : '••••••••••'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onTogglePasswordVisibility(password.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
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
                    onClick={() => onCopyToClipboard(password.password)}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
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
              {password.website && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Website</p>
                  <a
                    href={password.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm break-all transition-colors"
                  >
                    {password.website}
                  </a>
                </div>
              )}

              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Kategori</p>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getCategoryColor(password.category || PasswordCategory.OTHER, customCategories, password.customCategoryId) }}
                >
                  {password.customCategoryId && customCategories.find(c => c.id === password.customCategoryId)?.icon && (
                    <span className="mr-1">
                      {customCategories.find(c => c.id === password.customCategoryId)?.icon}
                    </span>
                  )}
                  {getCategoryLabel(password.category || PasswordCategory.OTHER, customCategories, password.customCategoryId)}
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Favori</p>
                <div className="flex items-center">
                  {password.isFavorite ? (
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
            {password.notes && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Notlar</p>
                <p className="text-slate-700 dark:text-slate-300">{password.notes}</p>
              </div>
            )}

            {/* 2FA Information */}
            {(password.googleAuthenticator || password.phoneNumber) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {password.googleAuthenticator && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Google Authenticator / 2FA</p>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-700 dark:text-slate-300 font-mono text-sm break-all">
                        {password.googleAuthenticator}
                      </p>
                      <button
                        onClick={() => onCopyToClipboard(password.googleAuthenticator!)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer ml-2"
                        title="2FA kodunu kopyala"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {password.phoneNumber && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Telefon Numarası</p>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-700 dark:text-slate-300">
                        {password.phoneNumber}
                      </p>
                      <button
                        onClick={() => onCopyToClipboard(password.phoneNumber!)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer ml-2"
                        title="Telefon numarasını kopyala"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Oluşturulma</p>
                <p className="text-slate-700 dark:text-slate-300">
                  {new Date(password.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {password.lastUsed && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Son Kullanım</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {new Date(password.lastUsed).toLocaleDateString('tr-TR', {
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
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 font-medium text-sm"
          >
            Kapat
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(password);
            }}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            Düzenle
          </button>
        </div>
      </div>
    </div>
  );
}

