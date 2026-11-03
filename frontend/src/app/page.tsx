'use client';

import React, { useState } from 'react';
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
  Building2,
  Briefcase,
  Shield,
  Layers,
  Sparkles,
  BarChart3,
  Flame,
  CheckCircle,
  FileCheck2,
  TreePine,
  ThermometerSun
} from 'lucide-react';

export default function LandingPage() {
  const [selectedRoleModal, setSelectedRoleModal] = useState(false);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section id="home" className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 text-white p-8 sm:p-14 overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs text-emerald-300 font-semibold tracking-wide">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Environmental Intelligence & Regulatory Compliance System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Detect Emissions. Assess Severity. <span className="text-emerald-400">Enforce Clean Air.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            A unified municipal environmental intelligence platform connecting citizens, enforcement authorities, and regional managers. Empowering communities to report pollution with voice input, automating intelligent multi-parameter severity assessment, and tracing upwind plumes with explainable meteorological modeling.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <ShieldAlert className="w-5 h-5 text-slate-950" />
              <span>Report an Incident</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-all"
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Sign In to Your Portal</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Overview: 4 Core Capabilities */}
      <section id="overview" className="space-y-6 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Platform Overview</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Intelligent Environmental Governance Architecture
          </h2>
          <p className="text-sm text-slate-600">
            Engineered to replace fragmented municipal complaints with unified sensor telemetry, scientific plume tracing, and transparent accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Citizen Empowerment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Public reporting with interactive map pinning, photographic evidence, and hands-free voice description with live speech-to-text.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Intelligent Severity Rating</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated multi-factor severity scoring evaluating local population exposure, surrounding green cover vulnerability, and live CPCB sensor AQI.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Source Apportionment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lagrangian backward trajectory modeling, NOAA wind vectors, and ISRO Bhuvan land-use layers pin down likely industrial or landfill origins.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Regulatory Enforcement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Role-tailored consoles for field inspection assignments, statutory compliance notices, daily/weekly briefings, and multi-incident audit reports.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works: 6-Step End-to-End Workflow */}
      <section id="how-it-works" className="space-y-6 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">End-to-End Operation</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">How the Intelligence Pipeline Works</h2>
          <p className="text-sm text-slate-500">
            From citizen notification to explainable multi-criteria source attribution and verified legal resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Citizen Submits Complaint</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens capture geolocated coordinates via interactive map pin, upload observation details, pollution type, and spoken description.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Automatic Severity Assessment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              System instantly evaluates population density around the location, surrounding green cover percentage, and real-time CPCB sensor readings to classify severity.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Source Plume Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lagrangian backward trajectory modeling, Isolation Forest sensor anomaly detection, and EPA SPECIATE fingerprint matching identify upwind origins.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Investigation Synthesis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Produces transparent, explainable investigation reports clearly distinguishing between directly observed sensor facts and mathematical model findings.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm">
              05
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Government Field Enforcement</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pollution control officers assign field inspection teams, schedule audits, document corrective measures (notices, fines, dousing), and log status history.
            </p>
          </div>

          {/* Step 6 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              06
            </div>
            <h3 className="font-semibold text-slate-900 text-base">Executive Audit & Feedback</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regional Managers compile dynamic daily/weekly briefings and multi-incident audit reports, while citizens provide resolution feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Role-Based Portal Portals (Three Portals Section) */}
      <section id="portals" className="space-y-6 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Access Portals</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Three Dedicated Role-Based Experiences
          </h2>
          <p className="text-sm text-slate-500">
            Each role accesses its own specialized workflow, navigation, and decision-support tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Portal 1: Citizen */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 p-8 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  Public Access
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Citizen Portal</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Submit geolocated pollution complaints with voice input, receive automated severity classifications, inspect investigation reports, and verify resolution.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/login/citizen"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-emerald-600/20"
              >
                Sign In as Citizen
              </Link>
              <Link href="/submit" className="text-xs font-bold text-emerald-700 hover:underline">
                Report Incident →
              </Link>
            </div>
          </div>

          {/* Portal 2: Government Executive Officer */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-800 p-8 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                  Field Operations
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Government Executive Officer</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Field authority console for monitoring sensor anomalies, evaluating plume trajectories, dispatching inspection squads, and logging statutory notices.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/login/government"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                Sign In as Officer
              </Link>
              <Link href="/login/government" className="text-xs font-bold text-slate-700 hover:underline">
                Authority Console →
              </Link>
            </div>
          </div>

          {/* Portal 3: Regional Manager */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-600 p-8 shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-indigo-300 flex items-center justify-center">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase">
                  Executive Directorate
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Regional Manager</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  High-level regional oversight: dynamic daily & weekly briefings, multi-incident consolidated reports, hotspot tracking, and statutory compliance audit.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/login/regional-manager"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-indigo-600/20"
              >
                Sign In as Manager
              </Link>
              <Link href="/login/regional-manager" className="text-xs font-bold text-indigo-700 hover:underline">
                Regional Console →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
