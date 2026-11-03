'use client';

import React from 'react';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { AnalyticsView } from '@/components/government/AnalyticsView';

export default function GovernmentAnalyticsPage() {
  return (
    <GovernmentShell>
      <AnalyticsView />
    </GovernmentShell>
  );
}
