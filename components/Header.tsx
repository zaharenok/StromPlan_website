'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const languages = [
    { code: 'en', name: 'EN', flag: '🇬🇧' },
    { code: 'de', name: 'DE', flag: '🇦🇹' },
    { code: 'ru', name: 'RU', flag: '🇷🇺' }
  ];

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      const pathWithoutLocale = pathname.replace(/^\/(en|de|ru)/, '') || '/';
      const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
      router.replace(newPath);
      setIsLanguageOpen(false);
    });
  };

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[1];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xl font-bold text-gray-900 dark:text-white">StromPlan.at</span>
            <span className="ml-2 px-2 py-1 text-xs font-bold bg-green-500 text-white rounded">{t('freeBadge')}</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              disabled={isPending}
            >
              <span className="text-xl">{currentLanguage.flag}</span>
              <span className="font-semibold">{currentLanguage.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLanguageOpen && (
              <div className="absolute top-full mt-2 right-0 bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden z-50 min-w-[120px] border border-gray-200 dark:border-slate-700">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                      lang.code === locale ? 'bg-gray-100 dark:bg-slate-700' : ''
                    }`}
                    disabled={isPending}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-semibold">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
