import { CustomCategory } from '@/types';
import { CustomCategoryService } from '@/services';

interface CategoryModalProps {
  editingCategory: CustomCategory | null;
  categoryData: {
    name: string;
    color: string;
    icon: string;
    description: string;
  };
  onCategoryDataChange: (data: { name: string; color: string; icon: string; description: string }) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CategoryModal({
  editingCategory,
  categoryData,
  onCategoryDataChange,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {editingCategory ? 'Kategori bilgilerini güncelleyin' : 'Özel kategori oluşturun'}
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
        <div className="p-6">
          <div className="space-y-5">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Kategori Adı *
              </label>
              <input
                type="text"
                value={categoryData.name}
                onChange={(e) => onCategoryDataChange({ ...categoryData, name: e.target.value })}
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
                    onClick={() => onCategoryDataChange({ ...categoryData, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      categoryData.color === color ? 'border-slate-800 dark:border-slate-200 scale-110' : 'border-slate-200 dark:border-slate-600'
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
                    onClick={() => onCategoryDataChange({ ...categoryData, icon })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-lg ${
                      categoryData.icon === icon ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
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
                value={categoryData.description}
                onChange={(e) => onCategoryDataChange({ ...categoryData, description: e.target.value })}
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
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 font-medium text-sm"
          >
            İptal
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            {editingCategory ? 'Güncelle' : 'Kategori Ekle'}
          </button>
        </div>
      </div>
    </div>
  );
}

