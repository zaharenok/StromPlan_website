import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'help'});
  return {
    title: `${t('title')} - StromPlan.at`,
    description: t('subtitle')
  };
}

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <HelpContent />
      <Footer />
    </main>
  );
}

function HelpContent() {
  const t = useTranslations('help');

  const topics = ['topic1', 'topic2', 'topic3', 'topic4'];

  return (
    <section className="pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topics.map((topic) => (
              <div key={topic} className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {t(`${topic}.title`)}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {t(`${topic}.content`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
