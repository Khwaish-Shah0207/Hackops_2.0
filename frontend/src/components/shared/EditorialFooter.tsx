import React from 'react';
import Link from 'next/link';

export default function EditorialFooter() {
  return (
    <footer className="w-full bg-forest-dark border-t border-graphite-border py-16 text-ivory-warm">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Identity Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-accent-orange" />
              <span className="font-sans text-sm font-bold tracking-wider uppercase text-ivory-warm">
                Environmental Intelligence Platform
              </span>
            </div>
            <p className="font-mono text-xs text-sage-muted max-w-sm leading-relaxed">
              Multi-criteria decision support for environmental authorities, sensor networks, and citizen incident verification.
            </p>
            <p className="font-mono text-[11px] text-sage-muted/70 pt-2">
              Demonstration baseline configured for Mumbai Eastern Suburbs (Chembur, Govandi, Deonar).
            </p>
          </div>

          {/* Quick Portals Links */}
          <div className="md:col-span-3 space-y-2">
            <span className="font-mono text-xs text-accent-orange font-bold uppercase tracking-wider block">
              Operational Portals
            </span>
            <ul className="space-y-1.5 font-mono text-xs">
              <li>
                <Link href="/citizen" className="text-sage-muted hover:text-ivory-warm transition-colors">
                  Citizen Incident Feed
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sage-muted hover:text-ivory-warm transition-colors">
                  Report Environmental Incident
                </Link>
              </li>
              <li>
                <Link href="/government" className="text-sage-muted hover:text-ivory-warm transition-colors">
                  Government Authority Console
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-sage-muted hover:text-ivory-warm transition-colors">
                  Air Intelligence & Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Compliance Links */}
          <div className="md:col-span-4 space-y-2">
            <span className="font-mono text-xs text-accent-green font-bold uppercase tracking-wider block">
              Legal & Compliance
            </span>
            <ul className="space-y-1.5 font-mono text-xs">
              <li>
                <Link href="/terms" className="text-sage-muted hover:text-ivory-warm transition-colors">
                  Terms of Use & Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sage-muted hover:text-ivory-warm transition-colors">
                  Privacy Policy & Data Handling
                </Link>
              </li>
              <li>
                <a href="#chapter-dossier" className="text-sage-muted hover:text-ivory-warm transition-colors">
                  Data Provenance Matrix
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Notice & Copyright */}
        <div className="pt-8 border-t border-graphite-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono text-sage-muted">
          <p className="max-w-2xl text-[11px] leading-relaxed">
            Regulatory Notice: This platform operates as an explainable decision-support tool. Algorithmic source scores and backward trajectories guide physical site inspections and do not constitute legal declarations of guilt or automated sanctions.
          </p>
          <div className="text-[11px] text-sage-muted/70 shrink-0">
            © 2026 Environmental Intelligence Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

