import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'TalentGrid India — Engineering Recruitment Platform',
  description: 'High-trust recruitment platform connecting Indian software talent with Tier-1 engineering organizations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-[#f8fafc] text-[#0f172a]">
        {children}
      </body>
    </html>
  );
}
