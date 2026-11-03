import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Environmental Intelligence & Compliance Management Platform',
  description: 'Evidence-based multi-criteria source apportionment, Lagrangian backward trajectory modeling, and compliance decision support system.',
  keywords: ['Air Pollution', 'Environmental Compliance', 'Source Apportionment', 'HYSPLIT Trajectory', 'CPCB AQI', 'EPA SPECIATE', 'Chemical Mass Balance'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700;800&family=Source+Sans+3:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-forest-charcoal text-ivory-warm antialiased selection:bg-accent-orange selection:text-ivory-warm">
        {children}
      </body>
    </html>
  );
}
