import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SinoFlow — Master Mandarin, Effortlessly',
  description: 'Learn Mandarin Chinese with AI-powered lessons, smart quizzes and a real-time conversation tutor.',
  keywords: ['Mandarin', 'Chinese', 'language learning', 'HSK', 'SinoFlow', 'AI tutor'],
};

export const viewport: Viewport = {
  themeColor: '#05071a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Serif+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
