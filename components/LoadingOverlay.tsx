'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

type LoadingStep = 'uploading' | 'sending' | 'analyzing' | 'preparing';

export default function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const t = useTranslations('loadingSteps');
  const [currentStep, setCurrentStep] = useState<LoadingStep>('uploading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep('uploading');
      setProgress(0);
      return;
    }

    // Simulate progress through steps - 3 seconds per step (12 seconds total)
    const steps: LoadingStep[] = ['uploading', 'sending', 'analyzing', 'preparing'];
    let stepIndex = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 0.8; // ~0.8% every 100ms = 8% per second = 3 seconds per 25%

      // Update step based on progress (each step takes 3 seconds)
      if (currentProgress >= 25 && stepIndex === 0) {
        stepIndex = 1;
        setCurrentStep('sending');
      } else if (currentProgress >= 50 && stepIndex === 1) {
        stepIndex = 2;
        setCurrentStep('analyzing');
      } else if (currentProgress >= 75 && stepIndex === 2) {
        stepIndex = 3;
        setCurrentStep('preparing');
      }

      setProgress(Math.min(currentProgress, 95)); // Cap at 95% until actual completion

      if (currentProgress >= 95) {
        clearInterval(progressInterval);
      }
    }, 100); // Update every 100ms

    return () => clearInterval(progressInterval);
  }, [isVisible]);

  if (!isVisible) return null;

  const steps = [
    { id: 'uploading', icon: '📤', label: t('uploading') },
    { id: 'sending', icon: '🚀', label: t('sending') },
    { id: 'analyzing', icon: '🤖', label: t('analyzing') },
    { id: 'preparing', icon: '📊', label: t('preparing') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
        {/* Loading Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 border-8 border-primary-200 dark:border-primary-900 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-transparent border-t-primary-600 rounded-full animate-spin"></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-4 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl">{steps.find(s => s.id === currentStep)?.icon}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('progress')}
            </span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {progress}%
            </span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {steps.find(s => s.id === currentStep)?.label}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('pleaseWait')}
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isCurrent
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-500'
                    : isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-gray-50 dark:bg-slate-700/50'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-primary-500 animate-pulse'
                      : isCompleted
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : isCurrent ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  ) : (
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      isCurrent
                        ? 'text-primary-700 dark:text-primary-300'
                        : isCompleted
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.icon} {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
