// app/layout.tsx
import './globals.css';
import { Sora, Orbitron, JetBrains_Mono } from 'next/font/google';
import { getLocale } from 'next-intl/server';

const sora = Sora({ subsets: ['latin'], variable: '--font-geist-sans' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display' });
const jet = JetBrains_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`dark ${sora.variable} ${orbitron.variable} ${jet.variable}`}>
      <body className="bg-[rgb(6,8,13)] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
