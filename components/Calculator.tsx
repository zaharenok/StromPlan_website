'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Calculator() {
  const t = useTranslations('calculator');

  const [consumption, setConsumption] = useState<string>('300');
  const [rate, setRate] = useState<string>('0.25');
  const [monthlyFee, setMonthlyFee] = useState<string>('15');
  const [showResults, setShowResults] = useState(false);

  const calculateSavings = () => {
    const consumptionNum = parseFloat(consumption) || 0;
    const rateNum = parseFloat(rate) || 0;
    const feeNum = parseFloat(monthlyFee) || 0;

    const currentCost = (consumptionNum * rateNum) + feeNum;

    // Average market rate for Austria (simplified calculation)
    const avgMarketRate = 0.19; // €/kWh
    const avgMarketFee = 10; // €/month
    const potentialCost = (consumptionNum * avgMarketRate) + avgMarketFee;

    const monthlySavings = Math.max(0, currentCost - potentialCost);
    const yearlySavings = monthlySavings * 12;

    return {
      currentCost: currentCost.toFixed(2),
      monthlySavings: monthlySavings.toFixed(2),
      yearlySavings: yearlySavings.toFixed(2)
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const results = calculateSavings();

  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Monthly Consumption */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('monthlyConsumption')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                    placeholder="300"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 dark:text-gray-400">kWh</span>
                </div>
              </div>

              {/* Current Rate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('currentRate')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                    placeholder="0.25"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 dark:text-gray-400">€</span>
                </div>
              </div>

              {/* Monthly Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  {t('monthlyFee')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                    placeholder="15"
                  />
                  <span className="absolute right-4 top-3 text-gray-500 dark:text-gray-400">€</span>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 mb-8"
            >
              {t('calculate')}
            </button>

            {/* Results */}
            {showResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                {/* Current Cost */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-md">
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    {t('results.currentCost')}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    €{results.currentCost}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">per month</div>
                </div>

                {/* Monthly Savings */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-md border-2 border-green-200 dark:border-green-800">
                  <div className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
                    {t('results.potentialSavings')}
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    €{results.monthlySavings}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">per month</div>
                </div>

                {/* Yearly Savings */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 shadow-md border-2 border-blue-200 dark:border-blue-800">
                  <div className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    {t('results.yearlyTotal')}
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    €{results.yearlySavings}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">per year</div>
                </div>
              </div>
            )}

            {/* Recommendation Text */}
            {showResults && parseFloat(results.monthlySavings) > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <span className="font-semibold">💡 {t('results.recommendation')}</span> €{results.yearlySavings} {t('results.yearlyTotal').toLowerCase()}!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
