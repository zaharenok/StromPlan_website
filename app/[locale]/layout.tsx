import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {locales, type Locale} from '@/i18n/request';
import { Inter } from 'next/font/google';
import CookieConsent from '@/components/CookieConsent';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

// Metadata for different languages
const metadataByLocale: Record<Locale, Metadata> = {
  en: {
    title: 'StromPlan.at - Compare Electricity Prices in Austria | Save Up to 140%',
    description: 'Upload your electricity bill and discover how much you overpay. Free analysis, transparent comparison of all Austrian energy providers. Save up to 140% annually!',
    keywords: ['electricity comparison', 'Austria', 'energy prices', 'save money', 'stromvergleich'],
  },
  de: {
    title: 'StromPlan.at - Strompreise in Österreich vergleichen | Bis zu 140% sparen',
    description: 'Laden Sie Ihre Stromrechnung hoch und entdecken Sie, wie viel Sie zu viel zahlen. Kostenlose Analyse, transparenter Vergleich aller österreichischen Energieanbieter. Sparen Sie bis zu 140% jährlich!',
    keywords: ['Stromvergleich', 'Österreich', 'Energiepreise', 'Geld sparen', 'Stromanbieter'],
  },
  ru: {
    title: 'StromPlan.at - Сравнение цен на электроэнергию в Австрии | Экономия до 140%',
    description: 'Загрузите свой счет за электричество и узнайте, сколько вы переплачиваете. Бесплатный анализ, прозрачное сравнение всех австрийских поставщиков энергии. Экономьте до 140% ежегодно!',
    keywords: ['сравнение электричества', 'Австрия', 'цены на энергию', 'экономия денег', 'поставщики электроэнергии'],
  },
};

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const localeMetadata = metadataByLocale[locale as Locale] || metadataByLocale.en;

  return {
    ...localeMetadata,
    icons: {
      icon: '/icon.svg',
      apple: '/apple-icon.svg',
    },
    openGraph: {
      title: localeMetadata.title as string,
      description: localeMetadata.description as string,
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: localeMetadata.title as string,
      description: localeMetadata.description as string,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
