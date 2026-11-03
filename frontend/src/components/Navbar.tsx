'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wind,
  Shield,
  FileText,
  BarChart3,
  PlusCircle,
  LogIn,
  LogOut,
  Briefcase,
  Users,
  Compass,
  Activity,
  X,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { getStoredUser, clearAuth, type StoredUser } from '@/lib/auth';
import BmcNotificationBar from '@/components/BmcNotificationBar';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeRegionalTab, setActiveRegionalTab] = useState<string>('overview');

  useEffect(() => {
    setCurrentUser(getStoredUser());
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) setActiveRegionalTab(tab);
    }
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    router.push('/');
  };

  // Determine which portal context to render
  const isCitizenRoute = pathname.startsWith('/citizen') || pathname === '/submit';
  const isGovRoute = pathname.startsWith('/government') || pathname === '/analytics' || (pathname.startsWith('/incidents') && currentUser?.role === 'government');
  const isRegionalRoute = pathname.startsWith('/regional-manager');
  const isLandingOrPublic = pathname === '/' || pathname.startsWith('/login');

  let portalMode: 'public' | 'citizen' | 'government' | 'regional' = 'public';

  if (!isLandingOrPublic) {
    if (isRegionalRoute || currentUser?.role === 'regional_manager') {
      portalMode = 'regional';
    } else if (isGovRoute || currentUser?.role === 'government' || currentUser?.role === 'admin') {
      portalMode = 'government';
    } else if (isCitizenRoute || currentUser?.role === 'citizen') {
      portalMode = 'citizen';
    }
  }

  // 1. PUBLIC LANDING LINKS
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/#overview', label: 'Platform Overview' },
    { href: '/#how-it-works', label: 'How It Works' },
  ];

  // 2. CITIZEN LINKS
  const citizenLinks = [
    { href: '/citizen', label: 'Dashboard', icon: FileText },
    { href: '/submit', label: 'Report Incident', icon: PlusCircle },
    { href: '/citizen#reports', label: 'My Reports', icon: FileCheck2 },
    { href: '/citizen#track', label: 'Track Incidents', icon: Activity },
  ];

  // 3. GOVERNMENT EXECUTIVE OFFICER LINKS — Exactly 3 visible sections
  const govLinks = [
    { href: '/government', label: 'Dashboard', icon: Shield },
    { href: '/analytics', label: 'Air Intelligence', icon: BarChart3 },
    { href: '/incidents/4', label: 'Pollution Sources', icon: Compass },
  ];

  // 4. REGIONAL MANAGER LINKS — Single authoritative navigation
  const regionalLinks = [
    { href: '/regional-manager?tab=overview', tabKey: 'overview', label: 'Overview', icon: BarChart3 },
    { href: '/regional-manager?tab=incidents', tabKey: 'incidents', label: 'Incidents', icon: Shield },
    { href: '/regional-manager?tab=reports', tabKey: 'reports', label: 'Reports', icon: FileText },
    { href: '/regional-manager?tab=daily', tabKey: 'daily', label: 'Daily Briefing', icon: Calendar },
    { href: '/regional-manager?tab=weekly', tabKey: 'weekly', label: 'Weekly Briefing', icon: TrendingUp },
  ];

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand with dynamic role subheader */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                  Enviro<span className="text-emerald-400">Intel</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                  {portalMode === 'citizen' && 'Citizen Clean Air Portal'}
                  {portalMode === 'government' && 'Government Executive Officer'}
                  {portalMode === 'regional' && 'Regional Directorate Console'}
                  {portalMode === 'public' && 'Source Apportionment & Compliance'}
                </span>
              </div>
            </Link>

            {/* Navigation Links — Strictly Role-Based */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Public Mode Links */}
              {portalMode === 'public' && (
                <div className="flex items-center space-x-2">
                  {publicLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Citizen Mode Links */}
              {portalMode === 'citizen' && (
                <div className="flex items-center space-x-1">
                  {citizenLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Government Executive Officer Mode Links (3 Consolidated Sections) */}
              {portalMode === 'government' && (
                <div className="flex items-center space-x-1">
                  {govLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Regional Manager Mode Links (Single Unified Navbar) */}
              {portalMode === 'regional' && (
                <div className="flex items-center space-x-1">
                  {regionalLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = activeRegionalTab === link.tabKey;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setActiveRegionalTab(link.tabKey)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                            : 'text-slate-300 hover:text-indigo-300 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>

            {/* Right Action CTA & Auth Widget */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {currentUser ? (
                // Authenticated User State
                <div className="flex items-center space-x-3">
                  {/* Shortcut to their dashboard if they are browsing landing page */}
                  {portalMode === 'public' && (
                    <Link
                      href={
                        currentUser.role === 'regional_manager'
                          ? '/regional-manager'
                          : currentUser.role === 'government' || currentUser.role === 'admin'
                          ? '/government'
                          : '/citizen'
                      }
                      className="hidden sm:inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <span>
                        {currentUser.role === 'regional_manager'
                          ? 'Open Manager Console'
                          : currentUser.role === 'government' || currentUser.role === 'admin'
                          ? 'Open Executive Console'
                          : 'Open Citizen Portal'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}

                  {/* Citizen Quick Report Button */}
                  {portalMode === 'citizen' && pathname !== '/submit' && (
                    <Link
                      href="/submit"
                      className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Report Smoke</span>
                    </Link>
                  )}

                  {/* User Profile Badge */}
                  <div className="flex flex-col items-end leading-tight">
                    <span className="text-xs font-bold text-slate-200">{currentUser.full_name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        currentUser.role === 'regional_manager'
                          ? 'text-indigo-400'
                          : currentUser.role === 'government' || currentUser.role === 'admin'
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {currentUser.role === 'regional_manager'
                        ? 'Regional Manager'
                        : currentUser.role === 'government' || currentUser.role === 'admin'
                        ? 'Executive Officer'
                        : 'Citizen'}
                    </span>
                  </div>

                  {/* Logout Button (Redirects to landing page) */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-700 hover:border-red-800 transition-all"
                    title="Logout to Home"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                // Public / Guest State — Prominent Login Button & Report Action
                <div className="flex items-center space-x-2">
                  <Link
                    href="/submit"
                    className="hidden sm:inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Report Incident</span>
                  </Link>

                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-emerald-900/40 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white" />
                    <span>Portal Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BMC Notification Bar (Always visible across Citizen, Government, and Regional portals) */}
      {portalMode !== 'public' && <BmcNotificationBar />}

      {/* Role Selection Modal (Triggered by Login button on Landing / Navbar) */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 relative text-slate-100">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Access Authorization</span>
              <h3 className="text-2xl font-black text-white">Select Your Portal Role</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Choose the designated access tier to enter your specialized dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Role 1: Citizen */}
              <Link
                href="/login/citizen"
                onClick={() => setIsLoginModalOpen(false)}
                className="group p-5 rounded-2xl border-2 border-slate-800 hover:border-emerald-500 bg-slate-850/80 hover:bg-emerald-950/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 text-emerald-400 flex items-center justify-center transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Citizen</h4>
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full uppercase border border-emerald-500/30">Public</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Report pollution incidents with voice & camera evidence and track investigations.
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Role 2: Government Executive Officer */}
              <Link
                href="/login/government"
                onClick={() => setIsLoginModalOpen(false)}
                className="group p-5 rounded-2xl border-2 border-slate-800 hover:border-emerald-500 bg-slate-850/80 hover:bg-slate-800 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Executive Officer</h4>
                    <span className="text-[10px] text-slate-300 font-semibold bg-slate-800 px-2 py-0.5 rounded-full uppercase border border-slate-700">Operations</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Field inspection management, enforcement notices, and air intelligence data.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-200 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Role 3: Regional Manager */}
              <Link
                href="/login/regional-manager"
                onClick={() => setIsLoginModalOpen(false)}
                className="group p-5 rounded-2xl border-2 border-slate-800 hover:border-indigo-500 bg-slate-850/80 hover:bg-indigo-950/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-indigo-300 flex items-center justify-center border border-indigo-800">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Regional Manager</h4>
                    <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/20 px-2 py-0.5 rounded-full uppercase border border-indigo-500/30">Executive</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Strategic oversight, multi-incident audits, daily/weekly briefings, and policy compliance.
                  </p>
                </div>
                <div className="text-xs font-bold text-indigo-400 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
