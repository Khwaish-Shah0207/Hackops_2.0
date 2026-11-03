'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightRefinedIcon, ChevronDownIcon } from '@/components/shared/CustomIcons';

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-linked photographic transformation
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.45, 0.65, 0.85]);

  // Progressive typography emergence
  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -30]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.25], [0.95, 1]);
  const gatewaysOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0.85, 1]);

  return (
    <section
      id="chapter-hero"
      ref={containerRef}
      className="relative w-full min-h-[140vh] bg-forest-charcoal overflow-hidden flex flex-col justify-between"
    >
      {/* Pinned background photograph with scroll-linked scaling */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
        <motion.div
          style={{ scale: imageScale, y: imageY }}
          className="relative w-full h-full will-change-transform"
        >
          <Image
            src="/images/mumbai-skyline-landing.jpg"
            alt="Mumbai coastal skyline and Bandra-Worli Sea Link at dusk"
            fill
            priority
            quality={92}
            className="object-cover object-center"
          />
        </motion.div>

        {/* Restrained dark cinematic overlays for maximum legibility */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-forest-dark"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/80 via-transparent to-forest-charcoal" />
      </div>

      {/* Floating editorial content layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 min-h-screen flex flex-col justify-between">
        {/* Top Operational Status Bar */}
        <div className="pt-2">
          <div className="inline-flex items-center space-x-3 border border-graphite-border/80 bg-forest-dark/70 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-accent-orange animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest uppercase text-sage-muted">
              Active Investigation Corridor // Region A to Region B
            </span>
          </div>
        </div>

        {/* Central Master Title Typography */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="my-auto max-w-5xl space-y-6 pt-16 pb-12"
        >
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent-orange">
              Regulatory Decision Support System
            </p>
            <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-ivory-warm">
              ENVIRONMENTAL
              <br />
              <span className="text-sage-light">INTELLIGENCE</span>
            </h1>
          </div>

          <motion.p
            style={{ opacity: subtitleOpacity }}
            className="text-lg sm:text-2xl text-ivory-warm/90 font-light max-w-2xl leading-relaxed tracking-wide"
          >
            Connecting environmental observations, scientific evidence and informed action.
          </motion.p>
        </motion.div>

        {/* Integrated Citizen and Government Access Gateways */}
        <motion.div
          style={{ opacity: gatewaysOpacity }}
          className="w-full pt-8 pb-12 border-t border-graphite-border/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
            {/* Citizen Access Gateway */}
            <div className="group border border-graphite-border hover:border-sage-muted bg-forest-dark/80 p-6 sm:p-8 transition-colors duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-graphite-border/40">
                <span className="font-mono text-[11px] tracking-widest text-accent-orange uppercase">
                  Portal 01 // Public
                </span>
                <span className="font-mono text-[11px] text-sage-muted">Verified Registry</span>
              </div>
              <h2 className="font-sans text-2xl font-bold text-ivory-warm mt-4">
                CITIZEN
              </h2>
              <p className="text-sm text-ivory-warm/75 font-normal mt-2 mb-6 leading-relaxed">
                Report environmental incidents and follow their investigation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/submit"
                  className="inline-flex items-center space-x-2 bg-accent-orange hover:bg-accent-orange/90 text-forest-dark font-semibold text-xs tracking-wider uppercase px-4 py-2.5 transition-colors"
                >
                  <span>Report Incident</span>
                  <ArrowRightRefinedIcon className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/citizen"
                  className="inline-flex items-center space-x-2 border border-graphite-border hover:border-sage-muted text-ivory-warm text-xs tracking-wider uppercase px-4 py-2.5 transition-colors"
                >
                  <span>Track Incidents</span>
                </Link>
              </div>
            </div>

            {/* Government Access Gateway */}
            <div className="group border border-graphite-border hover:border-sage-muted bg-forest-dark/80 p-6 sm:p-8 transition-colors duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-graphite-border/40">
                <span className="font-mono text-[11px] tracking-widest text-accent-green uppercase">
                  Portal 02 // Regulatory
                </span>
                <span className="font-mono text-[11px] text-sage-muted">Authorized Officers</span>
              </div>
              <h2 className="font-sans text-2xl font-bold text-ivory-warm mt-4">
                GOVERNMENT
              </h2>
              <p className="text-sm text-ivory-warm/75 font-normal mt-2 mb-6 leading-relaxed">
                Review evidence, investigate incidents and coordinate responses.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/government"
                  className="inline-flex items-center space-x-2 bg-forest-charcoal hover:bg-graphite-deep border border-sage-muted/60 text-ivory-warm font-semibold text-xs tracking-wider uppercase px-4 py-2.5 transition-colors"
                >
                  <span>Enter Authority Console</span>
                  <ArrowRightRefinedIcon className="w-3.5 h-3.5 text-accent-green" />
                </Link>
                <Link
                  href="/analytics"
                  className="inline-flex items-center space-x-2 border border-graphite-border hover:border-sage-muted text-ivory-warm text-xs tracking-wider uppercase px-4 py-2.5 transition-colors"
                >
                  <span>Air Intelligence</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Guidance Indicator */}
          <div className="flex items-center justify-between pt-10 text-sage-muted">
            <span className="font-mono text-[10px] tracking-widest uppercase">
              Scroll to inspect evidence dossier
            </span>
            <div className="flex items-center space-x-2 font-mono text-[10px]">
              <span>[01 / 08]</span>
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

