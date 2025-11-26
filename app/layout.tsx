import './globals.css';
import type { ReactNode } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'AGRIDZIO',
  description: 'منصة للإعلانات الزراعية في الجزائر'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      {/*
        Remove the explicit background colour from the body and rely on the
        global bg-neutral defined in globals.css. This keeps the page
        consistent across all components.
      */}
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <NavBar />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}