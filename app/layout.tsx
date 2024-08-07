import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { inter, quicksand } from './fonts';
import { Toaster } from 'sonner';
import ThemeSwitcher from './ui/theme-switcher';

export const metadata: Metadata = {
  title: 'Invoice Storage',
  description: 'Sube tus facturas y olvídate de perderlas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body
        className={`${inter.className} ${quicksand.variable} bg-background  antialiased`}
      >
        <Toaster />
        <Providers>
          {children}
          <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6">
            <ThemeSwitcher />
          </div>
        </Providers>
      </body>
    </html>
  );
}
