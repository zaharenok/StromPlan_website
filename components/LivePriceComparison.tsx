'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Provider {
  name: string;
  pricePerKwh: number;
  monthlyFee: number;
  totalMonthly: number;
  savings: number;
  isRecommended: boolean;
}

export default function LivePriceComparison() {
  const t = useTranslations('livePrices');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgConsumption] = useState(3500); // Average Austrian household consumption

  useEffect(() => {
    // Simulate API call with realistic Austrian energy providers
    setTimeout(() => {
      const mockProviders: Provider[] = [
        {
          name: 'Wien Energie',
          pricePerKwh: 0.32,
          monthlyFee: 8.90,
          totalMonthly: 0,
          savings: 0,
          isRecommended: false,
        },
        {
          name: 'Energie AG',
          pricePerKwh: 0.28,
          monthlyFee: 7.50,
          totalMonthly: 0,
          savings: 0,
          isRecommended: true,
        },
        {
          name: 'EVN',
          pricePerKwh: 0.30,
          monthlyFee: 8.20,
          totalMonthly: 0,
          savings: 0,
          isRecommended: false,
        },
        {
          name: 'Energie Steiermark',
          pricePerKwh: 0.29,
          monthlyFee: 7.80,
          totalMonthly: 0,
          savings: 0,
          isRecommended: false,
        },
        {
          name: 'Linz AG',
          pricePerKwh: 0.27,
          monthlyFee: 7.20,
          totalMonthly: 0,
          savings: 0,
          isRecommended: false,
        },
      ];

      // Calculate totals
      const monthlyConsumption = avgConsumption / 12;
      mockProviders.forEach(provider => {
        provider.totalMonthly = (provider.pricePerKwh * monthlyConsumption) + provider.monthlyFee;
      });

      // Sort by total cost
      mockProviders.sort((a, b) => a.totalMonthly - b.totalMonthly);

      // Calculate savings compared to most expensive
      const mostExpensive = mockProviders[mockProviders.length - 1].totalMonthly;
      mockProviders.forEach((provider, index) => {
        provider.savings = mostExpensive - provider.totalMonthly;
        provider.isRecommended = index === 0; // Cheapest is recommended
      });

      setProviders(mockProviders);
      setLoading(false);
    }, 800);
  }, [avgConsumption]);

  const mostExpensive = providers[providers.length - 1];
  const cheapest = providers[0];
  const savingsPercentage = mostExpensive && cheapest
    ? ((mostExpensive.totalMonthly - cheapest.totalMonthly) / cheapest.totalMonthly * 100).toFixed(0)
    : '0';

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ⚡ {t('title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t('subtitle')}
          </p>

          {/* Shocking Stat */}
          <div className="inline-block bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-transform">
            <p className="text-sm font-semibold mb-1">{t('overpaymentAlert')}</p>
            <p className="text-5xl font-bold">{savingsPercentage}%</p>
            <p className="text-sm">{t('difference')}</p>
          </div>
        </div>

        {/* Providers Comparison */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {providers.map((provider, index) => {
              const isExpensive = index === providers.length - 1;
              const isCheapest = index === 0;

              return (
                <div
                  key={provider.name}
                  className={`relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl ${
                    isCheapest ? 'ring-4 ring-green-500' : ''
                  } ${isExpensive ? 'ring-4 ring-red-500' : ''}`}
                >
                  {/* Recommended Badge */}
                  {isCheapest && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        ⭐ {t('recommended')}
                      </span>
                    </div>
                  )}

                  {/* Warning Badge */}
                  {isExpensive && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        ⚠️ {t('mostExpensive')}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
                    {/* Provider Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {provider.name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>💡 {provider.pricePerKwh.toFixed(2)} €/kWh</span>
                        <span>📊 {provider.monthlyFee.toFixed(2)} € {t('perMonth')}</span>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-center md:text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t('monthlyTotal')}
                      </p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-white">
                        {provider.totalMonthly.toFixed(2)}€
                      </p>
                      {provider.savings > 0 && (
                        <p className="text-green-600 dark:text-green-400 font-semibold mt-2">
                          💰 {t('save')} {provider.savings.toFixed(2)}€/{t('month')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress bar showing relative cost */}
                  <div className="mt-4">
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isCheapest
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : isExpensive
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                        style={{
                          width: `${(provider.totalMonthly / mostExpensive.totalMonthly) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl p-8 shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">
                💸 {t('ctaTitle')}
              </h3>
              <p className="text-lg mb-6 opacity-90">
                {t('ctaSubtitle')}
              </p>
              <a
                href="#upload-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('upload-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                {t('ctaButton')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
