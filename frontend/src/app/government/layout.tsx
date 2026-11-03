'use client';

import React from 'react';
import { GovernmentProvider } from '@/lib/governmentContext';

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return <GovernmentProvider>{children}</GovernmentProvider>;
}

