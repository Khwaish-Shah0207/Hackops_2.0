'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, Shield, Wind, ArrowRight, Activity, BarChart3, Briefcase } from 'lucide-react';
import { isAuthenticated, getUserRole } from '@/lib/auth';

export default function LoginPortalPage() {
  const router = useRouter();

  // If already logged in, skip the chooser and go straight to the right dashboard.
  useEffect(() => {
    if (isAuthenticated()) {
      const role = getUserRole();
      if (role === 'regional_manager') {
        router.replace('/regional-manager');
      } else if (role === 'government' || role === 'admin') {
        router.replace('/government');
      } else {
        router.replace('/citizen');
      }
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center py-12">
      <div className="w-full max-w-5xl space-y-8 px-4">

        {/* Page header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
              <Wind className="w-7 h-7" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Environmental Intelligence Portal
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              Select your access authorization type to proceed to the designated interface.
            </p>
          </div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs text-emerald-700 font-medium">
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Demonstration Scenario Active — Mumbai Eastern Suburbs Plume Corridor</span>
          </div>
        </div>

        {/* 3 portal selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ── Citizen / User Card ─────────────────────────────── */}
          <Link
            href="/login/citizen"
            className="group bg-slate-900 rounded-2xl border-2 border-slate-800 hover:border-emerald-400 p-6 sm:p-7 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center transition-colors">
                <Users className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-white">Citizen / User</h2>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Public
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Submit pollution reports with voice input, view automated AI investigation reports, and track community clean air compliance.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-[11px] text-slate-400">
                <p className="font-semibold text-slate-400 text-xs mb-0.5">Demo credentials</p>
                <p><span className="font-mono text-slate-300">citizen@enviro.gov</span> / <span className="font-mono text-slate-300">citizen123</span></p>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                <span>Sign in as Citizen</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* ── Government Authority Card ────────────────────────── */}
          <Link
            href="/login/government"
            className="group bg-slate-900 rounded-2xl border-2 border-slate-800 hover:border-slate-600 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-colors">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-white">Government Authority</h2>
                  <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Operations
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Field officer console to review incident intelligence, assign inspection wings, log enforcement notices, and track penalties.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="text-[11px] text-slate-400">
                <p className="font-semibold text-slate-400 text-xs mb-0.5">Demo credentials</p>
                <p><span className="font-mono text-slate-400">officer@mpcb.gov.in</span> / <span className="font-mono text-slate-400">officer123</span></p>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>Sign in as Authority</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* ── Regional Manager Card ────────────────────────────── */}
          <Link
            href="/login/regional-manager"
            className="group bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 rounded-2xl border-2 border-indigo-800/60 hover:border-indigo-500 p-6 sm:p-7 shadow-sm hover:shadow-2xl transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-900/60 group-hover:bg-indigo-800/80 flex items-center justify-center transition-colors">
                <Briefcase className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-white">Regional Manager</h2>
                  <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Executive
                  </span>
                </div>
                <p className="text-xs text-indigo-200/70 mt-2 leading-relaxed">
                  High-level oversight: dynamic daily & weekly briefings, multi-incident report generation, hotspot tracking, and regulatory audit.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-900/60 space-y-3">
              <div className="text-[11px] text-indigo-300/60">
                <p className="font-semibold text-indigo-300 text-xs mb-0.5">Demo credentials</p>
                <p><span className="font-mono text-indigo-300/80">manager@mpcb.gov.in</span> / <span className="font-mono text-indigo-300/80">manager123</span></p>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 group-hover:text-indigo-200">
                <span>Sign in as Manager</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>

        {/* Browse without logging in */}
        <p className="text-center text-sm text-slate-400">
          Exploring the demo?{' '}
          <Link href="/citizen" className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium transition-colors">
            Browse public incident feed without logging in →
          </Link>
        </p>

      </div>
    </div>
  );
}
