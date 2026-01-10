import { PasswordCategory, CustomCategory } from '@/types';
import { getCategoryLabel, getCategoryColor } from './utils';

interface PasswordSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilterDropdown: boolean;
  onToggleFilterDropdown: () => void;
  selectedCategories: (PasswordCategory | string)[];
  onToggleCategoryFilter: (category: PasswordCategory | string) => void;
  onClearFilters: () => void;
  customCategories: CustomCategory[];
}

export default function PasswordSearch({
  searchTerm,
  onSearchChange,
  showFilterDropdown,
  onToggleFilterDropdown,
  selectedCategories,
  onToggleCategoryFilter,
  onClearFilters,
  customCategories,
}: PasswordSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Şifre ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="relative filter-dropdown">
          <button
            onClick={onToggleFilterDropdown}
            className={`px-4 py-3 border rounded-xl transition-colors flex items-center space-x-2 ${
              selectedCategories.length > 0
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span className="text-sm font-medium">Filtre</span>
            {selectedCategories.length > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {selectedCategories.length}
              </span>
            )}
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Kategori Filtresi</h3>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={onClearFilters}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      Temizle
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Önceden Tanımlı</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(PasswordCategory).map((category) => (
                        <button
                          key={category}
                          onClick={() => onToggleCategoryFilter(category)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategories.includes(category)
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category, customCategories) }}
                          ></div>
                          <span>{getCategoryLabel(category, customCategories)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {customCategories.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Özel Kategoriler</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {customCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => onToggleCategoryFilter(`custom_${category.id}`)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedCategories.includes(`custom_${category.id}`)
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700'
                                : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                            }`}
                          >
                            <span className="text-sm">{category.icon}</span>
                            <span>{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <button className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

