interface ExportModalProps {
  onClose: () => void;
}

export default function ExportModal({ onClose }: ExportModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Dışa Aktarma Başarılı</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Şifreleriniz başarıyla dışa aktarıldı</p>
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
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">Dosya İndirildi</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Tüm şifreleriniz ve özel kategorileriniz JSON formatında başarıyla dışa aktarıldı. 
                  Bu dosyayı başka bir bilgisayarda içe aktarabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}

