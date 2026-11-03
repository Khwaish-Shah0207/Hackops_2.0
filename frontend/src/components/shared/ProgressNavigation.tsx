'use client';

import React, { useEffect, useState } from 'react';

interface ChapterItem {
  id: string;
  num: string;
  label: string;
}

const CHAPTERS: ChapterItem[] = [
  { id: 'chapter-hero', num: '01', label: 'Overview' },
  { id: 'chapter-problem', num: '02', label: 'Dispersion' },
  { id: 'chapter-reporting', num: '03', label: 'Intake' },
  { id: 'chapter-trajectory', num: '04', label: 'Trajectory' },
  { id: 'chapter-sources', num: '05', label: 'Sources' },
  { id: 'chapter-fingerprint', num: '06', label: 'Speciation' },
  { id: 'chapter-dossier', num: '07', label: 'Dossier' },
  { id: 'chapter-enforcement', num: '08', label: 'Enforcement' },
  { id: 'chapter-access', num: '09', label: 'Access' },
];

export default function ProgressNavigation() {
  const [activeId, setActiveId] = useState<string>('chapter-hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(CHAPTERS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Dossier Chapters"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col space-y-3 pointer-events-auto"
    >
      <div className="text-[9px] font-mono tracking-widest text-sage-muted/70 uppercase mb-1 pl-1">
        Index
      </div>
      {CHAPTERS.map((c) => {
        const isActive = activeId === c.id;
        return (
          <button
            key={c.id}
            onClick={() => scrollTo(c.id)}
            className="group flex items-center justify-end space-x-2 text-right focus:outline-none"
            title={`${c.num} ${c.label}`}
          >
            <span
              className={`text-[10px] font-mono tracking-wider transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                isActive ? 'text-ivory-warm opacity-100 font-semibold' : 'text-sage-muted'
              }`}
            >
              {c.label}
            </span>
            <span
              className={`font-mono text-[10px] transition-colors ${
                isActive ? 'text-accent-orange font-bold' : 'text-sage-muted/60'
              }`}
            >
              {c.num}
            </span>
            <div
              className={`transition-all duration-300 ${
                isActive
                  ? 'w-4 h-0.5 bg-accent-orange'
                  : 'w-1.5 h-0.5 bg-graphite-border group-hover:w-3 group-hover:bg-sage-muted'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

