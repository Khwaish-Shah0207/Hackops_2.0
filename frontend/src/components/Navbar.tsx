'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser, clearAuth, type StoredUser } from '@/lib/auth';
import BmcNotificationBar from '@/components/BmcNotificationBar';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    router.push('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <div className="sticky top-0 z-50 bg-forest-charcoal/95 border-b border-graphite-border backdrop-blur-sm">
      <BmcNotificationBar />

      <header className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 bg-accent-orange" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-ivory-warm">
            Environmental Intelligence Platform
          </span>
        </Link>

        <nav className="flex items-center space-x-4 text-xs font-mono">
          <Link
            href="/citizen"
            className={`px-3 py-1.5 transition-colors ${
              isActive('/citizen') ? 'text-accent-orange font-bold' : 'text-sage-muted hover:text-ivory-warm'
            }`}
          >
            Citizen
          </Link>
          <Link
            href="/government"
            className={`px-3 py-1.5 transition-colors ${
              isActive('/government') ? 'text-accent-orange font-bold' : 'text-sage-muted hover:text-ivory-warm'
            }`}
          >
            Government
          </Link>
          <Link
            href="/regional-manager"
            className={`px-3 py-1.5 transition-colors ${
              isActive('/regional-manager') ? 'text-accent-orange font-bold' : 'text-sage-muted hover:text-ivory-warm'
            }`}
          >
            Regional Manager
          </Link>
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 border border-graphite-border text-sage-muted hover:text-accent-red"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1 bg-accent-orange text-forest-dark font-bold hover:bg-accent-orange/90"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>
    </div>
  );
}
