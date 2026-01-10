import { PasswordResponseDto } from '@/dto';
import { CustomCategory } from '@/types';

interface CategoryManagementProps {
  customCategories: CustomCategory[];
  passwords: PasswordResponseDto[];
  onClose: () => void;
  onEdit: (category: CustomCategory) => void;
  onDelete: (categoryId: string) => void;
  onNewCategory: () => void;
}

export default function CategoryManagement({
  customCategories,
  passwords,
  onClose,
  onEdit,
  onDelete,
  onNewCategory,
}: CategoryManagementProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kategori Yönetimi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Özel kategorilerinizi düzenleyin veya silin</p>
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
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {customCategories.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Henüz özel kategori eklenmemiş</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Yeni kategori eklemek için &quot;Yeni Kategori&quot; butonunu kullanın</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customCategories.map((category) => {
                const passwordCount = passwords.filter(p => p.customCategoryId === category.id).length;
                return (
                  <div key={category.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{category.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {passwordCount} şifre
                          </p>
                          {category.description && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onEdit(category)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                          title="Düzenle"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`"${category.name}" kategorisini silmek istediğinizden emin misiniz? Bu kategoriye ait şifreler "Diğer" kategorisine taşınacak.`)) {
                              onDelete(category.id);
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg"
                          title="Sil"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              onNewCategory();
            }}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            Yeni Kategori Ekle
          </button>
        </div>
      </div>
    </div>
  );
}

