import Link from 'next/link';

interface PasswordHeaderProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryManagement: () => void;
  onNewCategory: () => void;
  onNewPassword: () => void;
}

export default function PasswordHeader({
  onExport,
  onImport,
  onCategoryManagement,
  onNewCategory,
  onNewPassword,
}: PasswordHeaderProps) {
  return (
    <div className="glass border-b border-white/20 dark:border-gray-700/50">
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
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600"></div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
              Şifre Yöneticisi
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onExport}
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
                onChange={onImport}
                className="hidden"
              />
            </label>
            <button
              onClick={onCategoryManagement}
              className="gradient-primary hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Kategorileri Yönet
            </button>
            <button
              onClick={onNewCategory}
              className="gradient-warm hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Yeni Kategori
            </button>
            <button
              onClick={onNewPassword}
              className="gradient-cool hover:scale-105 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center shadow-sm hover:shadow-md"
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
  );
}

