'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { NavbarActionsContext } from './NavbarActions';

export default function Navbar() {
  const pathname = usePathname();
  const actionsContext = useContext(NavbarActionsContext);
  const actions = actionsContext?.actions || null;

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'MyHub';
      case '/password-manager':
        return 'Şifre Yöneticisi';
      case '/budget-tracker':
        return 'Bütçe Takip';
      case '/routine-tracker':
        return 'Haftalık Rutinim';
      default:
        return 'MyHub';
    }
  };

  const getTitleClassName = () => {
    switch (pathname) {
      case '/':
        return 'text-4xl font-bold gradient-text';
      case '/password-manager':
        return 'text-xl font-semibold text-slate-900 dark:text-white';
      case '/budget-tracker':
        return 'text-4xl font-bold gradient-cool bg-clip-text text-transparent';
      case '/routine-tracker':
        return 'text-4xl font-bold gradient-warm bg-clip-text text-transparent';
      default:
        return 'text-4xl font-bold gradient-text';
    }
  };

  const showBackButton = pathname !== '/';

  return (
    <nav className="fixed top-0 left-0 right-0 glass border-b border-white/20 dark:border-gray-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <>
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
              </>
            )}
            <h1 className={getTitleClassName()}>
              {getPageTitle()}
            </h1>
          </div>
          {actions && (
            <div className="flex items-center space-x-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

