import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Environmental Intelligence & Compliance Management System',
  description: 'Air pollution incident detection, source identification, and compliance tracking platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-slate-900/80 border-t border-slate-800 py-6 mt-12 text-center text-xs text-slate-400">
          <p>© 2026 Environmental Intelligence & Compliance System. Decision-support platform for municipal air quality & citizen incident tracking.</p>
          <p className="mt-1 text-slate-500">Notice: This system provides explainable evidence-based decision support. It does not make automated legal declarations of guilt.</p>
        </footer>
      </body>
    </html>
  );
}
