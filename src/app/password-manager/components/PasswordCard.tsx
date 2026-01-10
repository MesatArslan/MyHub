import { PasswordResponseDto } from '@/dto';
import { CustomCategory, PasswordCategory } from '@/types';
import { getCategoryLabel, getCategoryColor } from './utils';

interface PasswordCardProps {
  password: PasswordResponseDto;
  customCategories: CustomCategory[];
  showPassword: { [key: string]: boolean };
  onTogglePasswordVisibility: (id: string) => void;
  onToggleFavorite: (password: PasswordResponseDto) => void;
  onEdit: (password: PasswordResponseDto) => void;
  onDelete: (password: PasswordResponseDto) => void;
  onDetail: (password: PasswordResponseDto) => void;
  onCopyToClipboard: (text: string) => void;
}

export default function PasswordCard({
  password,
  customCategories,
  showPassword,
  onTogglePasswordVisibility,
  onToggleFavorite,
  onEdit,
  onDelete,
  onDetail,
  onCopyToClipboard,
}: PasswordCardProps) {
  return (
    <div
      key={password.id}
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 group cursor-pointer"
      onClick={() => onDetail(password)}
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
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(password);
            }}
            className={`p-1.5 transition-colors cursor-pointer ${
              password.isFavorite
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-slate-400 hover:text-yellow-500'
            }`}
            title={password.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
          >
            <svg className="w-4 h-4" fill={password.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(password);
            }}
            className="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Düzenle"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(password);
            }}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Sil"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Category */}
      <div className="flex items-center justify-between mb-4">
        {password.category && (
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
        )}
      </div>

      {/* Username and Password Display */}
      <div className="space-y-3">
        {/* Username */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Kullanıcı Adı</p>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {password.username}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyToClipboard(password.username);
              }}
              className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Kullanıcı adını kopyala"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-xs text-slate-500 dark:text-slate-400">Şifre</p>
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
              <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                {showPassword[password.id] ? password.password : '••••••••••'}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePasswordVisibility(password.id);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
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
                  onCopyToClipboard(password.password);
                }}
                className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Şifreyi kopyala"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

