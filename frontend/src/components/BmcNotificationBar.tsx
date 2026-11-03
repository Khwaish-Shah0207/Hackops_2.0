'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, X, ShieldAlert, ChevronRight, Info } from 'lucide-react';

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
    date: 'Today, 08:30 AM'
  },
  {
    id: 'bmc-ph-02',
    tag: 'BMC Public Health Advisory',
    type: 'health',
    text: 'Residents advised to keep windows closed during early morning thermal inversion hours. Use masks near unpaved construction sectors.',
    date: 'Today, 07:00 AM'
  },
  {
    id: 'bmc-cv-03',
    tag: 'BMC Civic Alert',
    type: 'advisory',
    text: 'Open burning of municipal solid waste, biomass, or scrap plastics is strictly prohibited under MPCB & BMC bylaws. Report violations immediately.',
    date: 'Active Statutory Notice'
  },
  {
    id: 'bmc-env-04',
    tag: 'BMC Dust Mitigation Order',
    type: 'alert',
    text: 'Active water-sprinkling and 35-foot perimeter acoustic-dust barriers mandatory for all civil works in Ward M-East.',
    date: 'Statutory Notice #402'
  }
];

export default function BmcNotificationBar() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('bmc_notification_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('bmc_notification_dismissed', 'true');
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BMC_ADVISORIES.length);
  };

  if (isDismissed) {
    return (
      <div className="w-full bg-slate-900/60 border-b border-slate-800 px-4 py-1.5 flex justify-end">
        <button
          onClick={() => {
            setIsDismissed(false);
            sessionStorage.removeItem('bmc_notification_dismissed');
          }}
          className="text-[11px] text-amber-400/90 hover:text-amber-300 flex items-center space-x-1.5 transition"
        >
          <Bell className="w-3 h-3" />
          <span>Show BMC Advisories</span>
        </button>
      </div>
    );
  }

  const advisory = BMC_ADVISORIES[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-600/30 text-slate-200 text-xs py-2 px-4 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
          {/* BMC Emblem Badge */}
          <span className="shrink-0 inline-flex items-center space-x-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>BMC Mumbai</span>
          </span>

          {/* Advisory Category */}
          <span className="shrink-0 font-semibold text-amber-400 hidden sm:inline">
            {advisory.tag}:
          </span>

          {/* Main Notice Text */}
          <p className="truncate text-slate-200 text-xs font-normal">
            {advisory.text}
          </p>

          {/* Timestamp / Details */}
          <span className="shrink-0 text-[10px] text-slate-400 hidden lg:inline">
            ({advisory.date})
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleNext}
            className="text-[11px] text-slate-400 hover:text-amber-300 px-2 py-0.5 rounded hover:bg-slate-800/60 transition hidden sm:inline"
            title="Next advisory"
          >
            Next ({currentIndex + 1}/{BMC_ADVISORIES.length})
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition"
            title="Dismiss advisory"
            aria-label="Dismiss BMC notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
