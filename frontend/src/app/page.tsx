'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Wind, 
  ShieldAlert, 
  Compass, 
  FlaskConical, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  FileSearch, 
  Activity,
  Users,
  Building2
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-8 sm:p-14 overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full text-xs text-emerald-300 font-medium">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Operational Air Intelligence & Source Apportionment</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Detect Smoke. Pinpoint Origins. <span className="text-emerald-400">Enforce Clean Air.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Empowering citizens to report waste burning and emissions incidents while equipping environmental authorities with Lagrangian backward trajectory modeling, sensor anomaly detection, and EPA SPECIATE chemical fingerprinting to investigate pollution sources.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
            >
              <ShieldAlert className="w-5 h-5 text-slate-950" />
              <span>Report an Incident</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            
            <Link
              href="/government"
              className="inline-flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700 font-medium px-6 py-3 rounded-xl transition-all"
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Authority Dashboard</span>
            </Link>

            <Link
              href="/incidents/4"
              className="inline-flex items-center space-x-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium px-5 py-3 rounded-xl transition-all"
            >
              <span>View Demo Incident (INC-2026-0004)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Demonstration Scenario Spotlight Card */}
      <div className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-500"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Demonstration Case Study
              </span>
              <span className="text-xs text-slate-500">Mumbai Eastern Suburbs Plume</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Region A Smoke Report ➔ Region B Upwind Landfill Investigation
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              • <b>Region A:</b> A citizen in Chembur Colony reports dense white-grey smoke and pungent chemical odor.<br/>
              • <b>Meteorology:</b> NOAA wind vector shows wind blowing from 108° (ESE) toward Chembur at 4.2 m/s.<br/>
              • <b>Corridor Anomaly:</b> CPCB sensors at Govandi East and Chembur record severe PM2.5 spikes (218 µg/m³).<br/>
              • <b>Region B:</b> Deonar Landfill & Mankhurd Scrap sorting yards situated directly upwind with recurring historical complaints.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/incidents/4"
              className="inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow transition"
            >
              <FileSearch className="w-4 h-4 text-emerald-400" />
              <span>Explore Investigation Report</span>
            </Link>
            <Link
              href="/citizen"
              className="inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-lg transition"
            >
              <span>Citizen Incident Feed</span>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works: 6-Step End-to-End Workflow */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How the Intelligence Pipeline Works</h2>
          <p className="text-sm text-slate-500">
            From citizen notification to explainable multi-criteria candidate ranking and verifiable regulatory resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Citizen Submits Complaint</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens capture location via interactive map pin, upload observation details, pollution type (smoke, waste burning, industrial fumes), and timestamp.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Environmental Data Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Platform aggregates CPCB ambient air quality readings, NOAA meteorological wind speed/direction, and ISRO Bhuvan land-use classification layers.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Explainable Source Ranking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lagrangian backward trajectory modeling, Isolation Forest sensor anomaly detection, semantic complaint clustering, and SPECIATE fingerprint matching rank candidates.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Investigation Report Synthesis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generates an evidence-backed report with explicit distinctions between observed data, model findings, simulated evidence, and data limitations.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              05
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Government Action & Enforcement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pollution control officers assign field inspection teams, schedule audits, document corrective measures (notices, fines, dousing), and update status history.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
              06
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Citizen Feedback & Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens evaluate whether ambient air quality has improved. If smoke persists, the incident can be flagged for review and automatically reopened.
            </p>
          </div>
        </div>
      </div>

      {/* Stakeholder Login / Portal Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Citizen Reporting Portal</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Submit geolocated pollution complaints, track automated source investigation reports, and verify whether municipal corrective actions eliminated local smoke issues.
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <Link
              href="/citizen"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Enter Citizen Portal
            </Link>
            <Link
              href="/submit"
              className="text-emerald-700 hover:text-emerald-800 text-sm font-medium px-3 py-2"
            >
              Quick File Incident →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-slate-800" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Government Authority Console</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Review prioritized incident reports, evaluate meteorological trajectory maps, assign inspection squads to upwind hotspots, and log compliance enforcement actions.
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <Link
              href="/government"
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
            >
              Access Authority Console
            </Link>
            <Link
              href="/analytics"
              className="text-slate-700 hover:text-slate-900 text-sm font-medium px-3 py-2"
            >
              Air Intelligence Charts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

