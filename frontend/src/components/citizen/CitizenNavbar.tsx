'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserShieldIcon, PlusCircleIcon } from '@/components/shared/CustomIcons';

interface CitizenNavbarProps {
  userName?: string;
  userOrg?: string;
}

export default function CitizenNavbar({
  userName = 'Aarav Sharma',
  userOrg = 'Chembur RWA',
}: CitizenNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-forest-charcoal/95 border-b border-graphite-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Platform Brand & Portal Identity */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-2.5 h-2.5 bg-accent-orange" />
            <div className="flex flex-col">
              <span className="font-sans text-xs font-bold tracking-wider uppercase text-ivory-warm">
                Environmental Intelligence
              </span>
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent-orange">
                Citizen Portal
              </span>
            </div>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-graphite-border" />
          <span className="hidden sm:inline-block font-mono text-[11px] text-sage-muted">
            Public Registry Console
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs font-mono tracking-wider">
          <Link
            href="/citizen"
            className={`transition-colors py-1 px-2 border-b-2 ${
              pathname === '/citizen'
                ? 'border-accent-orange text-ivory-warm font-semibold'
                : 'border-transparent text-sage-muted hover:text-ivory-warm'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/track"
            className={`transition-colors py-1 px-2 border-b-2 ${
              pathname.startsWith('/track')
                ? 'border-accent-orange text-ivory-warm font-semibold'
                : 'border-transparent text-sage-muted hover:text-ivory-warm'
            }`}
          >
            Track Reports
          </Link>
          <Link
            href="/submit"
            className={`transition-colors py-1 px-2 border-b-2 ${
              pathname === '/submit'
                ? 'border-accent-orange text-ivory-warm font-semibold'
                : 'border-transparent text-sage-muted hover:text-ivory-warm'
            }`}
          >
            Submit Report
          </Link>
          <Link
            href="/"
            className="text-sage-muted hover:text-ivory-warm transition-colors py-1 px-2"
          >
            Platform Overview
          </Link>
        </nav>

        {/* Right: User Profile & Report CTA */}
        <div className="hidden sm:flex items-center space-x-4">
          {/* User Account Capsule */}
          <div className="flex items-center space-x-2.5 px-3 py-1.5 border border-graphite-border bg-forest-dark text-xs">
            <UserShieldIcon className="w-3.5 h-3.5 text-sage-muted" />
            <div className="flex flex-col text-left">
              <span className="font-sans text-[11px] font-semibold text-ivory-warm leading-tight">
                {userName}
              </span>
              <span className="font-mono text-[9px] text-sage-muted leading-tight">
                {userOrg}
              </span>
            </div>
          </div>

          {/* Report CTA */}
          <Link
            href="/submit"
            className="inline-flex items-center space-x-2 bg-accent-orange hover:bg-accent-orange/90 text-forest-dark text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 transition-colors"
          >
            <PlusCircleIcon className="w-3.5 h-3.5" />
            <span>Report Incident</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            href="/submit"
            className="inline-flex items-center space-x-1.5 bg-accent-orange text-forest-dark text-xs font-semibold px-2.5 py-1"
          >
            <span>Report</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 border border-graphite-border text-sage-muted hover:text-ivory-warm focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-graphite-border bg-forest-charcoal px-6 py-4 space-y-4">
          <div className="space-y-2 font-mono text-xs">
            <Link
              href="/citizen"
              onClick={() => setMobileOpen(false)}
              className={`block py-1.5 ${
                pathname === '/citizen' ? 'text-accent-orange font-bold' : 'text-sage-muted hover:text-ivory-warm'
              }`}
            >
              Dashboard Overview
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileOpen(false)}
              className={`block py-1.5 ${
                pathname.startsWith('/track') ? 'text-accent-orange font-bold' : 'text-sage-muted hover:text-ivory-warm'
              }`}
            >
              Track Reports
            </Link>
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className={`block py-1.5 ${
                pathname === '/submit' ? 'text-accent-orange font-bold' : 'text-sage-muted hover:text-ivory-warm'
              }`}
            >
              Submit New Incident
            </Link>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 text-sage-muted hover:text-ivory-warm"
            >
              Platform Overview
            </Link>
          </div>
          <div className="pt-3 border-t border-graphite-border flex items-center justify-between text-xs">
            <span className="font-sans text-ivory-warm font-semibold">{userName}</span>
            <span className="font-mono text-[10px] text-sage-muted">{userOrg}</span>
          </div>
        </div>
      )}
    </header>
  );
}

