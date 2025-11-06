import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'faq'});

  return {
    title: `${t('title')} - StromPlan.at`,
    description: t('subtitle')
  };
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <FAQContent />
      <Footer />
    </main>
  );
}

function FAQContent() {
  const t = useTranslations('faq');

  const faqs = [
    { key: 'q1' },
    { key: 'q2' },
    { key: 'q3' },
    { key: 'q4' },
    { key: 'q5' },
    { key: 'q6' },
    { key: 'q7' },
    { key: 'q8' }
  ];

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

          {/* FAQ List */}
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.key}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {t(`${faq.key}.question`)}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t(`${faq.key}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
