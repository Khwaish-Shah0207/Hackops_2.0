'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GovernmentProvider, useGovernment } from '@/lib/governmentContext';

interface GovernmentShellProps {
  children: React.ReactNode;
}

function ShellNavigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { incidents, actions, reports } = useGovernment();

  const activeIncidentsCount = incidents.filter(
    (i) => i.status === 'Submitted' || i.status === 'Under Review' || i.status === 'Under Investigation'
  ).length;

  const pendingActionsCount = actions.filter(
    (a) => a.status === 'Assigned' || a.status === 'In Progress' || a.status === 'Awaiting Verification'
  ).length;

  const navItems = [
    {
      label: 'Overview / Dashboard',
      href: '/government',
      exact: true,
      badge: null,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" strokeWidth="1.5" />
          <rect x="14" y="14" width="7" height="7" strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      label: 'Incident Management',
      href: '/government/incidents',
      exact: false,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : null,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Investigation Workspace',
      href: '/government/investigation',
      exact: false,
      badge: 'Active',
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v3m0 12v3M3 12h3m12 0h3" />
        </svg>
      ),
    },
    {
      label: 'Evidence & Source Analysis',
      href: '/government/evidence',
      exact: false,
      badge: null,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      label: 'Investigation Reports',
      href: '/government/reports',
      exact: false,
      badge: reports.length,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Corrective Actions',
      href: '/government/actions',
      exact: false,
      badge: pendingActionsCount > 0 ? pendingActionsCount : null,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: 'Analytics & Trends',
      href: '/government/analytics',
      exact: false,
      badge: null,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      label: 'Officer Profile',
      href: '/government/profile',
      exact: false,
      badge: null,
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#14251F] border-b border-[#A8B5A5]/20 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#A8B5A5] hover:text-[#EAE8DF] focus:outline-none"
              aria-label="Toggle navigation drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link href="/government" className="flex items-center gap-3 group">
              <div className="w-2.5 h-2.5 bg-[#C77B43]" />
              <div className="flex flex-col">
                <span className="font-sans text-xs font-bold tracking-wider uppercase text-[#EAE8DF]">
                  Environmental Intelligence Platform
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-[#C77B43]">
                  Government Regulatory Console
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-block font-mono text-[11px] text-[#A8B5A5]/60 pl-3 border-l border-[#A8B5A5]/20">
              Statutory Jurisdiction: Air Act 1981 Section 21 &amp; 31A
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4">
            {/* Quick Cross-Portal Switcher */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/citizen"
                className="px-2.5 py-1 text-[11px] font-mono text-[#A8B5A5] hover:text-[#EAE8DF] border border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40 transition-colors"
              >
                Citizen Portal &rarr;
              </Link>
              <Link
                href="/"
                className="px-2.5 py-1 text-[11px] font-mono text-[#A8B5A5] hover:text-[#EAE8DF] border border-[#A8B5A5]/20 hover:border-[#A8B5A5]/40 transition-colors"
              >
                Landing
              </Link>
            </div>

            {/* Officer Badge */}
            <Link
              href="/government/profile"
              className="flex items-center gap-2.5 px-3 py-1.5 bg-[#252C28] border border-[#A8B5A5]/25 hover:border-[#C77B43] transition-colors"
            >
              <div className="w-6 h-6 rounded-none bg-[#C77B43]/20 border border-[#C77B43] flex items-center justify-center text-[10px] font-mono font-bold text-[#C77B43]">
                RP
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans text-[11px] font-bold text-[#EAE8DF] leading-tight">
                  Officer R. K. Patil
                </span>
                <span className="font-mono text-[9px] text-[#A8B5A5] leading-tight">
                  MPCB Surveillance Wing
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1B201D] border-b border-[#A8B5A5]/20 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-mono transition-colors ${
                  isActive
                    ? 'bg-[#252C28] text-[#C77B43] border-l-2 border-[#C77B43] font-bold'
                    : 'text-[#A8B5A5] hover:text-[#EAE8DF]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-[#14251F] border border-[#A8B5A5]/30 text-[#EAE8DF]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-full">
        {/* Desktop Sidebar (Compact 64 -> 240px) */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#14251F] border-r border-[#A8B5A5]/20 shrink-0">
          <div className="p-4 border-b border-[#A8B5A5]/15">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A8B5A5] block">
              Authority Modules
            </span>
            <span className="text-xs font-serif text-[#EAE8DF] font-bold">
              Regional Command Center
            </span>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs font-mono transition-all ${
                    isActive
                      ? 'bg-[#252C28] text-[#EAE8DF] border-l-2 border-[#C77B43] font-bold'
                      : 'text-[#A8B5A5] hover:text-[#EAE8DF] hover:bg-[#1B201D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-[#C77B43]' : 'text-[#A8B5A5]'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono shrink-0 ${
                        isActive
                          ? 'bg-[#C77B43] text-[#14251F] font-bold'
                          : 'bg-[#252C28] text-[#A8B5A5] border border-[#A8B5A5]/25'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Status Footer */}
          <div className="p-4 border-t border-[#A8B5A5]/15 text-[10px] font-mono text-[#A8B5A5] space-y-1 bg-[#1B201D]">
            <div className="flex justify-between">
              <span>Jurisdiction:</span>
              <span className="text-[#EAE8DF]">Ward M/W &amp; M/E</span>
            </div>
            <div className="flex justify-between">
              <span>System Status:</span>
              <span className="text-[#667B70] font-bold">Grid Operational</span>
            </div>
            <div className="pt-1 text-[9px] text-[#A8B5A5]/60">
              Station Telemetry: Real-time (CPCB)
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#14251F]">
          {/* Main Slot */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}

export function GovernmentShell({ children }: GovernmentShellProps) {
  return (
    <div className="min-h-screen bg-[#14251F] text-[#EAE8DF] font-sans flex flex-col selection:bg-[#C77B43] selection:text-[#14251F]">
      <ShellNavigation>{children}</ShellNavigation>
    </div>
  );
}
