interface ImportModalProps {
  importResult: {
    importedPasswords: number;
    importedCategories: number;
    errors: string[];
  };
  onClose: () => void;
}

export default function ImportModal({ importResult, onClose }: ImportModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">İçe Aktarma Tamamlandı</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">İçe aktarma işlemi tamamlandı</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Success Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">İçe Aktarma Özeti</h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                    <p>• {importResult.importedPasswords} şifre içe aktarıldı</p>
                    <p>• {importResult.importedCategories} özel kategori içe aktarıldı</p>
                    {importResult.errors.length > 0 && (
                      <p>• {importResult.errors.length} hata oluştu</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Errors */}
            {importResult.errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200">Hatalar</h4>
                    <div className="text-sm text-red-700 dark:text-red-300 mt-2 max-h-32 overflow-y-auto">
                      {importResult.errors.map((error, index) => (
                        <p key={index} className="mb-1">• {error}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}

