'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'stromplan_cookie_consent';

export default function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const locale = useLocale();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-slate-900 border-t-2 border-primary-600 shadow-2xl animate-slide-up">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Cookie Icon & Text */}
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0">
              <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                🍪 {t('title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {t('description')}
              </p>
              <a
                href={`/${locale}/privacy`}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold"
              >
                {t('learnMore')} →
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={declineCookies}
              className="px-6 py-3 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors text-center"
            >
              {t('decline')}
            </button>
            <button
              onClick={acceptCookies}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-center"
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
