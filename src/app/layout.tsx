import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DecorReach | AI-Powered Buyer Discovery & Email Outreach Platform',
  description:
    'Find relevant retailers, interior design studios, distributors, and buyers across the United States with multi-API business discovery and AI personalized cold outreach.',
  keywords: [
    'home decor wholesale',
    'b2b buyer discovery',
    'interior designers usa',
    'retail store discovery',
    'home decor exporter outreach',
    'api web development',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#080c14] text-slate-100">
        {children}
      </body>
    </html>
  );
}
