'use client';

import React, { useState, useEffect } from 'react';

interface Advisory {
  id: string;
  tag: string;
  type: 'alert' | 'advisory' | 'health';
  text: string;
  date: string;
}

const BMC_ADVISORIES: Advisory[] = [
  {
    id: 'bmc-aq-01',
    tag: 'BMC Air Quality Advisory',
    type: 'alert',
    text: 'Elevated PM2.5/PM10 concentrations detected in Govandi, Chembur and Deonar corridors. Sensitive groups advised to minimize prolonged outdoor exposure.',
    date: 'Today, 08:30 AM',
  },
  {
    id: 'bmc-ph-02',
    tag: 'BMC Public Health Advisory',
    type: 'health',
    text: 'Residents advised to keep windows closed during early morning thermal inversion hours. Use masks near unpaved construction sectors.',
    date: 'Today, 07:00 AM',
  },
  {
    id: 'bmc-cv-03',
    tag: 'BMC Clean Air Directive',
    type: 'advisory',
    text: 'Construction contractors in M/East ward directed to maintain mandatory anti-smog water sprinklers and green barrier netting.',
    date: 'Yesterday'
  }
];

export default function BmcNotificationBar() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isDismissed) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % BMC_ADVISORIES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = BMC_ADVISORIES[currentIdx];

  return (
    <aside
      aria-label="Municipal Environmental Advisory"
      className="bg-forest-dark border-b border-graphite-border text-ivory-warm text-xs font-mono transition-all duration-300 relative z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left Status Indicator */}
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse shrink-0" />
          <span className="font-bold text-accent-orange uppercase tracking-wider text-[10px] shrink-0 border border-accent-orange/40 px-2 py-0.5">
            {current.tag}
          </span>
          <p className="truncate text-sage-muted text-[11px] font-light">
            {current.text}
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3 shrink-0 text-[11px]">
          <span className="text-sage-muted hidden md:inline">{current.date}</span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent-orange hover:underline uppercase text-[10px]"
          >
            {isExpanded ? 'Hide' : 'Details'}
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss advisory banner"
            className="text-sage-muted hover:text-ivory-warm px-1"
          >
            &times;
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-graphite-border/60 bg-forest-charcoal p-4 max-w-7xl mx-auto text-xs space-y-2">
          <p className="text-ivory-warm">{current.text}</p>
          <p className="text-sage-muted text-[10px]">
            Statutory authority: Brihanmumbai Municipal Corporation (BMC) Environment &amp; Solid Waste Cell.
          </p>
        </div>
      )}
    </aside>
  );
}
