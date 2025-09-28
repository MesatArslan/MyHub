import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MyHub
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Kişisel Yaşam Organizatörü
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Şifrelerinizi güvenle saklayın, rutinlerinizi takip edin ve bütçenizi yönetin. 
            Tüm kişisel verileriniz cihazınızda kalır.
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Şifre Yöneticisi */}
          <Link href="/password-manager" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl mb-6 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Şifre Yöneticisi
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Tüm uygulama ve web sitesi şifrelerinizi güvenli bir şekilde saklayın ve yönetin.
              </p>
              <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                Başla
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Günlük Rutinim */}
          <Link href="/routine-tracker" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-2xl mb-6 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Günlük Rutinim
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Günlük rutinlerinizi planlayın ve takip edin. Hedeflerinize ulaşmak için düzenli olun.
              </p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                Başla
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Bütçe Takip */}
          <Link href="/budget-tracker" className="group">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center w-16 h-16 bg-violet-100 dark:bg-violet-900 rounded-2xl mb-6 group-hover:bg-violet-200 dark:group-hover:bg-violet-800 transition-colors">
                <svg className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Bütçe Takip
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Aylık harcamalarınızı takip edin ve finansal hedeflerinizi gerçekleştirin.
              </p>
              <div className="flex items-center text-violet-600 dark:text-violet-400 font-medium group-hover:text-violet-700 dark:group-hover:text-violet-300">
                Başla
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Neden MyHub?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Güvenli</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Verileriniz sadece cihazınızda saklanır</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Hızlı</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Modern teknoloji ile optimize edilmiş</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Kolay</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Sezgisel ve kullanıcı dostu arayüz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
