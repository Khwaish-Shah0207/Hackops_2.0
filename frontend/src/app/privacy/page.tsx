import React from 'react';
import Link from 'next/link';
import MainNavigation from '@/components/shared/MainNavigation';
import EditorialFooter from '@/components/shared/EditorialFooter';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-forest-charcoal text-ivory-warm flex flex-col justify-between">
      <MainNavigation />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-12">
        <div className="space-y-4 border-b border-graphite-border pb-8">
          <div className="inline-flex items-center space-x-2 font-mono text-xs text-accent-green uppercase tracking-wider">
            <span>Privacy Governance</span>
            <span>//</span>
            <span>Data Handling Policy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-ivory-warm">
            Privacy Policy & Data Handling
          </h1>
          <p className="font-mono text-xs text-sage-muted">
            Last Updated: November 2026. Governing geolocation, incident imagery, and reporter information.
          </p>
        </div>

        <div className="space-y-8 text-sm text-ivory-warm/85 font-light leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-sans text-lg font-bold text-ivory-warm uppercase tracking-wide">
              1. Information Collected Upon Incident Submission
            </h2>
            <p>
              When a citizen submits an environmental pollution complaint, the system collects:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-sage-muted">
              <li>Exact geographic coordinates (latitude and longitude) captured via interactive map selection or device location.</li>
              <li>Incident timestamp and physical observation description.</li>
              <li>Photographic attachments demonstrating smoke columns, waste smoldering, or industrial emissions.</li>
              <li>Reporter contact details (email address and full name) when registered, or anonymous guest identifiers when filing publicly.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-lg font-bold text-ivory-warm uppercase tracking-wide">
              2. Purpose of Geolocation & Environmental Data Use
            </h2>
            <p>
              Geospatial coordinates and timestamps are strictly utilized to initialize backward meteorological wind trajectory models, query nearby ambient sensor stations, and correlate historical complaint densities within the emission corridor. Geolocation data is never monetized or shared with commercial advertising entities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-lg font-bold text-ivory-warm uppercase tracking-wide">
              3. Protection of Whistleblowers & Citizen Identity
            </h2>
            <p>
              Public-facing incident tracking dashboards display complaint numbers, general neighborhood sectors, and analytical scores. The identity and specific residential address of citizen complainants are shielded from public view to protect residents from commercial harassment. Only authorized investigation squads can view verified reporter contact channels when follow-up site verification is mandatory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-lg font-bold text-ivory-warm uppercase tracking-wide">
              4. Data Retention & Chain of Custody
            </h2>
            <p>
              All incident records, sensor correlation logs, and government corrective actions are archived with chronological audit timestamps to ensure regulatory transparency. Citizen feedback ratings and reopening triggers remain permanently linked to the case history.
            </p>
          </section>

          <section className="space-y-3 border-t border-graphite-border pt-6 font-mono text-xs text-sage-muted">
            <p>
              [Data Retention Details Requiring Formal Confirmation: Exact timeline for cold-storage archiving of high-resolution photographic evidence and third-party cloud storage residency requirements remain subject to final regulatory agency protocol.]
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-graphite-border">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-mono text-accent-green hover:text-ivory-warm transition-colors"
          >
            <span>← Return to Platform Overview</span>
          </Link>
        </div>
      </main>

      <EditorialFooter />
    </div>
  );
}

