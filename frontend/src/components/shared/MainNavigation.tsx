'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MainNavigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 border-b ${
        scrolled
          ? 'bg-forest-charcoal/95 border-graphite-border backdrop-blur-sm'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Platform Identity */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-2 h-2 bg-accent-orange" />
          <div className="flex flex-col">
            <span className="font-sans text-xs font-semibold tracking-wider uppercase text-ivory-warm">
              Environmental Intelligence
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-sage-muted">
              Compliance Decision Support
            </span>
          </div>
        </Link>

        {/* Navigation Pathways */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium tracking-wide">
          <a
            href="#chapter-problem"
            className="text-ivory-warm/80 hover:text-ivory-warm transition-colors"
          >
            Atmospheric Dispersion
          </a>
          <a
            href="#chapter-trajectory"
            className="text-ivory-warm/80 hover:text-ivory-warm transition-colors"
          >
            Plume Vector
          </a>
          <a
            href="#chapter-fingerprint"
            className="text-ivory-warm/80 hover:text-ivory-warm transition-colors"
          >
            Chemical Matrix
          </a>
          <a
            href="#chapter-dossier"
            className="text-ivory-warm/80 hover:text-ivory-warm transition-colors"
          >
            Evidence Dossier
          </a>
          <a
            href="#chapter-access"
            className="text-ivory-warm/80 hover:text-ivory-warm transition-colors"
          >
            Gateways
          </a>
        </nav>

        {/* Portal Access Actions */}
        <div className="flex items-center space-x-2.5">
          <Link
            href="/citizen"
            className="text-xs font-medium px-3 py-1.5 border border-graphite-border hover:border-sage-muted text-ivory-warm transition-colors"
          >
            Citizen
          </Link>
          <Link
            href="/government"
            className="text-xs font-medium px-3 py-1.5 bg-forest-dark border border-sage-muted/40 hover:border-sage-muted text-ivory-warm transition-colors"
          >
            Officer
          </Link>
          <Link
            href="/regional-manager"
            className="hidden sm:inline-block text-xs font-medium px-3 py-1.5 bg-graphite-deep border border-accent-orange/40 hover:border-accent-orange text-accent-orange transition-colors"
          >
            Manager
          </Link>
          <Link
            href="/login"
            className="text-xs font-medium px-3 py-1.5 bg-accent-orange hover:bg-accent-orange/90 text-forest-dark font-bold transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
