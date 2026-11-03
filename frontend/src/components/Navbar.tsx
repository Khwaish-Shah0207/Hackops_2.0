'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wind, Shield, FileText, BarChart3, AlertTriangle, UserCheck, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Overview', icon: Wind },
    { href: '/citizen', label: 'Citizen Portal', icon: FileText },
    { href: '/submit', label: 'Report Incident', icon: PlusCircle },
    { href: '/government', label: 'Government Dashboard', icon: Shield },
    { href: '/analytics', label: 'Air Intelligence & Data', icon: BarChart3 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      {/* Demonstration Scenario Notice Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-5xl mx-auto w-full">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            <b>DEMONSTRATION SCENARIO ACTIVE:</b> Region A (Chembur Citizen Smoke Report) vs. Region B (Deonar Waste Landfill / Upwind Plume Transport).
          </span>
          <span className="ml-auto text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-medium">
            Synthetic Proof-of-Concept
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                Enviro<span className="text-emerald-600">Intel</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                Source Apportionment & Compliance
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTA */}
          <div className="flex items-center space-x-3">
            <Link
              href="/submit"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Smoke</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

