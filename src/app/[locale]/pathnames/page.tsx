import {Locale} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';
import {use} from 'react';
import PageLayout from '@/components/PageLayout';

type Props = { params: Promise<{ locale: Locale }> };

export default function PathnamesPage({ params }: Props) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const messages = getMessages();

  return (
    <PageLayout title={`Messages for ${locale}`}>
      <pre className="text-sm bg-gray-900 text-white p-4 rounded-lg overflow-auto">
        {JSON.stringify(messages, null, 2)}
      </pre>
    </PageLayout>
  );
}
