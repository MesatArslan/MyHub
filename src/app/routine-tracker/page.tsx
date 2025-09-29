import Link from 'next/link';

export default function RoutineTracker() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-gray-900 dark:via-pink-900 dark:to-orange-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ana Sayfa
            </Link>
          </div>
          <h1 className="text-4xl font-bold gradient-warm bg-clip-text text-transparent">
            Günlük Rutinim
          </h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Coming Soon Content */}
        <div className="text-center py-20">
          <div className="flex items-center justify-center w-28 h-28 gradient-warm rounded-full mx-auto mb-8">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Yakında Gelecek!
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Günlük rutin takip sisteminiz geliştirme aşamasında. Bu bölümde günlük görevlerinizi planlayıp takip edebileceksiniz.
          </p>

          <div className="glass rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Planlanan Özellikler
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 gradient-warm rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Günlük görev listesi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 gradient-warm rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Habit takibi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 gradient-warm rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">İlerleme grafikleri</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 gradient-warm rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Hatırlatıcılar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 gradient-warm rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Başarı istatistikleri</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 gradient-warm rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Hedef belirleme</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 gradient-warm hover:scale-105 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

