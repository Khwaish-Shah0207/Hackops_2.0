'use client';

import React from 'react';
import Link from 'next/link';
import { GovernmentShell } from '@/components/government/GovernmentShell';
import { useGovernment } from '@/lib/governmentContext';

export default function OfficerProfilePage() {
  const { incidents, actions, reports } = useGovernment();

  return (
    <GovernmentShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#A8B5A5]/15 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#667B70]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#667B70]">
                Statutory Authority &amp; Officer Verification
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#EAE8DF]">
              Authorized Surveillance Officer Dossier
            </h1>
            <p className="text-xs font-mono text-[#A8B5A5] mt-0.5">
              Identity, statutory enforcement jurisdiction, and active regional inspection caseload.
            </p>
          </div>

          <div className="px-3 py-1.5 bg-[#252C28] border border-[#C77B43] text-xs font-mono">
            Badge: <strong className="text-[#C77B43]">MPCB-SRV-4091-E</strong>
          </div>
        </div>

        {/* 2-Column Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Officer Card & Authority (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#252C28] border border-[#A8B5A5]/25 p-6 space-y-4 font-mono text-xs">
              <div className="flex items-center gap-4 pb-4 border-b border-[#A8B5A5]/15">
                <div className="w-16 h-16 rounded-none bg-[#C77B43]/20 border-2 border-[#C77B43] flex items-center justify-center text-xl font-bold font-mono text-[#C77B43]">
                  RP
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#EAE8DF]">
                    Officer R. K. Patil
                  </h2>
                  <div className="text-[#C77B43] font-bold text-[11px]">
                    Senior Surveillance Officer, Grade 1
                  </div>
                  <div className="text-[10px] text-[#A8B5A5]">
                    Regional Surveillance Wing (Eastern Suburbs)
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1 border-b border-[#A8B5A5]/10">
                  <span className="text-[#A8B5A5]">Regulatory Body:</span>
                  <span className="text-[#EAE8DF] font-bold">Maharashtra Pollution Control Board</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#A8B5A5]/10">
                  <span className="text-[#A8B5A5]">Jurisdiction:</span>
                  <span className="text-[#EAE8DF]">Air Act 1981 (Sec 21 &amp; 31A)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#A8B5A5]/10">
                  <span className="text-[#A8B5A5]">Regional Ward:</span>
                  <span className="text-[#EAE8DF]">Ward M/W &amp; Ward M/E, Mumbai</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#A8B5A5]/10">
                  <span className="text-[#A8B5A5]">Clearance Level:</span>
                  <span className="text-[#667B70] font-bold">Level 3 (Full Dispatch &amp; Notice Authority)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#A8B5A5]">Assigned Mobile Unit:</span>
                  <span className="text-[#EAE8DF]">Rapid Response Van 2 (MH-03-EN-9104)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/government/incidents"
                  className="block w-full py-2.5 bg-[#C77B43] hover:bg-[#C77B43]/90 text-[#14251F] text-center font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  View Assigned Incident Roster &rarr;
                </Link>
              </div>
            </div>

            {/* Statutory Warrant Notice */}
            <div className="p-4 bg-[#14251F] border border-[#A8B5A5]/20 font-mono text-xs text-[#A8B5A5] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#EAE8DF] block">
                Statutory Warrant Authority:
              </span>
              <p className="text-[11px] leading-relaxed">
                Authorized under Section 21 and Section 31A of the Air (Prevention and Control of Pollution) Act, 1981 to enter, inspect industrial premises, seize grab samples of ambient air, and issue emergency stop-work notices for illicit open waste incineration.
              </p>
            </div>
          </div>

          {/* Right Column: Caseload & Performance Audit (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#14251F] border border-[#A8B5A5]/25 p-6 space-y-4 font-mono text-xs">
              <div className="pb-3 border-b border-[#A8B5A5]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C77B43] block">
                    Operational Caseload
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#EAE8DF]">
                    Current Surveillance Allocation
                  </h3>
                </div>
                <span className="text-[10px] text-[#A8B5A5]">Duty Shift: 14:00 - 22:00 IST</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#252C28] border border-[#C77B43]/40">
                  <span className="text-[10px] text-[#A8B5A5] uppercase block">Active Dockets</span>
                  <div className="text-2xl font-bold text-[#C77B43] mt-1">{incidents.length}</div>
                  <span className="text-[9px] text-[#A8B5A5]">Under direct oversight</span>
                </div>

                <div className="p-3 bg-[#252C28] border border-[#A8B5A5]/20">
                  <span className="text-[10px] text-[#A8B5A5] uppercase block">Directives Issued</span>
                  <div className="text-2xl font-bold text-[#EAE8DF] mt-1">{actions.length}</div>
                  <span className="text-[9px] text-[#A8B5A5]">Statutory notices</span>
                </div>

                <div className="p-3 bg-[#252C28] border border-[#667B70]/40">
                  <span className="text-[10px] text-[#A8B5A5] uppercase block">Reports Signed</span>
                  <div className="text-2xl font-bold text-[#667B70] mt-1">{reports.length}</div>
                  <span className="text-[9px] text-[#A8B5A5]">Approved forensic briefs</span>
                </div>
              </div>

              {/* Recent Actions Signed */}
              <div className="pt-3 border-t border-[#A8B5A5]/15 space-y-2">
                <span className="text-[10px] uppercase text-[#A8B5A5] block">
                  Recent Regulatory Directives Signed by Officer:
                </span>
                <div className="space-y-2">
                  {actions.slice(0, 3).map((act) => (
                    <div key={act.id} className="p-2.5 bg-[#252C28] border border-[#A8B5A5]/15 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-[#EAE8DF] mr-2">{act.action_ref}</span>
                        <span className="text-[#A8B5A5]">{act.action_type} ({act.target_facility})</span>
                      </div>
                      <span className="text-[#C77B43] font-bold">{act.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cryptographic Signing & Public Key Status */}
            <div className="bg-[#252C28] border border-[#A8B5A5]/20 p-5 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#A8B5A5]/15">
                <span className="text-[10px] uppercase text-[#A8B5A5]">Digital Signature Token</span>
                <span className="text-[#667B70] font-bold text-[10px]">&bull; Token Active (Hardware Keystore)</span>
              </div>
              <div className="text-[11px] text-[#A8B5A5] space-y-1">
                <div>Public Key Hash: <span className="text-[#EAE8DF]">SHA256:7f92a10b...88c4</span></div>
                <div>Issued by: <span className="text-[#EAE8DF]">Govt of Maharashtra PKI Sub-CA</span></div>
                <div>Validity: <span className="text-[#EAE8DF]">2026-01-01 to 2027-12-31</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GovernmentShell>
  );
}

