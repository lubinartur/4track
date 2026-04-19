import type { Metadata, Viewport } from 'next';
import AppProviders from '@/components/providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: '4track',
  description: '4track',
};

// iOS webview: enable safe-area viewport (no layout changes by default).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
