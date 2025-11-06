import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'about'});
  return {
    title: `${t('title')} - StromPlan.at`,
    description: t('subtitle')
  };
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <AboutContent />
      <Footer />
    </main>
  );
}

function AboutContent() {
  const t = useTranslations('about');

  return (
    <section className="pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('mission.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{t('mission.content')}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('vision.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{t('vision.content')}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('values.title')}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{t('values.content')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
