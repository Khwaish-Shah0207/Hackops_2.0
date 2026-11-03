'use client';

import React from 'react';
import Link from 'next/link';
import CitizenNavbar from '@/components/citizen/CitizenNavbar';
import EditorialFooter from '@/components/shared/EditorialFooter';
import { AnalyticsView } from '@/components/government/AnalyticsView';

export default function PublicAnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#14251F] text-[#EAE8DF] font-sans flex flex-col selection:bg-[#C77B43] selection:text-[#14251F]">
      <CitizenNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#A8B5A5]">
          <Link href="/" className="hover:text-[#EAE8DF]">Platform Home</Link>
          <span>/</span>
          <span className="text-[#C77B43] font-bold">Environmental Analytics</span>
        </nav>

        <div className="border-t border-[#A8B5A5]/20">
          <AnalyticsView />
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}
