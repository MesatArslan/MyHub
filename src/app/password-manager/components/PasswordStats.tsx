import { PasswordResponseDto } from '@/dto';

interface PasswordStatsProps {
  passwords: PasswordResponseDto[];
}

export default function PasswordStats({ passwords }: PasswordStatsProps) {
  const favoriteCount = passwords.filter(p => p.isFavorite).length;
  const strongPasswordCount = passwords.filter(p => p.strength === 'strong' || p.strength === 'very_strong').length;
  const categoryCount = new Set(passwords.map(p => p.category)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="glass rounded-xl p-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Toplam Şifre</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{passwords.length}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Favoriler</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{favoriteCount}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Güçlü Şifreler</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{strongPasswordCount}</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Kategoriler</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{categoryCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

