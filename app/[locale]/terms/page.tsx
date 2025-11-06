import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'terms'});
  return {
    title: `${t('title')} - StromPlan.at`,
    description: t('subtitle')
  };
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <TermsContent />
      <Footer />
    </main>
  );
}

function TermsContent() {
  const t = useTranslations('terms');

  const sections = ['section1', 'section2', 'section3', 'section4', 'section5'];

  return (
    <section className="pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('lastUpdated')}: {t('date')}
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t(`${section}.title`)}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {t(`${section}.content`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
